import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shuffle, BookOpen, Zap, Server, Activity } from "lucide-react";
import { api, getLastServiceCall } from "@/lib/api";
import { Quote } from "@/lib/mockData";
import { QuoteCard } from "@/components/QuoteCard";
import { ServiceDiscoveryPanel } from "@/components/ServiceDiscoveryPanel";

const categories = ["all", "motivation", "humor", "wisdom", "tech"] as const;

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);
  const [serviceLogs, setServiceLogs] = useState<any[]>([]);

  useEffect(() => {
    loadQuotes();
  }, [activeCategory]);

  const loadQuotes = async () => {
    const data = activeCategory === "all"
      ? await api.getQuotes()
      : await api.getQuotesByCategory(activeCategory);
    setQuotes(data);
    const log = getLastServiceCall();
    if (log) setServiceLogs((prev) => [log, ...prev].slice(0, 10));
  };

  const handleRandom = async () => {
    const q = await api.getRandomQuote();
    setRandomQuote(q);
    const log = getLastServiceCall();
    if (log) setServiceLogs((prev) => [log, ...prev].slice(0, 10));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quotes Explorer</h1>
        <p className="text-sm text-muted-foreground">Browse and filter quotes from the quote-service microservice</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
        <button
          onClick={handleRandom}
          className="ml-auto flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Random Quote
        </button>
      </div>

      {randomQuote && (
        <motion.div
          key={randomQuote.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-primary/30 bg-primary/5 p-5 glow-primary"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Random Quote</span>
          </div>
          <p className="text-sm text-foreground">"{randomQuote.text}"</p>
          <p className="mt-1 text-xs text-muted-foreground">— {randomQuote.author}</p>
        </motion.div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.map((q, i) => (
          <QuoteCard key={q.id} quote={q} index={i} />
        ))}
      </div>

      <ServiceDiscoveryPanel logs={serviceLogs} />
    </div>
  );
}
