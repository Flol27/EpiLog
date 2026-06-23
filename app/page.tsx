"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, TrendingUp, Users, Compass, ScanLine, Star } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="-m-4 md:-m-8">
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] w-full flex items-end overflow-hidden">
        {/* Hintergrundbild */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2560&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Dunkler Verlauf, damit Text lesbar bleibt */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/70 to-[#09090b]/30" />
        </div>

        {/* Logo oben links */}
        <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2 text-yellow-400">
          <BookOpen className="w-8 h-8" />
          <span className="font-bold text-2xl tracking-tight text-white">EpiLog</span>
        </div>

        {/* Hero-Text unten */}
        <div className="relative z-10 px-6 md:px-12 pb-16 md:pb-24 max-w-4xl">
          <div className="flex items-center gap-2 bg-yellow-400/10 text-yellow-400 px-4 py-2 rounded-full border border-yellow-400/20 w-fit mb-6 text-sm font-semibold uppercase tracking-wide">
            <Star className="w-4 h-4 fill-yellow-400" /> Dein digitales Bücherregal
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
            Jede Seite zählt.<br />
            <span className="text-yellow-400">Behalte den Überblick.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mb-8 leading-relaxed font-light">
            EpiLog ist mehr als ein Tracker. Dokumentiere jedes Kapitel, bewerte deine Favoriten und teile deine Meilensteine mit Freunden.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register" className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-500 transition-all duration-300">
              Kostenlos starten <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-300">
              Anmelden
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────── */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Alles, was Leser brauchen.
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl font-light">
            Drei Werkzeuge, die aus dem Lesen ein Erlebnis machen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            image="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1200&auto=format&fit=crop"
            icon={TrendingUp}
            title="Ziele & Statistiken."
            text="Seiten, Kapitel oder Hörbuch-Minuten – behalte deine Leseziele im Blick und baue eine Streak auf."
          />
          <FeatureCard
            image="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop"
            icon={Users}
            title="Community."
            text="Vernetze dich mit anderen Lesern, tausche Bewertungen aus und sieh, was deine Freunde gerade lesen."
          />
          <FeatureCard
            image="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
            icon={Compass}
            title="Entdeckungen."
            text="Unser Algorithmus analysiert deinen Geschmack und schlägt dir Bücher vor, die du lieben wirst."
          />
        </div>
      </section>

      {/* ── SO FUNKTIONIERT'S ────────────────── */}
      <section className="px-6 md:px-12 py-24 bg-[#0d0d0f] border-y border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
              So einfach geht's.
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl font-light">
              In drei Schritten vom Buchregal zur digitalen Bibliothek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <StepCard number="01" icon={ScanLine} title="Scannen." text="Scanne den ISBN-Barcode deines Buchs oder suche per Titel." />
            <StepCard number="02" icon={BookOpen} title="Sammeln." text="Füge das Buch deinem Regal hinzu und verfolge deinen Fortschritt." />
            <StepCard number="03" icon={Star} title="Bewerten." text="Teile deine Meinung und entdecke, was andere empfehlen." />
          </div>
        </div>
      </section>

      {/* ── ABSCHLUSS-CTA ────────────────────── */}
      <section className="px-6 md:px-12 py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">
            Bereit für dein nächstes Kapitel?
          </h2>
          <p className="text-lg text-zinc-400 mb-10 font-light">
            Starte kostenlos und verwandle dein Lesen in eine Reise, die du festhalten kannst.
          </p>
          <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-lg px-10 py-4 rounded-xl hover:bg-yellow-500 transition-all duration-300">
            Jetzt starten <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

// ── Hilfskomponenten ────────────────────────

function FeatureCard({ image, icon: Icon, title, text }: { image: string; icon: any; title: string; text: string }) {
  return (
    <div className="group relative h-96 rounded-3xl overflow-hidden border border-zinc-800/50">
      {/* Bild */}
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      {/* Verlauf */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      {/* Inhalt */}
      <div className="relative h-full flex flex-col justify-end p-8">
        <div className="bg-yellow-400/20 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-yellow-400/30">
          <Icon className="w-6 h-6 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-zinc-300 text-sm leading-relaxed font-light">{text}</p>
      </div>
    </div>
  );
}

function StepCard({ number, icon: Icon, title, text }: { number: string; icon: any; title: string; text: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <span className="text-5xl font-bold text-zinc-700">{number}</span>
        <div className="bg-zinc-800 w-12 h-12 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-yellow-400" />
        </div>
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-light">{text}</p>
    </div>
  );
}