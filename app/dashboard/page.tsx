"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, Star, Flame, ArrowRight, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  
  // 1. State um sessions erweitern
  const [dashboardData, setDashboardData] = useState<any>({
    firstname: "...",
    bookCount: 0,
    totalPagesRead: 0,
    sessions: [], 
    lastBook: null
  });

  // 2. State für den ausgewählten Zeitraum (Tag / Woche / Monat)
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('day');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard-data");
        if (res.ok) {
          const data = await res.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Daten", error);
      }
    }
    fetchData();
  }, []);

  // 3. Logik zur Berechnung der Graphen-Höhen
  const getActivityBars = () => {
    const sessions = dashboardData.sessions || [];
    let buckets: { pages: number, label?: string, id?: number }[] = [];
    const now = new Date();

    if (timeframe === 'day') {
      // Letzte 7 Tage
      for (let i = 6; i >= 0; i--) {
        const d = new Date(); 
        d.setDate(now.getDate() - i);
        buckets.push({ label: d.toDateString(), pages: 0 });
      }
      sessions.forEach((s: any) => {
        const match = buckets.find(b => b.label === new Date(s.date).toDateString());
        if (match) match.pages += s.pagesRead;
      });
    } else if (timeframe === 'week') {
      // Letzte 4 Wochen
      for (let i = 3; i >= 0; i--) {
        buckets.push({ id: i, pages: 0 });
      }
      sessions.forEach((s: any) => {
        const diffDays = Math.floor((now.getTime() - new Date(s.date).getTime()) / (1000 * 60 * 60 * 24));
        const weekIndex = Math.floor(diffDays / 7);
        if (weekIndex < 4) buckets[3 - weekIndex].pages += s.pagesRead;
      });
    } else if (timeframe === 'month') {
      // Letzte 5 Monate
      for (let i = 4; i >= 0; i--) {
        const d = new Date(); 
        d.setMonth(now.getMonth() - i);
        buckets.push({ id: d.getMonth(), pages: 0 });
      }
      sessions.forEach((s: any) => {
        const match = buckets.find(b => b.id === new Date(s.date).getMonth());
        if (match) match.pages += s.pagesRead;
      });
    }

    // Relativen Prozentwert für die CSS-Höhe berechnen (Maximalwert = 100%)
    const max = Math.max(...buckets.map(b => b.pages), 1);
    return buckets.map(b => (b.pages / max) * 100);
  };

  const barHeights = getActivityBars();

  return (
    <div className="w-full flex flex-col gap-8">
      <Reveal>
        <section className="border-b border-white/10 pb-8">
          <p className="text-zinc-500 tracking-[0.3em] text-xs mb-4">YOUR READING YEAR 2026</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Welcome back, <span className="italic font-serif text-yellow-400">{dashboardData.firstname}.</span>
          </h1>
          <div className="flex items-center gap-2 text-zinc-400">
            <Flame className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <p>You are on a <span className="text-white font-semibold">15-day</span> reading streak.</p>
          </div>
        </section>
      </Reveal>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard index={0} icon={BookOpen} num={dashboardData.bookCount.toString()} label="Books 2026" />
        <StatCard
          index={1}
          icon={Target}
          num={dashboardData.totalPagesRead ? dashboardData.totalPagesRead.toLocaleString('de-DE') : "0"}
          label="Pages read"
        />
        <StatCard index={2} icon={Star} num="4.3" label="Avg. rating" />
        <StatCard index={3} icon={Flame} num="15" label="Day streak" highlight />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Reveal delay={0.15}>
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-zinc-500 tracking-[0.2em] text-xs mb-2">CURRENTLY READING</p>
                <h2 className="text-2xl font-bold">{dashboardData.lastBook ? "Continue Reading" : "No active book"}</h2>
              </div>
              <button onClick={() => router.push('/shelf')} className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-medium transition-colors">
                All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {dashboardData.lastBook ? (
              <div className="flex gap-6 items-center">
                <div className="w-24 h-36 bg-zinc-800 rounded-xl shadow-xl shrink-0 border border-white/10 overflow-hidden flex items-center justify-center">
                  {dashboardData.lastBook.coverKey ? (
                    <img
                      src={`https://covers.openlibrary.org/b/olid/${dashboardData.lastBook.coverKey}-M.jpg`}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-8 h-8 text-zinc-600" />
                  )}
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-bold mb-1 truncate">{dashboardData.lastBook.title}</h3>
                  <div className="w-full max-w-[200px]">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                      <span>{dashboardData.lastBook.pagesRead} / {dashboardData.lastBook.totalPages || "?"} p</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-800">
                      <div className="h-full rounded-full bg-yellow-400" style={{ width: `${(dashboardData.lastBook.pagesRead / (dashboardData.lastBook.totalPages || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-zinc-500">No active book.</p>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 h-full flex flex-col">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-zinc-500 tracking-[0.2em] text-xs mb-2">ACTIVITY</p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" /> Progress
                </h2>
              </div>
              
              {/* Filter-Buttons (Tag / Woche / Monat) */}
              <div className="flex gap-1 bg-zinc-800/50 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setTimeframe('day')} 
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeframe === 'day' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >Tag</button>
                <button 
                  onClick={() => setTimeframe('week')} 
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeframe === 'week' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >Woche</button>
                <button 
                  onClick={() => setTimeframe('month')} 
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeframe === 'month' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                >Monat</button>
              </div>
            </div>
            
            {/* Dynamische Graphen-Balken */}
            <div className="flex-1 flex items-end gap-2 md:gap-3 h-32">
              {barHeights.map((h, i) => (
                <motion.div 
                  key={`${timeframe}-${i}`} // Neu-Animation beim Wechsel des Filters
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  className="w-full rounded-t-md bg-yellow-400/20 relative group"
                >
                  <div className="absolute bottom-0 left-0 w-full rounded-t-md bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ height: '100%' }} />
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, num, label, highlight }: any) {
  return (
    <div className="bg-[#121214] border border-white/10 rounded-3xl p-6">
      <Icon className={`w-5 h-5 mb-2 ${highlight ? "text-yellow-400" : "text-zinc-500"}`} />
      <div className={`text-3xl font-bold ${highlight ? "text-yellow-400" : "text-white"}`}>{num}</div>
      <div className="text-zinc-500 text-sm">{label}</div>
    </div>
  );
}

function Reveal({ children, delay = 0 }: any) {
  return <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>{children}</motion.div>;
}
