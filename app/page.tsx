"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
<<<<<<< Updated upstream
import { BookOpen, ArrowRight, TrendingUp, Users, Compass, ScanLine, Star } from "lucide-react";
=======
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, ScanLine, ArrowRight, ArrowUpRight, Users, BarChart3 } from "lucide-react";
>>>>>>> Stashed changes

export default function LandingPage() {
  const router = useRouter();

  // Eingeloggte Nutzer direkt ins Dashboard schicken
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
<<<<<<< Updated upstream
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
=======
    <div className="-m-4 md:-m-8 bg-[#09090b] text-white overflow-x-hidden">
      <Nav />
      <Hero />
      <FourMoves />
      <ReadingFlow />
      <Voices />
      <FinalCta />
      <Footer />
>>>>>>> Stashed changes
    </div>
  );
}

/* ──────────────────────────────────────────────
   NAVIGATION
─────────────────────────────────────────────── */
function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
      <div className="flex items-center gap-2">
        <div className="bg-white text-black w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg">B</div>
        <span className="font-semibold tracking-[0.2em] text-sm">BOOKSTACK</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-zinc-300 text-sm">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#flow" className="hover:text-white transition-colors">Reading Flow</a>
        <a href="#voices" className="hover:text-white transition-colors">Community</a>
      </div>
      <Link href="/login" className="bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
        Anmelden
      </Link>
    </nav>
  );
}

/* ──────────────────────────────────────────────
   HERO  –  "Lies wieder. Mit Stil."
─────────────────────────────────────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  // Scroll-Position relativ zu diesem Element verfolgen
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Beim Runterscrollen leicht nach oben + ausblenden (Parallax)
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Schwebende Buch-Bilder im Hintergrund
  const floaters = [
    { src: "https://covers.openlibrary.org/b/isbn/9781449493899-L.jpg", className: "top-[20%] left-[8%] w-44 rotate-[-8deg]", delay: 0.2 },
    { src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop", className: "top-[12%] left-[18%] w-40 rotate-[6deg]", delay: 0.35 },
    { src: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", className: "bottom-[14%] left-[14%] w-40 rotate-[5deg]", delay: 0.5 },
    { src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop", className: "top-[14%] right-[10%] w-48 rotate-[7deg]", delay: 0.3 },
    { src: "https://images.unsplash.com/photo-1492539161849-b2b18e79c85f?q=80&w=600&auto=format&fit=crop", className: "bottom-[16%] right-[12%] w-36 rotate-[-6deg]", delay: 0.45 },
  ];

  return (
    <section ref={ref} className="relative h-screen min-h-[720px] flex items-center justify-center overflow-hidden">
      {/* warmer Lichtschein im Hintergrund */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,90,40,0.25),transparent_60%)]" />

      {/* schwebende Buchcover */}
      {floaters.map((f, i) => (
        <motion.img
          key={i}
          src={f.src}
          alt=""
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: f.delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute hidden md:block rounded-2xl shadow-2xl object-cover aspect-[2/3] ${f.className}`}
        />
      ))}

      {/* Zentraler Text */}
      <motion.div style={{ y, opacity }} className="relative z-20 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-white/20 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-xs tracking-[0.2em] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-400" /> BETA · DHBW STUTTGART 2026
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]"
        >
          Lies wieder.<br />
          <span className="italic font-serif bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Mit Stil.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-zinc-300 text-lg max-w-xl mx-auto mt-8 font-light leading-relaxed"
        >
          Scanne deine Bücher per ISBN, verfolge jede Seite und teile deine Lieblingsstellen – BookStack ist dein digitales Regal mit dem Charakter einer guten Buchhandlung.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
        >
          <Link href="/register" className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition-colors">
            Beta starten <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-2 bg-white/5 border border-white/20 backdrop-blur-sm px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-colors">
            <ScanLine className="w-5 h-5" /> Buch scannen
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   VIER BEWEGUNGEN  –  4 große Karten
─────────────────────────────────────────────── */
function FourMoves() {
  const cards = [
    { num: "01", label: "SCANNEN", title: "ISBN in 0,4 Sekunden", text: "Halte dein Buch vor die Kamera. BookStack zieht Cover, Autor und Klappentext via Google Books direkt aus dem Barcode.", glow: "from-purple-900/40", icon: ScanLine },
    { num: "02", label: "LESEN", title: "Jede Seite zählt", text: "Tracke deinen Fortschritt – mit Lesestreaks, persönlichen Zielen und einer Timeline, die zeigt, wie du gelesen hast.", glow: "from-amber-900/40", icon: BookOpen },
    { num: "03", label: "TEILEN", title: "Dein Regal, deine Crew", text: "Folge Freunden, kommentiere Lieblingsstellen und entdeckt gemeinsam Bücher, die ihr sonst nie gefunden hättet.", glow: "from-emerald-900/40", icon: Users },
    { num: "04", label: "VERSTEHEN", title: "Du in Daten", text: "Genres, Tempo, Stimmung – BookStack zeigt dir das Jahr deines Lesens als eleganten Statistik-Stream.", glow: "from-blue-900/40", icon: BarChart3 },
  ];

  return (
    <section id="features" className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">VIER BEWEGUNGEN</p>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">
          Vom Barcode bis zum <span className="italic font-serif">letzten Satz.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.num} delay={i * 0.1}>
              <div className={`relative h-80 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br ${c.glow} to-zinc-950 p-8 flex flex-col justify-between group`}>
                <p className="text-zinc-500 tracking-[0.2em] text-xs">{c.num} — {c.label}</p>
                <div>
                  <Icon className="w-8 h-8 text-white/80 mb-5" strokeWidth={1.5} />
                  <h3 className="text-2xl font-bold mb-3">{c.title}</h3>
                  <p className="text-zinc-400 leading-relaxed font-light max-w-md">{c.text}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   READING FLOW  –  Text links, Bild rechts (sticky)
─────────────────────────────────────────────── */
function ReadingFlow() {
  const steps = [
    { num: "01", label: "AUGENBLICK", title: "Ein Cover, das dich anspringt.", text: "Du läufst durch eine Buchhandlung. Ein Buchrücken zieht dich an. Scan. Es liegt in deinem Regal." },
    { num: "02", label: "HINGABE", title: "Seite für Seite, ohne Druck.", text: "BookStack erinnert dich nicht – es zeigt dir nur, wie weit du schon gekommen bist. Lesen bleibt deine Sache." },
    { num: "03", label: "RESONANZ", title: "Stellen, die nachhallen.", text: "Markiere Sätze. Schreibe Notizen. Teile sie mit Menschen, die das gleiche Buch lieben." },
  ];

  return (
    <section id="flow" className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">READING FLOW</p>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">
          Vier Momente,<br />
          <span className="italic font-serif text-yellow-300">ein Ritual.</span>
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Text-Spalte */}
        <div className="flex flex-col gap-16">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1}>
              <p className="text-yellow-300/60 tracking-[0.2em] text-xs mb-3">{s.num} — {s.label}</p>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light max-w-md">{s.text}</p>
            </Reveal>
          ))}
        </div>

        {/* Bild-Spalte – bleibt beim Scrollen stehen */}
        <div className="hidden md:block sticky top-24 h-[70vh] rounded-3xl overflow-hidden border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-2xl font-bold">Der Wüstenplanet</p>
            <p className="text-zinc-300">Frank Herbert</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   STIMMEN  –  Zitat-Karten (heller Abschnitt)
─────────────────────────────────────────────── */
function Voices() {
  const quotes = [
    { text: "Ein Buch muss die Axt sein für das gefrorene Meer in uns.", author: "Franz Kafka" },
    { text: "Reading is dreaming with open eyes.", author: "Anissa Trisdianty" },
    { text: "Wer liest, lebt doppelt.", author: "Umberto Eco" },
  ];

  return (
    <section id="voices" className="bg-white text-black px-6 md:px-12 py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <p className="text-zinc-400 tracking-[0.3em] text-sm mb-6">WAS LESER SAGEN</p>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">
            Eine Bibliothek voller Stimmen.
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border border-black/10 rounded-3xl p-8 h-full">
                <p className="text-xl leading-relaxed mb-6">„{q.text}"</p>
                <p className="text-zinc-500">— {q.author}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FINAL CTA
─────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="px-6 md:px-12 py-40 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,90,40,0.2),transparent_60%)]" />
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">MACH DEN ERSTEN SCAN</p>
        <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
          Dein nächstes<br />
          <span className="italic font-serif bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
            Kapitel.
          </span>
        </h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto font-light">
          Kostenlos, werbefrei, gebaut mit Liebe für Bücher. Starte jetzt – dein Regal wartet.
        </p>
        <Link href="/register" className="inline-flex items-center gap-2 bg-white text-black font-semibold text-lg px-10 py-5 rounded-full hover:bg-zinc-200 transition-colors">
          Jetzt loslegen <ArrowUpRight className="w-5 h-5" />
        </Link>
      </Reveal>
    </section>
  );
}

/* ──────────────────────────────────────────────
   FOOTER / IMPRESSUM
─────────────────────────────────────────────── */
function Footer() {
  const columns = [
    {
      title: "Produkt",
      links: ["Features", "Reading Flow", "Community", "Buch scannen"],
    },
    {
      title: "Konto",
      links: ["Anmelden", "Registrieren", "Dein Regal", "Einstellungen"],
    },
    {
      title: "Über uns",
      links: ["Das Team", "DHBW Stuttgart", "Kontakt", "GitHub"],
    },
  ];

  return (
    <footer className="border-t border-white/10 px-6 md:px-12 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        {/* Oberer Bereich: Logo + Link-Spalten */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Logo-Spalte */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-black w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg">B</div>
              <span className="font-semibold tracking-[0.2em] text-sm">BOOKSTACK</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Dein digitales Bücherregal. Ein Studienprojekt der DHBW Stuttgart.
            </p>
          </div>

          {/* Link-Spalten */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-zinc-500 text-sm hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Untere Rechtszeile */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-zinc-500 text-sm">© 2026 BookStack · DHBW Stuttgart</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">Nutzungsbedingungen</a>
            <a href="#" className="hover:text-white transition-colors">Cookie-Einstellungen</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
/* ──────────────────────────────────────────────
   HELFER: Reveal – blendet Inhalt beim Scrollen ein
─────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
