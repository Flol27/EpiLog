"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Target, Heart, Flame, Info, Pencil, Check, X,
  Quote, Globe, LogOut, Camera
} from "lucide-react";

// Startwerte, falls noch nichts gespeichert wurde
const STORAGE_KEY = "epilog_profile";

const defaultProfile = {
  name: "Alex Thompson",
  handle: "alex.thompson",
  avatarSeed: "Alex",
  status: "Software engineering student who reads way too much sci-fi. Currently trying to beat my own streak record.",
  favGenre: "Sci-Fi",
  favBook: "Dune",
  favQuote: "A reader lives a thousand lives before he dies.",
  readingGoal: 24,
  github: "",
  linkedin: "",
  discord: "",
  website: "",
};

// Sicherheitscheck: nur echte http/https-Links zulassen (kein "javascript:" o.ä.)
function safeUrl(url: string): string | null {
  if (!url) return null;
  const full = url.startsWith("http") ? url : `https://${url}`;
  try {
    const parsed = new URL(full);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return full;
  } catch {
    return null;
  }
  return null;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState(defaultProfile);
  const [backup, setBackup] = useState(defaultProfile);
  const [isEditing, setIsEditing] = useState(false);

  const booksRead = 12; // später aus echten Daten
  const progress = Math.min(Math.round((booksRead / profile.readingGoal) * 100), 100);

  // Beim Laden: gespeichertes Profil aus dem Browser holen
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch {
        // kaputter Eintrag – ignorieren
      }
    }
  }, []);

  const updateField = (field: string, value: string | number) =>
    setProfile((prev) => ({ ...prev, [field]: value }));

  const startEditing = () => {
    setBackup(profile); // aktuellen Stand sichern (für Abbrechen)
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setProfile(backup); // gesicherten Stand zurückholen
    setIsEditing(false);
  };

  const saveProfile = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.avatarSeed)}`;

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">

      {/* ── Header ───────────────────────────── */}
      <section className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50 flex flex-col md:flex-row items-center md:items-start gap-6">

        {/* Avatar */}
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt={profile.name}
            className="w-28 h-28 rounded-full bg-zinc-800 border-2 border-zinc-700 object-cover"
          />
          {isEditing && (
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-2 rounded-full">
              <Camera className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Name + Handle */}
        <div className="flex flex-col gap-2 text-center md:text-left w-full">
          {isEditing ? (
            <input
              value={profile.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-2xl font-bold focus:outline-none focus:border-yellow-400 max-w-xs"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
          )}
          <p className="text-zinc-400">@{profile.handle}</p>
          <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full text-sm w-fit mx-auto md:mx-0">
            Member since 2026
          </span>

          {/* Avatar-Seed nur im Edit-Modus */}
          {isEditing && (
            <div className="mt-2">
              <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Avatar-Stil (beliebiger Text)</label>
              <input
                value={profile.avatarSeed}
                onChange={(e) => updateField("avatarSeed", e.target.value)}
                placeholder="z.B. dein Name"
                className="block mt-1 bg-zinc-900 border border-zinc-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-yellow-400 max-w-xs"
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 md:ml-auto shrink-0">
          {isEditing ? (
            <>
              <button onClick={saveProfile} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2">
                <Check className="w-4 h-4" /> Save
              </button>
              <button onClick={cancelEditing} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors border border-zinc-700 flex items-center gap-2">
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={startEditing} className="bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors border border-zinc-700 flex items-center gap-2">
                <Pencil className="w-4 h-4" /> Edit Profile
              </button>
              <button onClick={handleLogout} className="bg-zinc-900 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 font-medium px-5 py-2.5 rounded-xl transition-colors border border-zinc-800 hover:border-red-900/50 flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </>
          )}
        </div>
      </section>

      {/* ── Status / Bio ─────────────────────── */}
      <section className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50">
        <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-yellow-400" /> Status
        </h2>
        {isEditing ? (
          <textarea
            value={profile.status}
            onChange={(e) => updateField("status", e.target.value)}
            rows={3}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400 resize-none"
          />
        ) : (
          <p className="text-zinc-400 leading-relaxed">{profile.status}</p>
        )}
      </section>

      {/* ── Social Links ─────────────────────── */}
      <section className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-yellow-400" /> Links
        </h2>

        {isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LinkInput label="GitHub" value={profile.github} onChange={(v) => updateField("github", v)} placeholder="github.com/dein-name" />
            <LinkInput label="LinkedIn" value={profile.linkedin} onChange={(v) => updateField("linkedin", v)} placeholder="linkedin.com/in/..." />
            <LinkInput label="Website" value={profile.website} onChange={(v) => updateField("website", v)} placeholder="deine-seite.de" />
            <LinkInput label="Discord" value={profile.discord} onChange={(v) => updateField("discord", v)} placeholder="username" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {safeUrl(profile.github) && (
              <a href={safeUrl(profile.github)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl hover:border-yellow-400 transition-colors">
                <SocialIcon platform="github" /> GitHub
              </a>
            )}
            {safeUrl(profile.linkedin) && (
              <a href={safeUrl(profile.linkedin)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl hover:border-yellow-400 transition-colors">
                <SocialIcon platform="linkedin" /> LinkedIn
              </a>
            )}
            {safeUrl(profile.website) && (
              <a href={safeUrl(profile.website)!} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl hover:border-yellow-400 transition-colors">
                <Globe className="w-5 h-5" /> Website
              </a>
            )}
            {profile.discord && (
              <span className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 text-white px-4 py-2 rounded-xl">
                <SocialIcon platform="discord" /> {profile.discord}
              </span>
            )}
            {!profile.github && !profile.linkedin && !profile.website && !profile.discord && (
              <p className="text-zinc-500 text-sm">Noch keine Links hinzugefügt.</p>
            )}
          </div>
        )}
      </section>

      {/* ── Stats ────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={BookOpen} number={String(booksRead)} label="Books in 2026" />
        <StatCard icon={Target} number="4,234" label="Pages Read" />
        <StatCard icon={Heart} number="4.3" label="Avg Rating" />
        <StatCard icon={Flame} number="15" label="Day Streak" highlight />
      </section>

      {/* ── Reading Goal ─────────────────────── */}
      <section className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" /> Reading Goal 2026
          </h2>
          {isEditing ? (
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              Ziel:
              <input
                type="number"
                value={profile.readingGoal}
                onChange={(e) => updateField("readingGoal", Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-800 rounded-lg py-1 px-2 text-white w-20 focus:outline-none focus:border-yellow-400"
              />
              Bücher
            </div>
          ) : (
            <span className="text-zinc-400 text-sm">{booksRead} / {profile.readingGoal} Bücher</span>
          )}
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-zinc-500 text-sm mt-2">{progress}% geschafft</p>
      </section>

      {/* ── Favorites + Quote ────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50 flex flex-col gap-4 justify-center">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Favorite Genre</div>
            {isEditing ? (
              <input value={profile.favGenre} onChange={(e) => updateField("favGenre", e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white w-full focus:outline-none focus:border-yellow-400" />
            ) : (
              <div className="text-white font-medium text-lg">{profile.favGenre}</div>
            )}
          </div>
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Favorite Book</div>
            {isEditing ? (
              <input value={profile.favBook} onChange={(e) => updateField("favBook", e.target.value)} className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-white w-full focus:outline-none focus:border-yellow-400" />
            ) : (
              <div className="text-white font-medium text-lg italic">"{profile.favBook}"</div>
            )}
          </div>
        </div>

        <div className="bg-[#121214] rounded-3xl p-8 border border-zinc-800/50 flex flex-col justify-center">
          <Quote className="w-8 h-8 text-yellow-400/40 mb-3" />
          {isEditing ? (
            <textarea value={profile.favQuote} onChange={(e) => updateField("favQuote", e.target.value)} rows={3} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400 resize-none" />
          ) : (
            <p className="text-zinc-300 text-lg italic leading-relaxed">"{profile.favQuote}"</p>
          )}
        </div>
      </section>

    </div>
  );
}

// ── Hilfskomponenten ────────────────────────

function StatCard({ icon: Icon, number, label, highlight }: { icon: any; number: string; label: string; highlight?: boolean }) {
  return (
    <div className="bg-[#121214] rounded-3xl p-6 border border-zinc-800/50 flex flex-col justify-center gap-1 hover:border-zinc-700 transition-colors">
      <Icon className={`w-5 h-5 mb-2 ${highlight ? "text-yellow-500 fill-yellow-500" : "text-zinc-400"}`} />
      <span className={`text-3xl md:text-4xl font-bold ${highlight ? "text-yellow-500" : "text-white"}`}>{number}</span>
      <span className="text-zinc-400 text-sm md:text-base">{label}</span>
    </div>
  );
}

function LinkInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
      />
    </div>
  );
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
      </svg>
    );
  }
  if (platform === "discord") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#5865F2]">
        <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    );
  }
  return <Globe className="w-5 h-5" />;
}