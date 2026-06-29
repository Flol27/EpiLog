"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen, Users, ArrowRight, ArrowUpRight, ScanLine, BarChart3, LucideIcon } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => { if (res.ok) router.push("/dashboard"); })
      .catch(() => {});
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

function Nav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-6">
      <Link href="/" className="flex items-center gap-2 text-yellow-400">
        <BookOpen className="w-8 h-8" />
        <span className="font-bold text-2xl tracking-tight text-white">EpiLog</span>
      </Link>
      <div className="hidden md:flex items-center gap-8 text-zinc-300 text-sm">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#flow" className="hover:text-white transition-colors">Reading Flow</a>
        <a href="#voices" className="hover:text-white transition-colors">Community</a>
      </div>
      <Link href="/login" className="bg-white/10 border border-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors">
        Log In
      </Link>
    </nav>
  );
}

interface Floater {
  src: string;
  className: string;
  delay: number;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const floaters: Floater[] = [
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
        <motion.img key={i} src={f.src} alt="" initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1, delay: f.delay, ease: [0.22, 1, 0.36, 1] }} className={`absolute hidden md:block rounded-2xl shadow-2xl object-cover aspect-[2/3] ${f.className}`} />
      ))}
      <motion.div style={{ y, opacity }} className="relative z-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 border border-white/20 bg-black/30 backdrop-blur-sm px-5 py-2 rounded-full text-xs tracking-[0.2em] mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400" /> BETA · DHBW STUTTGART 2026
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }} className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95]">
          Read with<br />
          <span className="italic font-serif bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">style</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-zinc-300 text-lg max-w-xl mx-auto mt-8 font-light leading-relaxed">
          Scan your books via ISBN, track every page, and share your thoughts – EpiLog is your digital bookshelf with the charm of a good bookstore.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }} className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link href="/register" className="flex items-center justify-center gap-2 bg-white text-black font-semibold px-8 py-4 rounded-full hover:bg-zinc-200 transition-colors">
            Start Beta <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

interface Card {
  num: string;
  label: string;
  title: string;
  text: string;
  glow: string;
  icon: LucideIcon;
}

function FourMoves() {
  const cards: Card[] = [
    { num: "01", label: "SCAN", title: "Scan ISBN instead of typing", text: "Hold your book up to the camera. EpiLog pulls the cover, author, and blurb directly from the barcode via our API.", glow: "from-purple-900/40", icon: ScanLine },
    { num: "02", label: "READ", title: "Every page counts", text: "Track your progress – with reading streaks, personal goals, and a timeline showing how you read.", glow: "from-amber-900/40", icon: BookOpen },
    { num: "03", label: "SHARE", title: "Your shelf, your crew", text: "Follow friends, write reviews, and discover books together that you would have never found otherwise.", glow: "from-emerald-900/40", icon: Users },
    { num: "04", label: "UNDERSTAND", title: "You in data", text: "Genres, pace, mood – EpiLog shows your reading year as an elegant statistics stream.", glow: "from-blue-900/40", icon: BarChart3 },
  ];

  return (
    <section id="features" className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">FOUR MOVEMENTS</p>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">From the barcode to the <span className="italic font-serif">last sentence.</span></h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <Reveal key={c.num} delay={i * 0.1}>
              <div className={`relative h-80 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-br ${c.glow} to-zinc-950 p-8 flex flex-col justify-between`}>
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

interface Step {
  num: string;
  label: string;
  title: string;
  text: string;
}

function ReadingFlow() {
  const steps: Step[] = [
    { num: "01", label: "THE INSTANT", title: "A cover that catches your eye.", text: "You walk through a bookstore. A spine draws you in. Scan. It's on your shelf. For now as a reminder. Later as a digital bookmark." },
    { num: "02", label: "DEVOTION", title: "Page by page, without pressure.", text: "EpiLog doesn't remind you – it just shows you how far you've come. Reading remains your thing." },
    { num: "03", label: "RESONANCE", title: "Books that echo.", text: "Share your thoughts and feelings about books with other readers, or get inspired by other reviews." },
  ];

  return (
    <section id="flow" className="px-6 md:px-12 py-32 max-w-7xl mx-auto">
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">READING FLOW</p>
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">Three moments,<br /><span className="italic font-serif text-yellow-300">one ritual.</span></h2>
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
          <img src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="text-2xl font-bold">Dune</p>
            <p className="text-zinc-300">Frank Herbert</p>
          </div>
        </div>
      </div>
    </section>
  );
}

interface Quote {
  text: string;
  author: string;
}

function Voices() {
  const quotes: Quote[] = [
    { text: "A book must be the axe for the frozen sea inside us.", author: "Franz Kafka" },
    { text: "Reading is dreaming with open eyes.", author: "Anissa Trisdianty" },
    { text: "He who reads lives twice.", author: "Umberto Eco" },
  ];

  return (
    <section id="voices" className="bg-white text-black px-6 md:px-12 py-32">
      <div className="max-w-7xl mx-auto">
        <Reveal>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-20">A library full of voices.</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="border border-black/10 rounded-3xl p-8 h-full">
                <p className="text-xl leading-relaxed mb-6">"{q.text}"</p>
                <p className="text-zinc-500">— {q.author}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-6 md:px-12 py-40 text-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(120,90,40,0.2),transparent_60%)]" />
      <Reveal>
        <p className="text-zinc-500 tracking-[0.3em] text-sm mb-6">TRACK YOUR FIRST READING PROGRESS</p>
        <h2 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">Your next<br /><span className="italic font-serif bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">chapter.</span></h2>
        <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto font-light">Free, ad-free, built with love for books. Start now – your shelf is waiting.</p>
        <Link href="/register" className="inline-flex items-center gap-2 bg-white text-black font-semibold text-lg px-10 py-5 rounded-full hover:bg-zinc-200 transition-colors">
          Get started now <ArrowUpRight className="w-5 h-5" />
        </Link>
      </Reveal>
    </section>
  );
}

interface NavLink {
  name: string;
  href: string;
}

interface NavColumn {
  title: string;
  links: NavLink[];
}

function Footer() {
  const columns: NavColumn[] = [
    { title: "Product", links: [{ name: "Features", href: "#features" }, { name: "Reading Flow", href: "#flow" }, { name: "Community", href: "#voices" }] },
    { title: "Account", links: [{ name: "Log In", href: "/login" }, { name: "Register", href: "/register" }] },
    { title: "About Us", links: [{ name: "DHBW Stuttgart", href: "https://www.dhbw-stuttgart.de" }, { name: "GitHub", href: "https://github.com/flol27/EpiLog" }] },
  ];

  return (
    <footer className="border-t border-white/10 px-6 md:px-12 pt-20 pb-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-yellow-400 mb-4">
              <BookOpen className="w-8 h-8" />
              <span className="font-bold text-2xl tracking-tight text-white">EpiLog</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs">Your digital bookshelf. A study project of DHBW Stuttgart.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold mb-4">{col.title}</h4>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.name}>
                      <Link href={link.href} target={isExternal ? "_blank" : undefined} rel={isExternal ? "noopener noreferrer" : undefined} className="text-zinc-500 text-sm hover:text-white transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-zinc-500 text-sm">© 2026 EpiLog · DHBW Stuttgart</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
            <span>Imprint</span><span>Privacy Policy</span><span>Terms of Service</span><span>Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
}

function Reveal({ children, delay = 0 }: RevealProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
