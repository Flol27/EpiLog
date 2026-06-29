"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Eye, EyeOff, ArrowRight, Loader2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormState {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PasswordRule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: PasswordRule[] = [
  { label: "Mindestens 8 Zeichen", test: (pw) => pw.length >= 8 },
  { label: "Mindestens eine Zahl", test: (pw) => /\d/.test(pw) },
  { label: "Mindestens ein Buchstabe", test: (pw) => /[a-zA-Z]/.test(pw) },
];

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordFocused, setPasswordFocused] = useState<boolean>(false);

  function update(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  const allRulesPass = PASSWORD_RULES.every((r) => r.test(form.password));
  const passwordsMatch = form.password === form.confirmPassword && form.confirmPassword !== "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!allRulesPass) {
      setError("Das Kennwort erfüllt nicht alle Anforderungen.");
      return;
    }
    if (!passwordsMatch) {
      setError("Die Kennwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname:  form.lastname || undefined,
          username:  form.username,
          email:     form.email,
          password:  form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.description || data.error || "Registrierung fehlgeschlagen.");
        return;
      }

      // After successful registration, log in automatically
      const loginRes = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (loginRes.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.push("/login");
      }
    } catch {
      setError("Netzwerkfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="-m-4 md:-m-8 min-h-screen bg-[#09090b] text-white flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,90,40,0.18),transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <BookOpen className="w-7 h-7 text-yellow-400" />
          <span className="font-bold text-2xl tracking-tight">EpiLog</span>
        </Link>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-1">Account erstellen</h1>
          <p className="text-zinc-400 text-sm mb-8">Dein digitales Bücherregal wartet.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstname" className="text-sm text-zinc-300 font-medium">
                  Vorname <span className="text-yellow-400">*</span>
                </label>
                <input
                  id="firstname"
                  type="text"
                  autoComplete="given-name"
                  value={form.firstname}
                  onChange={update("firstname")}
                  placeholder="Max"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastname" className="text-sm text-zinc-300 font-medium">
                  Nachname
                </label>
                <input
                  id="lastname"
                  type="text"
                  autoComplete="family-name"
                  value={form.lastname}
                  onChange={update("lastname")}
                  placeholder="Mustermann"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors"
                />
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-sm text-zinc-300 font-medium">
                Benutzername <span className="text-yellow-400">*</span>
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={update("username")}
                placeholder="maxmustermann"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-zinc-300 font-medium">
                E-Mail <span className="text-yellow-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                placeholder="max@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm text-zinc-300 font-medium">
                Kennwort <span className="text-yellow-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={update("password")}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/60 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showPassword ? "Kennwort verbergen" : "Kennwort anzeigen"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength rules */}
              <AnimatePresence>
                {(passwordFocused || form.password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-1.5 pt-2 overflow-hidden"
                  >
                    {PASSWORD_RULES.map((rule) => {
                      const passes = rule.test(form.password);
                      return (
                        <div key={rule.label} className="flex items-center gap-2">
                          <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center transition-colors ${passes ? "bg-green-500/20 text-green-400" : "bg-white/5 text-zinc-600"}`}>
                            {passes
                              ? <Check className="w-2.5 h-2.5" strokeWidth={3} />
                              : <X className="w-2.5 h-2.5" strokeWidth={3} />
                            }
                          </div>
                          <span className={`text-xs transition-colors ${passes ? "text-green-400" : "text-zinc-500"}`}>
                            {rule.label}
                          </span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm text-zinc-300 font-medium">
                Kennwort wiederholen <span className="text-yellow-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors ${
                    form.confirmPassword.length > 0
                      ? passwordsMatch
                        ? "border-green-500/50"
                        : "border-red-500/50"
                      : "border-white/10 focus:border-yellow-400/60"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                  aria-label={showConfirm ? "Kennwort verbergen" : "Kennwort anzeigen"}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.confirmPassword.length > 0 && !passwordsMatch && (
                <p className="text-xs text-red-400">Die Kennwörter stimmen nicht überein.</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Account erstellen <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-xs text-zinc-600 text-center">
              Mit der Registrierung akzeptierst du unsere Nutzungsbedingungen.
            </p>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Bereits registriert?{" "}
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
            Anmelden
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
