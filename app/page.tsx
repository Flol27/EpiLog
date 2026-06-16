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

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto gap-8">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="flex items-center gap-2 text-yellow-400">
          <BookOpen className="w-8 h-8" />
          <span className="font-bold text-2xl tracking-tight text-white">EpiLog</span>
        </div>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-6 text-zinc-400 font-medium">
          <button className="flex items-center gap-2 text-yellow-400 border border-yellow-400/30 bg-yellow-400/10 px-4 py-2 rounded-xl">
            <Home className="w-4 h-4" />
            Dashboard
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Library className="w-4 h-4" />
            My Shelf
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Activity className="w-4 h-4" />
            Activity
          </button>
          <button className="flex items-center gap-2 hover:text-white transition-colors">
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-yellow-500 transition-colors">
            <ScanLine className="w-5 h-5" />
            Scan ISBN
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
              {/* Platzhalter für Profilbild */}
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="hidden lg:block text-sm">
              <p className="text-white font-medium">Alex Thompson</p>
            </div>
            <button className="text-zinc-400 hover:text-white ml-2">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

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