"use client";

import { motion } from "framer-motion";
import { BookOpen, Target, Star, Flame, ArrowRight, TrendingUp } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="w-full flex flex-col gap-8">

      <Reveal>
        <section className="border-b border-white/10 pb-8">
          <p className="text-zinc-500 tracking-[0.3em] text-xs mb-4">YOUR READING YEAR 2026</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3">
            Welcome back, <span className="italic font-serif text-yellow-400">Alex.</span>
          </h1>
          <div className="flex items-center gap-2 text-zinc-400">
            <Flame className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <p>You are on a <span className="text-white font-semibold">15-day</span> reading streak.</p>
          </div>
        </section>
      </Reveal>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard index={0} icon={BookOpen} num="12" label="Books 2026" />
        <StatCard index={1} icon={Target} num="4,234" label="Pages read" />
        <StatCard index={2} icon={Star} num="4.3" label="Avg. rating" />
        <StatCard index={3} icon={Flame} num="15" label="Day streak" highlight />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Reveal delay={0.15}>
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-zinc-500 tracking-[0.2em] text-xs mb-2">CURRENTLY READING</p>
                <h2 className="text-2xl font-bold">My Book</h2>
              </div>
              <button className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-medium transition-colors">
                All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-36 bg-zinc-800 rounded-xl shadow-xl shrink-0 border border-white/10" />
              <div>
                <h3 className="text-xl font-bold mb-1">The Kite Runner</h3>
                <p className="text-zinc-400 mb-4">Khaled Hosseini</p>
                <div className="w-48 max-w-full">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
                    <span>Page 178 / 304</span>
                    <span className="text-yellow-400">59%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "59%" }}
                      transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-yellow-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="bg-[#121214] border border-white/10 rounded-3xl p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-zinc-500 tracking-[0.2em] text-xs mb-2">LAST 5 MONTHS</p>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" /> Reading Activity
                </h2>
              </div>
            </div>
            <div className="flex-1 flex items-end gap-3 h-32 mt-auto">
              {[25, 100, 50, 75, 33].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-full rounded-t-md ${h === 100 ? "bg-yellow-400" : "bg-yellow-400/20 hover:bg-yellow-400/40"} transition-colors`}
                />
              ))}
            </div>
          </div>
        </Reveal>

      </section>
    </div>
  );
}

function StatCard({ index, icon: Icon, num, label, highlight }: { index: number; icon: any; num: string; label: string; highlight?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#121214] border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-1 hover:border-white/20 transition-colors"
    >
      <Icon className={`w-5 h-5 mb-2 ${highlight ? "text-yellow-400 fill-yellow-400" : "text-zinc-500"}`} />
      <span className={`text-3xl md:text-4xl font-bold ${highlight ? "text-yellow-400" : "text-white"}`}>{num}</span>
      <span className="text-zinc-500 text-sm">{label}</span>
    </motion.div>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}