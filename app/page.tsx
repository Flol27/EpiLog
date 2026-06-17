import { 
  BookOpen, 
  Home, 
  Library, 
  Activity, 
  Search, 
  ScanLine, 
  LogOut, 
  Zap, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="w-full">
      <main className="flex flex-col gap-6 w-full">
        {/* Welcome Section */}
        <section className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, <span className="text-yellow-400">Alex</span>
          </h1>
          <div className="flex items-center gap-2 text-zinc-400 text-lg">
            <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <p>You're on a <span className="text-yellow-400 font-semibold">15-day</span> reading streak!</p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard number="12" label="Books in 2026" />
          <StatCard number="4,234" label="Pages Read" />
          <StatCard number="4.3" label="Avg Rating" />
          <StatCard number="15" label="Day Streak" />
        </section>

        {/* Bottom Modules */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
          {/* Currently Reading */}
          <div className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Currently Reading</h2>
              <button className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm font-medium transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-24 h-36 bg-zinc-800 rounded-lg shadow-xl shrink-0 border border-zinc-700"></div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">The Kite Runner</h3>
                <p className="text-zinc-400">Khaled Hosseini</p>
              </div>
            </div>
          </div>

          {/* Activity Chart Placeholder */}
          <div className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50 flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Monthly Reading Activity</h2>
            </div>
            <div className="flex-1 flex items-end gap-2 h-32 mt-auto">
              {/* Simple CSS Bars mimicking a chart */}
              <div className="w-full bg-yellow-400/20 h-1/4 rounded-t-md hover:bg-yellow-400 transition-colors"></div>
              <div className="w-full bg-yellow-400 h-full rounded-t-md"></div>
              <div className="w-full bg-yellow-400/20 h-1/2 rounded-t-md hover:bg-yellow-400 transition-colors"></div>
              <div className="w-full bg-yellow-400/20 h-3/4 rounded-t-md hover:bg-yellow-400 transition-colors"></div>
              <div className="w-full bg-yellow-400/20 h-1/3 rounded-t-md hover:bg-yellow-400 transition-colors"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Eine kleine Hilfs-Komponente für die 4 Statistik-Karten, damit der Code sauber bleibt
function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-[#121214] rounded-3xl p-6 border border-zinc-800/50 flex flex-col justify-center gap-1 hover:border-zinc-700 transition-colors">
      <span className="text-3xl md:text-4xl font-bold text-white">{number}</span>
      <span className="text-zinc-400 text-sm md:text-base">{label}</span>
    </div>
  );
}
