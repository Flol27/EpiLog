"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Home, Library, Compass, Users, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/me")
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, [pathname]);

  useEffect(() => {}, [pathname]);

  if (!mounted) return null;
  if (!isLoggedIn) return null;

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" }).catch(() => {});
    setIsLoggedIn(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Shelf",  href: "/shelf",     icon: Library },
    { name: "Discover",  href: "/discover",  icon: Compass },
    { name: "Friends",   href: "/friends",   icon: Users },
  ];

  return (
    <nav className="flex items-center justify-between w-full gap-2">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-yellow-400 shrink-0">
        <BookOpen className="w-8 h-8" />
        <span className="font-bold text-2xl tracking-tight text-white hidden sm:block">EpiLog</span>
      </Link>

      {/* Nav Links – icons always visible, text only on md+ */}
      <div className="flex items-center gap-1 text-zinc-400 font-medium">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
                isActive
                  ? "text-yellow-400 border border-yellow-400/30 bg-yellow-400/10"
                  : "hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="hidden md:block text-sm">{link.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Right: Profile + Logout */}
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-full bg-zinc-700 overflow-hidden shrink-0">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Profile"
              className="w-full h-full object-cover bg-zinc-800"
            />
          </div>
          <span className="hidden lg:block text-sm text-white font-medium">Alex Thompson</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-zinc-400 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
