import { Quote, User, quotes as mockQuotes, users as mockUsers } from "./mockData";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

const useMock = !import.meta.env.VITE_API_BASE_URL;

interface ServiceCallLog {
  method: string;
  url: string;
  internalRoute: string;
  responseTime: number;
  status: number;
  serviceName: string;
}

let lastServiceCall: ServiceCallLog | null = null;
export const getLastServiceCall = () => lastServiceCall;

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  if (useMock) {
    return handleMock<T>(path, options);
  }
  const start = performance.now();
  const res = await fetch(`${API_BASE}${path}`, options);
  const elapsed = Math.round(performance.now() - start);
  lastServiceCall = {
    method: options?.method || "GET",
    url: `${API_BASE}${path}`,
    internalRoute: resolveInternalRoute(path),
    responseTime: elapsed,
    status: res.status,
    serviceName: path.startsWith("/api/quotes") ? "quote-service" : "user-service",
  };
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function resolveInternalRoute(path: string): string {
  if (path.startsWith("/api/quotes")) return `http://quote-service:8081${path.replace("/api", "")}`;
  if (path.startsWith("/api/users")) return `http://user-service:8082${path.replace("/api", "")}`;
  return path;
}

function handleMock<T>(path: string, options?: RequestInit): T {
  const method = options?.method || "GET";
  const start = performance.now();

  let result: unknown;
  if (path === "/api/quotes" && method === "GET") {
    result = mockQuotes;
  } else if (path === "/api/quotes/random") {
    result = mockQuotes[Math.floor(Math.random() * mockQuotes.length)];
  } else if (path.startsWith("/api/quotes/category/")) {
    const cat = path.split("/").pop();
    result = mockQuotes.filter((q) => q.category === cat);
  } else if (path.match(/^\/api\/quotes\/\d+$/) && method === "GET") {
    const id = parseInt(path.split("/").pop()!);
    result = mockQuotes.find((q) => q.id === id);
  } else if (path === "/api/users" && method === "GET") {
    result = mockUsers;
  } else if (path.match(/^\/api\/users\/\d+$/) && method === "GET") {
    const id = parseInt(path.split("/").pop()!);
    result = mockUsers.find((u) => u.id === id);
  } else if (path.match(/^\/api\/users\/\d+\/quote$/)) {
    const id = parseInt(path.split("/")[3]);
    const user = mockUsers.find((u) => u.id === id);
    if (user) {
      const catQuotes = mockQuotes.filter((q) => q.category === user.favoriteCategory);
      result = catQuotes[Math.floor(Math.random() * catQuotes.length)];
    }
  } else {
    result = null;
  }

  const elapsed = Math.round(performance.now() - start);
  lastServiceCall = {
    method,
    url: `[mock]${path}`,
    internalRoute: resolveInternalRoute(path),
    responseTime: elapsed,
    status: 200,
    serviceName: path.startsWith("/api/quotes") ? "quote-service" : "user-service",
  };

  return result as T;
}

export const api = {
  getQuotes: () => apiFetch<Quote[]>("/api/quotes"),
  getRandomQuote: () => apiFetch<Quote>("/api/quotes/random"),
  getQuotesByCategory: (cat: string) => apiFetch<Quote[]>(`/api/quotes/category/${cat}`),
  getQuote: (id: number) => apiFetch<Quote>(`/api/quotes/${id}`),
  getUsers: () => apiFetch<User[]>("/api/users"),
  getUser: (id: number) => apiFetch<User>(`/api/users/${id}`),
  getUserQuote: (id: number) => apiFetch<Quote>(`/api/users/${id}/quote`),
};
