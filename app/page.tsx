"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, ScanLine, ArrowRight, ArrowUpRight, Users, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  // Eingeloggte Nutzer direkt ins Dashboard schicken
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="-m-4 md:-m-8 bg-[#09090b] text-white overflow-x-hidden">
      <Nav />
      <Hero />
      <FourMoves />
      <ReadingFlow />
      <Voices />
      <FinalCta />
      <Footer />
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const floaters = [
    { src: "https://covers.openlibrary.org/b/isbn/9781449493899-L.jpg", className: "top-[20%] left-[8%] w-44 rotate-[-8deg]", delay: 0.2 },
    { src: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop", className: "top-[12%] left-[18%] w-40 rotate-[6deg]", delay: 0.35 },
    { src: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", className: "bottom-[14%] left-[14%] w-40 rotate-[5deg]", delay: 0.5 },
    { src: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop", className: "top-[14%] right-[10%] w-48 rotate-[7deg]", delay: 0.3 },
    { src: "https://images.unsplash.com/photo-1492539161849-b2b18e79c85f?q=80&w=600&auto=format&fit=crop", className: "bottom-[16%] right-[12%] w-36 rotate-[-6deg]", delay: 0.45 },
  ];

  return (
    <section ref={ref} className="relative h-screen min-h-[720px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,90,40,0.25),transparent_60%)]" />

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
        <div className="flex flex-col gap-16">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 0.1}>
              <p className="text-yellow-300/60 tracking-[0.2em] text-xs mb-3">{s.num} — {s.label}</p>
              <h3 className="text-2xl font-bold mb-3">{s.title}</h3>
              <p className="text-zinc-400 leading-relaxed font-light max-w-md">{s.text}</p>
            </Reveal>
          ))}
        </div>

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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white text-black w-9 h-9 rounded-lg flex items-center justify-center font-bold text-lg">B</div>
              <span className="font-semibold tracking-[0.2em] text-sm">BOOKSTACK</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">
              Dein digitales Bücherregal. Ein Studienprojekt der DHBW Stuttgart.
            </p>
          </div>

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
