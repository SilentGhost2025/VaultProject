import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, BookOpen, Users, Network, Server, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { Quote, User } from "@/lib/mockData";
import { QuoteCard } from "@/components/QuoteCard";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [randomQuote, setRandomQuote] = useState<Quote | null>(null);

  useEffect(() => {
    api.getQuotes().then(setQuotes);
    api.getUsers().then(setUsers);
    api.getRandomQuote().then(setRandomQuote);
  }, []);

  const stats = [
    { label: "Total Quotes", value: quotes.length, icon: BookOpen, color: "text-primary" },
    { label: "User Profiles", value: users.length, icon: Users, color: "text-violet-400" },
    { label: "Services", value: 3, icon: Server, color: "text-sky-400" },
    { label: "Categories", value: 4, icon: Activity, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Microservices Application Overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-border bg-card p-4 card-hover"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {randomQuote && (
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Quote of the Moment</p>
          <p className="text-sm text-foreground">"{randomQuote.text}"</p>
          <p className="mt-1 text-xs text-muted-foreground">— {randomQuote.author}</p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "Quotes Explorer", desc: "Browse & filter quotes", to: "/quotes", icon: BookOpen },
          { title: "User Profiles", desc: "View users & fetch quotes", to: "/users", icon: Users },
          { title: "Service Discovery", desc: "Watch services communicate", to: "/discovery", icon: Network },
        ].map((item, i) => (
          <Link key={item.to} to={item.to}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 card-hover"
            >
              <item.icon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {quotes.slice(0, 6).map((q, i) => (
          <QuoteCard key={q.id} quote={q} index={i} />
        ))}
      </div>
    </div>
  );
}
