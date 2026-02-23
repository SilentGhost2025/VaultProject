export interface Quote {
  id: number;
  text: string;
  author: string;
  category: "motivation" | "humor" | "wisdom" | "tech";
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  favoriteCategory: string;
}

export const quotes: Quote[] = [
  { id: 1, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "motivation" },
  { id: 2, text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs", category: "tech" },
  { id: 3, text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "wisdom" },
  { id: 4, text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "tech" },
  { id: 5, text: "A day without laughter is a day wasted.", author: "Charlie Chaplin", category: "humor" },
  { id: 6, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "motivation" },
  { id: 7, text: "There are only two hard things in CS: cache invalidation and naming things.", author: "Phil Karlton", category: "tech" },
  { id: 8, text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "wisdom" },
  { id: 9, text: "Why do programmers prefer dark mode? Because light attracts bugs.", author: "Unknown", category: "humor" },
  { id: 10, text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "tech" },
  { id: 11, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "motivation" },
  { id: 12, text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "wisdom" },
  { id: 13, text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", author: "Unknown", category: "humor" },
  { id: 14, text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke", category: "tech" },
  { id: 15, text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "motivation" },
  { id: 16, text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "wisdom" },
  { id: 17, text: "There are 10 types of people in this world: those who understand binary and those who don't.", author: "Unknown", category: "humor" },
  { id: 18, text: "Simplicity is the soul of efficiency.", author: "Austin Freeman", category: "tech" },
  { id: 19, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
  { id: 20, text: "Knowledge speaks, but wisdom listens.", author: "Jimi Hendrix", category: "wisdom" },
  { id: 21, text: "A ship in harbor is safe, but that is not what ships are built for.", author: "John A. Shedd", category: "motivation" },
  { id: 22, text: "Programming is thinking, not typing.", author: "Casey Patton", category: "tech" },
  { id: 23, text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "humor" },
  { id: 24, text: "The unexamined life is not worth living.", author: "Socrates", category: "wisdom" },
];

export const users: User[] = [
  { id: 1, name: "Alice Chen", email: "alice@example.com", role: "Backend Engineer", favoriteCategory: "tech" },
  { id: 2, name: "Bob Martinez", email: "bob@example.com", role: "DevOps Lead", favoriteCategory: "motivation" },
  { id: 3, name: "Carol Williams", email: "carol@example.com", role: "Frontend Developer", favoriteCategory: "humor" },
  { id: 4, name: "David Kim", email: "david@example.com", role: "Platform Architect", favoriteCategory: "wisdom" },
  { id: 5, name: "Eva Johnson", email: "eva@example.com", role: "SRE Manager", favoriteCategory: "tech" },
  { id: 6, name: "Frank Liu", email: "frank@example.com", role: "Cloud Engineer", favoriteCategory: "motivation" },
  { id: 7, name: "Grace Patel", email: "grace@example.com", role: "QA Engineer", favoriteCategory: "humor" },
  { id: 8, name: "Henry Brown", email: "henry@example.com", role: "Tech Lead", favoriteCategory: "tech" },
  { id: 9, name: "Iris Taylor", email: "iris@example.com", role: "Product Manager", favoriteCategory: "wisdom" },
  { id: 10, name: "Jake Wilson", email: "jake@example.com", role: "Security Engineer", favoriteCategory: "motivation" },
];
