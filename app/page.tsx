"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Compass, ArrowRight, TrendingUp } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Kleine Quality-of-Life-Funktion: 
  // Wenn der Nutzer schon (Fake-)eingeloggt ist, leiten wir ihn direkt zum Dashboard weiter.
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] gap-16 py-10 w-full animate-in fade-in duration-1000">
      
      {/* Hero Section */}
      <div className="text-center flex flex-col items-center gap-6 max-w-3xl px-4">
        <div className="flex items-center gap-3 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-400/20 mb-4 cursor-default hover:bg-yellow-400/20 transition-colors">
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold tracking-wide">EpiLog – Dein digitales Bücherregal</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
          Lese-Fortschritte <br className="hidden md:block"/> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            neu erleben.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mt-2 leading-relaxed">
          Dokumentiere jedes gelesene Kapitel, teile deine Erfolge mit Freunden und finde durch unseren Algorithmus dein nächstes Lieblingsbuch.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/register" className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-500 hover:scale-105 transition-all duration-300">
            Kostenlos starten <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300">
            Zum Login
          </Link>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10 px-4">
        
        {/* Feature 1: Tracking */}
        <div className="bg-[#121214] p-8 rounded-3xl border border-zinc-800/50 hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="bg-zinc-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/10 transition-colors">
            <TrendingUp className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Fortschritte tracken</h3>
          <p className="text-zinc-400 leading-relaxed">
            Egal ob Seiten, Kapitel oder Hörbuch-Minuten. Behalte deine Leseziele im Blick und bau dir eine Streak auf, die dich motiviert.
          </p>
        </div>

        {/* Feature 2: Social */}
        <div className="bg-[#121214] p-8 rounded-3xl border border-zinc-800/50 hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-300 group">
          <div className="bg-zinc-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/10 transition-colors">
            <Users className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Mit Freunden teilen</h3>
          <p className="text-zinc-400 leading-relaxed">
            Vernetze dich! Sende Freundschaftsanfragen und sieh in deinem Feed live, wenn <em>"Hans Dune beendet hat"</em>. Tauscht euch über Reviews aus.
          </p>
        </div>

        {/* Feature 3: Discover (Ausblick) */}
        <div className="bg-[#121214] p-8 rounded-3xl border border-zinc-800/50 hover:border-yellow-400/50 hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-4 right-4 bg-yellow-400/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">In Kürze</div>
          <div className="bg-zinc-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/10 transition-colors">
            <Compass className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Neues Entdecken</h3>
          <p className="text-zinc-400 leading-relaxed">
            Bist du bereit für Neues? Unser Algorithmus analysiert deinen Geschmack und schlägt dir passgenaue Bücher vor, die du lieben wirst.
          </p>
        </div>

      </div>
    </div>
  );
}