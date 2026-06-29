"use client";

import { useState, useEffect, useMemo } from "react";
import { Users, UserPlus, UserMinus, Search, Flame, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FriendUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string | null;
  profilePic: string | null;
  readStreak: number;
  quote: string | null;
  status: string | null;
  isFriend: boolean;
  mutualCount: number;
}

function Avatar({ user, size = "md" }: { user: FriendUser; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "w-10 h-10 text-sm", md: "w-14 h-14 text-base", lg: "w-20 h-20 text-xl" };
  const initials = `${user.firstname[0]}${user.lastname?.[0] ?? ""}`.toUpperCase();
  const seed = user.username;

  return (
    <div className={`${sizes[size]} rounded-full bg-zinc-800 overflow-hidden shrink-0 ring-2 ring-white/5`}>
      {user.profilePic ? (
        <img src={user.profilePic} alt={user.firstname} className="w-full h-full object-cover" />
      ) : (
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
          alt={user.firstname}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

function UserCard({
  user,
  onToggle,
  loading,
}: {
  user: FriendUser;
  onToggle: (id: number, isFriend: boolean) => void;
  loading: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#121214] border border-white/8 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/15 transition-colors"
    >
      <div className="flex items-start gap-4">
        <Avatar user={user} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white truncate">
            {user.firstname} {user.lastname}
          </p>
          <p className="text-zinc-500 text-sm truncate">@{user.username}</p>
          {user.quote && (
            <p className="text-zinc-400 text-xs mt-1 line-clamp-2 italic">"{user.quote}"</p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        {user.readStreak > 0 && (
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-white font-medium">{user.readStreak}</span> Tage
          </span>
        )}
        {user.mutualCount > 0 && (
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-white font-medium">{user.mutualCount}</span> gemeinsam
          </span>
        )}
      </div>

      {/* Action button */}
      <button
        onClick={() => onToggle(user.id, user.isFriend)}
        disabled={loading}
        className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
          user.isFriend
            ? "bg-white/5 border border-white/10 text-zinc-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
            : "bg-yellow-400 text-black hover:bg-yellow-300"
        }`}
      >
        {user.isFriend ? (
          <><UserMinus className="w-4 h-4" /> Entfernen</>
        ) : (
          <><UserPlus className="w-4 h-4" /> Hinzufügen</>
        )}
      </button>
    </motion.div>
  );
}

export default function FriendsPage() {
  const [users, setUsers] = useState<FriendUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "friends">("friends");

  useEffect(() => {
    fetch("/api/friends")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(targetId: number, isFriend: boolean) {
    setToggling(targetId);
    try {
      if (isFriend) {
        await fetch(`/api/friends?targetId=${targetId}`, { method: "DELETE" });
      } else {
        await fetch("/api/friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId }),
        });
      }
      setUsers((prev) =>
        prev.map((u) => u.id === targetId ? { ...u, isFriend: !isFriend } : u)
      );
    } finally {
      setToggling(null);
    }
  }

  const filtered = useMemo(() => {
    let list = tab === "friends" ? users.filter((u) => u.isFriend) : users;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstname.toLowerCase().includes(q) ||
          u.lastname?.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }
    return list;
  }, [users, tab, search]);

  const friendCount = users.filter((u) => u.isFriend).length;

  return (
    <div className="flex flex-col gap-8 w-full">

      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-zinc-500 tracking-[0.3em] text-xs">DEIN NETZWERK</p>
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-yellow-400" />
          Friends
        </h1>
        <p className="text-zinc-400 text-sm mt-1">
          {friendCount === 0 ? "Noch keine Freunde hinzugefügt." : `${friendCount} ${friendCount === 1 ? "Freund" : "Freunde"} in deinem Netzwerk.`}
        </p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 border border-white/8 rounded-xl p-1">
          {([["friends", "Meine Freunde"], ["all", "Alle Nutzer"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === key
                  ? "bg-yellow-400 text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
              {key === "friends" && friendCount > 0 && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === key ? "bg-black/20" : "bg-white/10"}`}>
                  {friendCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Suchen..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#121214] border border-white/8 rounded-2xl p-5 h-44 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Users className="w-12 h-12 text-zinc-700" />
          <p className="text-zinc-400 text-lg font-medium">
            {tab === "friends" ? "Noch keine Freunde." : "Keine Nutzer gefunden."}
          </p>
          {tab === "friends" && (
            <button
              onClick={() => setTab("all")}
              className="text-yellow-400 text-sm hover:underline"
            >
              Alle Nutzer anzeigen →
            </button>
          )}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onToggle={handleToggle}
                loading={toggling === user.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
