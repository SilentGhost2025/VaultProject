import { ServiceDiscoveryPanel } from "@/components/ServiceDiscoveryPanel";
import { useState } from "react";
import { api, getLastServiceCall } from "@/lib/api";
import { Network, Play, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscoveryPage() {
  const [serviceLogs, setServiceLogs] = useState<any[]>([]);
  const [output, setOutput] = useState<string>("");

  const runDemo = async () => {
    setOutput("");
    const steps = [
      { label: "GET /api/quotes (→ quote-service:8081)", fn: () => api.getQuotes() },
      { label: "GET /api/quotes/random (→ quote-service:8081)", fn: () => api.getRandomQuote() },
      { label: "GET /api/users (→ user-service:8082)", fn: () => api.getUsers() },
      { label: "GET /api/users/1/quote (user-service → quote-service via Feign)", fn: () => api.getUserQuote(1) },
    ];

    for (const step of steps) {
      setOutput((prev) => prev + `\n$ curl ${step.label}\n`);
      const result = await step.fn();
      const log = getLastServiceCall();
      if (log) setServiceLogs((prev) => [log, ...prev].slice(0, 20));
      setOutput((prev) => prev + `  → ${JSON.stringify(result).slice(0, 120)}...\n`);
      await new Promise((r) => setTimeout(r, 400));
    }
    setOutput((prev) => prev + "\n✓ All service calls completed.\n");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Service Discovery Demo</h1>
        <p className="text-sm text-muted-foreground">
          Watch microservices communicate in real-time through the API gateway
        </p>
      </div>

      <button
        onClick={runDemo}
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Play className="h-4 w-4" />
        Run Full Demo
      </button>

      {output && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span className="font-mono">Terminal Output</span>
          </div>
          <pre className="max-h-64 overflow-auto font-mono text-[11px] leading-relaxed text-foreground whitespace-pre-wrap">
            {output}
          </pre>
        </motion.div>
      )}

      <ServiceDiscoveryPanel logs={serviceLogs} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">🔍 Watch Service Discovery</h3>
          <pre className="rounded bg-muted/50 p-3 font-mono text-[11px] text-muted-foreground">
{`# Watch Feign calls in user-service logs
kubectl logs -f deployment/user-service

# See gateway routing
kubectl logs -f deployment/api-gateway`}
          </pre>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-2">💀 Test Self-Healing</h3>
          <pre className="rounded bg-muted/50 p-3 font-mono text-[11px] text-muted-foreground">
{`# Delete a pod and watch it restart
kubectl delete pod <quote-service-pod>

# Watch pods recover
kubectl get pods -w

# HPA will maintain 2-5 replicas
kubectl get hpa`}
          </pre>
        </div>
      </div>
    </div>
  );
}
