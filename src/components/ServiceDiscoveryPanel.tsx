import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, Globe, Server, Zap } from "lucide-react";

interface ServiceCallLog {
  method: string;
  url: string;
  internalRoute: string;
  responseTime: number;
  status: number;
  serviceName: string;
}

export function ServiceDiscoveryPanel({ logs }: { logs: ServiceCallLog[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Server className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Service Discovery Demo</h2>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Live
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Watch microservices communicate in real-time. Each API call routes through the gateway to internal services resolved via Kubernetes DNS.
      </p>

      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-6 text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="w-16">Method</span>
          <span className="flex-1">Internal Route</span>
          <span className="w-14 text-right">Time</span>
          <span className="w-10 text-right">Status</span>
        </div>

        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {logs.length === 0 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Click "Get Personalized Quote" on a user card or filter quotes to see service calls appear here.
              </p>
            )}
            {logs.map((log, i) => (
              <motion.div
                key={`${log.url}-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-6 rounded-md bg-muted/30 px-3 py-2 font-mono text-[11px]"
              >
                <span className="w-16 font-semibold text-primary">{log.method}</span>
                <span className="flex flex-1 items-center gap-2 text-card-foreground">
                  <Globe className="h-3 w-3 shrink-0 text-muted-foreground" />
                  <span className="truncate">{log.internalRoute}</span>
                </span>
                <span className="flex w-14 items-center justify-end gap-1 text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  {log.responseTime}ms
                </span>
                <span className="w-10 text-right text-primary">{log.status}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
        <h3 className="mb-2 text-xs font-semibold text-foreground">Architecture Flow</h3>
        <div className="flex items-center justify-center gap-2 text-[10px]">
          <div className="rounded border border-border bg-card px-3 py-1.5 text-muted-foreground">React App</div>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <div className="rounded border border-primary/30 bg-primary/5 px-3 py-1.5 text-primary">API Gateway :8080</div>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <div className="flex gap-2">
            <div className="rounded border border-sky-500/30 bg-sky-500/5 px-3 py-1.5 text-sky-400">quote-service :8081</div>
            <div className="rounded border border-violet-500/30 bg-violet-500/5 px-3 py-1.5 text-violet-400">user-service :8082</div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
          <Zap className="h-3 w-3 text-primary" />
          K8s DNS resolves service names → ClusterIP → Pod
        </div>
      </div>
    </div>
  );
}
