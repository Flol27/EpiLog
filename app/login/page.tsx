"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, User, Lock, AlertCircle } from "lucide-react";
// Importiere deine echte Server Action
import { loginAction } from "./actions"; 

export default function Login() {
  const router = useRouter();
  
  // Zustände für Fehlerbehandlung und Lade-Status
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Formulardaten auslesen
    const formData = new FormData(e.currentTarget);

    try {
      // Deine Server Action ausführen
      const result = await loginAction(formData);

      // Falls deine Action ein Fehler-Objekt zurückgibt
      if (result && result.error) {
        setErrorMessage(result.error);
      } else {
        // Login erfolgreich -> Weiterleitung zum Dashboard oder Shelf
        router.push("/dashboard");
        router.refresh(); // Aktualisiert die Server-Komponenten, damit Cookies greifen
      }
    } catch (error: any) {
      setErrorMessage("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      console.error("Login-Fehler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center -mt-10">
      <div className="bg-[#121214] p-8 md:p-10 rounded-3xl border border-zinc-800/50 w-full max-w-md flex flex-col gap-8 shadow-2xl">
        
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-yellow-400/10 p-3 rounded-2xl border border-yellow-400/20">
            <BookOpen className="w-8 h-8 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
            <p className="text-zinc-400 text-sm mt-1">Log in to track your books.</p>
          </div>
        </div>

        {/* ── Social Logins ── */}
        <div className="flex flex-col gap-3">
          <button type="button" className="flex items-center justify-center gap-3 w-full bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-white py-3 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <button type="button" className="flex items-center justify-center gap-3 w-full bg-[#1877F2]/10 border border-[#1877F2]/30 hover:bg-[#1877F2]/20 text-[#1877F2] py-3 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-zinc-500">
          <hr className="flex-1 border-zinc-800" />
          <span>or with email</span>
          <hr className="flex-1 border-zinc-800" />
        </div>

        {/* ── Fehlermeldung anzeigen ── */}
        {errorMessage && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── Echter Formular-Submit ── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* WICHTIG: Das name="email" Attribut muss exakt mit deiner Action übereinstimmen */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Username or Email</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                name="email"
                placeholder="alex.thompson"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* WICHTIG: Das name="password" Attribut hinzufügen */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-yellow-400 text-black font-bold text-lg py-3 rounded-xl hover:bg-yellow-500 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="text-center text-zinc-400 text-sm">
          Don't have an account?{" "}
          <Link href="/register" className="text-yellow-400 font-medium hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
}