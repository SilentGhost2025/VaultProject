import { User } from "@/lib/mockData";
import { motion } from "framer-motion";
import { Mail, Sparkles, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { api, getLastServiceCall } from "@/lib/api";
import { Quote } from "@/lib/mockData";

const categoryColors: Record<string, string> = {
  motivation: "text-primary",
  humor: "text-amber-400",
  wisdom: "text-violet-400",
  tech: "text-sky-400",
};

export function UserCard({ user, index = 0, onServiceCall }: { user: User; index?: number; onServiceCall?: (log: any) => void }) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const q = await api.getUserQuote(user.id);
      setQuote(q);
      onServiceCall?.(getLastServiceCall());
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="rounded-lg border border-border bg-card p-5 card-hover"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <UserIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{user.role}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Favorite:</span>
            <span className={`text-xs font-medium ${categoryColors[user.favoriteCategory] || "text-muted-foreground"}`}>
              {user.favoriteCategory}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={fetchQuote}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        {loading ? "Fetching..." : "Get Personalized Quote"}
      </button>

      {quote && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 rounded-md bg-muted/50 p-3"
        >
          <p className="text-xs italic text-card-foreground">"{quote.text}"</p>
          <p className="mt-1 text-[10px] text-muted-foreground">— {quote.author}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
