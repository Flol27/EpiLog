"use client";

import { useEffect } from "react";
import { X, Book, Heart, Info, Target, Flame } from "lucide-react";

interface Friend {
  id: string; name: string; avatar: string; about: string; favGenre: string; favBook: string;
  stats: { booksRead: number; pagesRead: number; avgRating: number; dayStreak: number; };
}

interface FriendModalProps {
  friend: Friend | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FriendModal({ friend, isOpen, onClose }: FriendModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !friend) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile */}
        <div className="flex items-center gap-6 mb-8">
          <img src={friend.avatar} alt={friend.name} className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 object-cover" />
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{friend.name}</h2>
            <p className="text-zinc-400 mt-1 flex items-center gap-2">
              <span className="bg-zinc-800 px-3 py-1 rounded-full text-sm border border-zinc-700">Member since '26</span>
            </p>
          </div>
        </div>

        {/* Stats Grid (Like Dashboard) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
            <Book className="w-5 h-5 text-zinc-400 mb-2" />
            <div className="text-2xl font-bold text-white">{friend.stats.booksRead}</div>
            <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Books Read</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
            <Target className="w-5 h-5 text-zinc-400 mb-2" />
            <div className="text-2xl font-bold text-white">{friend.stats.pagesRead}</div>
            <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Pages</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
            <Heart className="w-5 h-5 text-zinc-400 mb-2" />
            <div className="text-2xl font-bold text-white">{friend.stats.avgRating}</div>
            <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Avg Rating</div>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
            <Flame className="w-5 h-5 text-yellow-500 mb-2" />
            <div className="text-2xl font-bold text-yellow-500">{friend.stats.dayStreak}</div>
            <div className="text-xs text-zinc-500 uppercase font-semibold tracking-wider">Day Streak</div>
          </div>
        </div>

        {/* About & Favorites */}
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2"><Info className="w-5 h-5 text-yellow-400"/> About Me</h3>
            <p className="text-zinc-400 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">{friend.about}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Favorite Genre</div>
              <div className="text-white font-medium">{friend.favGenre}</div>
            </div>
            <div className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold">Favorite Book</div>
              <div className="text-white font-medium italic">"{friend.favBook}"</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}