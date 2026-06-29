"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Target, Heart, Flame, Pencil, Check, X,
  Quote, LogOut, Camera, AtSign, User, Mail, Hash
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface UserProfile {
  id: number;
  username: string;
  firstname: string;
  lastname: string | null;
  email: string;
  role: string;
  profilePic: string | null;
  readStreak: number;
  quote: string | null;
  status: string | null;
}

function StatCard({ icon: Icon, number, label, highlight = false }: {
  icon: React.ElementType;
  number: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#121214] border border-white/8 rounded-2xl p-6 flex flex-col gap-1 hover:border-white/15 transition-colors"
    >
      <Icon className={`w-5 h-5 mb-2 ${highlight ? "text-yellow-400 fill-yellow-400" : "text-zinc-500"}`} />
      <span className={`text-3xl font-bold ${highlight ? "text-yellow-400" : "text-white"}`}>{number}</span>
      <span className="text-zinc-500 text-sm">{label}</span>
    </motion.div>
  );
}

function Field({ label, icon: Icon, value, editing, onChange, placeholder, type = "text" }: {
  label: string;
  icon: React.ElementType;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5" /> {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60 transition-colors"
        />
      ) : (
        <p className="text-white text-sm font-medium">{value || <span className="text-zinc-600 italic">Not set</span>}</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ firstname: "", lastname: "", username: "", quote: "", status: "" });
  const [backup, setBackup] = useState(form);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => {
        const u = d.user;
        if (!u) { router.push("/login"); return; }
        setProfile(u);
        const f = {
          firstname: u.firstname ?? "",
          lastname:  u.lastname  ?? "",
          username:  u.username  ?? "",
          quote:     u.quote     ?? "",
          status:    u.status    ?? "",
        };
        setForm(f);
        setBackup(f);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function update(field: keyof typeof form) {
    return (v: string) => setForm((prev) => ({ ...prev, [field]: v }));
  }

  function startEdit() { setBackup(form); setEditing(true); }
  function cancelEdit() { setForm(backup); setEditing(false); }

  async function saveProfile() {
    setSaving(true);
    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern.");
      const data = await res.json();
      setProfile(data.user);
      setEditing(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-52 bg-[#121214] rounded-3xl border border-white/8" />
        <div className="h-32 bg-[#121214] rounded-3xl border border-white/8" />
      </div>
    );
  }

  if (!profile) return null;

  const avatarSeed = form.username || profile.username;
  const avatarUrl = profile.profilePic ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
  const fullName = [form.firstname, form.lastname].filter(Boolean).join(" ") || profile.username;

  return (
    <div className="flex flex-col gap-5 w-full">

      {/* ── Hero Card ─────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#121214] border border-white/8 rounded-3xl overflow-hidden"
      >
        {/* Banner */}
        <div className="h-28 bg-gradient-to-br from-yellow-400/20 via-amber-500/10 to-transparent" />

        <div className="px-8 pb-8 -mt-14 flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#121214] bg-zinc-800 shadow-xl">
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            </div>
            {editing && (
              <button className="absolute -bottom-1 -right-1 bg-yellow-400 text-black p-1.5 rounded-lg shadow">
                <Camera className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1 pt-4 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
                <p className="text-zinc-500 text-sm mt-0.5">@{profile.username}</p>
                {profile.role === "admin" && (
                  <span className="mt-2 inline-flex items-center gap-1 text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2.5 py-1 rounded-full font-medium">
                    <Hash className="w-3 h-3" /> Admin
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {editing ? (
                  <>
                    <button
                      onClick={saveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-4 py-2 rounded-xl text-sm transition-colors disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                      <X className="w-4 h-4" /> Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={startEdit}
                      className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                      <Pencil className="w-4 h-4" /> Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 px-4 py-2 rounded-xl text-sm transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status / Quote */}
            {!editing && (profile.status || profile.quote) && (
              <div className="mt-4 flex flex-col gap-2">
                {profile.status && (
                  <p className="text-zinc-400 text-sm leading-relaxed">{profile.status}</p>
                )}
                {profile.quote && (
                  <p className="text-zinc-500 text-sm italic flex items-start gap-2">
                    <Quote className="w-4 h-4 shrink-0 mt-0.5 text-yellow-400/50" />
                    {profile.quote}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} number="12"   label="Books read" />
        <StatCard icon={Target}   number="4,234" label="Pages read" />
        <StatCard icon={Heart}    number="4.3"   label="Avg rating" />
        <StatCard icon={Flame}    number={String(profile.readStreak)} label="Day streak" highlight />
      </section>

      {/* ── Edit Form / Info ──────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#121214] border border-white/8 rounded-3xl p-8"
      >
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-yellow-400" /> Profile Info
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="First Name"  icon={User}    value={form.firstname} editing={editing} onChange={update("firstname")} placeholder="Max" />
          <Field label="Last Name"   icon={User}    value={form.lastname}  editing={editing} onChange={update("lastname")}  placeholder="Mustermann" />
          <Field label="Username"    icon={AtSign}  value={form.username}  editing={editing} onChange={update("username")}  placeholder="maxmustermann" />
          <Field label="Email"       icon={Mail}    value={profile.email}  editing={false}   onChange={() => {}} />

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Status</label>
            {editing ? (
              <input
                value={form.status}
                onChange={(e) => update("status")(e.target.value)}
                placeholder="What are you reading right now?"
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60 transition-colors"
              />
            ) : (
              <p className="text-white text-sm">{profile.status || <span className="text-zinc-600 italic">No status set</span>}</p>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-1.5">
            <label className="text-xs text-zinc-500 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5" /> Favorite Quote
            </label>
            {editing ? (
              <textarea
                value={form.quote}
                onChange={(e) => update("quote")(e.target.value)}
                placeholder="A quote that inspires you..."
                rows={2}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400/60 transition-colors resize-none"
              />
            ) : (
              <p className="text-white text-sm italic">
                {profile.quote ? `"${profile.quote}"` : <span className="text-zinc-600 not-italic">No quote set</span>}
              </p>
            )}
          </div>
        </div>
      </motion.section>

    </div>
  );
}
