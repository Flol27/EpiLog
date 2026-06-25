"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Users, Compass, ArrowRight, TrendingUp, Star, Sparkles } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <>
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2560&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/80 via-[#09090b]/95 to-zinc-950"></div>
      </div>

      <div className="flex flex-col items-center min-h-screen pb-20 w-full">
        
        <div className="flex items-center gap-3 text-yellow-400 mt-4 mb-16 hover:scale-105 transition-transform duration-500 cursor-default">
          <BookOpen className="w-10 h-10" />
          <span className="font-bold text-3xl tracking-tight text-white">EpiLog</span>
        </div>

        <div className="text-center flex flex-col items-center gap-6 max-w-4xl px-4">
          
          <div className="flex items-center gap-3 bg-yellow-400/10 text-yellow-400 px-5 py-2.5 rounded-full border border-yellow-400/20 mb-2 cursor-default hover:bg-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 shadow-[0_0_15px_rgba(250,204,21,0.1)]">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold tracking-wide text-sm uppercase">Your digital bookshelf</span>
            <Sparkles className="w-4 h-4" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            Experience your reading journey <br className="hidden md:block"/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              like never before.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mt-4 leading-relaxed font-light">
            EpiLog is more than just a tracker. Document every chapter, rate your favorites, share milestones with friends, and let our smart algorithm find the book you won't be able to put down next.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link href="/register" className="flex items-center justify-center gap-2 bg-yellow-400 text-black font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] transition-all duration-300">
              Start for free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="flex items-center justify-center gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-zinc-800 transition-all duration-300">
              Go to Login
            </Link>
          </div>
        </div>

        <div className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-20"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 max-w-6xl">
          
          <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 hover:border-yellow-400/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-yellow-400/5 transition-all duration-300 group">
            <div className="bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-300">
              <TrendingUp className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Goals & Stats</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Whether it's pages, chapters, or audiobook minutes. Keep an eye on your reading goals, analyze your habits, and build a streak that motivates you daily.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 hover:border-yellow-400/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-yellow-400/5 transition-all duration-300 group">
            <div className="bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-300">
              <Users className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Community</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Connect with other readers! Send friend requests and see live updates in your feed when <em>"Alex finishes The Martian"</em>. Exchange thoughts on reviews.
            </p>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-md p-8 rounded-3xl border border-zinc-800 hover:border-yellow-400/50 hover:-translate-y-3 hover:shadow-2xl hover:shadow-yellow-400/5 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 text-xs font-bold px-3 py-1 rounded-full">Coming Soon</div>
            <div className="bg-zinc-800 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-400/20 group-hover:scale-110 transition-all duration-300">
              <Compass className="w-7 h-7 text-zinc-300 group-hover:text-yellow-400 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Smart Discoveries</h3>
            <p className="text-zinc-400 leading-relaxed text-sm">
              Ready for something new? Our intelligent algorithm analyzes your taste and suggests perfectly matched books that you will love.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
