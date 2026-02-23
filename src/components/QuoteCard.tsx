import { Quote } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";

const categoryColors: Record<string, string> = {
  motivation: "bg-primary/20 text-primary",
  humor: "bg-amber-500/20 text-amber-400",
  wisdom: "bg-violet-500/20 text-violet-400",
  tech: "bg-sky-500/20 text-sky-400",
};

export function QuoteCard({ quote, index = 0 }: { quote: Quote; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="rounded-lg border border-border bg-card p-5 card-hover"
    >
      <div className="flex items-start gap-3">
        <QuoteIcon className="mt-1 h-4 w-4 shrink-0 text-primary" />
        <div className="flex-1 space-y-3">
          <p className="text-sm leading-relaxed text-card-foreground">{quote.text}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">— {quote.author}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${categoryColors[quote.category] || "bg-badge-bg text-muted-foreground"}`}>
              {quote.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
