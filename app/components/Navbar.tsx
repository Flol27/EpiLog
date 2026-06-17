"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { BookOpen, Home, Library, Activity, Compass, ScanLine, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prüft den Mockup-Login-Status im Browser
  useEffect(() => {
    setMounted(true);
    const loggedInState = localStorage.getItem("isLoggedIn");
    if (loggedInState === "true") {
      setIsLoggedIn(true);
    }
  }, [pathname]); // Aktualisiert sich bei jedem Seitenwechsel
  if (!mounted) return null; // Verhindert kurzes Flackern beim Laden
  if (!isLoggedIn) return null; // Versteckt die Navbar komplett für Gäste

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Shelf", href: "/shelf", icon: Library },
    { name: "Activity", href: "/activity", icon: Activity },
    { name: "Discover", href: "/discover", icon: Compass },
  ];

  return (
    <nav className="flex items-center justify-between w-full">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-yellow-400">
        <BookOpen className="w-8 h-8" />
        <span className="font-bold text-2xl tracking-tight text-white">EpiLog</span>
      </Link>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-2 text-zinc-400 font-medium">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                isActive 
                  ? "text-yellow-400 border border-yellow-400/30 bg-yellow-400/10" 
                  : "hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-2.5 rounded-xl hover:bg-yellow-500 transition-colors">
          <ScanLine className="w-5 h-5" />
          <span className="hidden sm:inline">Scan ISBN</span>
        </button>
        
        {/* Ladezustand abwarten, um UI-Sprünge zu vermeiden */}
        {mounted && (
          isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Profile" className="w-full h-full object-cover bg-zinc-800" />
              </div>
              <div className="hidden lg:block text-sm">
                <p className="text-white font-medium">Alex Thompson</p>
              </div>
              <button onClick={handleLogout} className="text-zinc-400 hover:text-white ml-2" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 text-white font-medium px-5 py-2.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 transition-colors">
              <LogIn className="w-5 h-5" />
              Log In
            </Link>
          )
        )}
      </div>
    </nav>
  );
}