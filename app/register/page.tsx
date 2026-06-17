import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Register() {
  return (
    <div className="flex-1 flex items-center justify-center -mt-10">
      <div className="bg-[#121214] p-8 md:p-10 rounded-3xl border border-zinc-800/50 w-full max-w-md flex flex-col gap-6 shadow-2xl text-center">
        
        <div className="flex justify-center mb-2">
          <div className="bg-yellow-400/10 p-3 rounded-2xl border border-yellow-400/20">
            <BookOpen className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight">Konto erstellen</h1>
        <p className="text-zinc-400">Hier können sich Nutzer bald registrieren.</p>

        <div className="mt-4 p-4 border border-zinc-800 bg-zinc-900 rounded-xl text-zinc-500 text-sm">
          Mockup-Hinweis: Die Registrierung ist noch in Entwicklung.
        </div>

        <Link 
          href="/login" 
          className="w-full bg-zinc-800 text-white font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors mt-4"
        >
          Zurück zum Login
        </Link>
      </div>
    </div>
  );
}