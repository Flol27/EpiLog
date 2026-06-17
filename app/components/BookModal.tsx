"use client";

import { useEffect } from "react";
import { X, Star, User, Plus } from "lucide-react";
import { mockReviews } from "../lib/data";

// Typisierung für Typescript
interface Book {
  id: string; title: string; author: string; year: number; genre: string; cover: string; description: string;
}

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookModal({ book, isOpen, onClose }: BookModalProps) {
  // Verhindert das Scrollen im Hintergrund
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup, wenn die Komponente unmounted wird
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  return (
    // Das Overlay (dunkler Hintergrund). onClick schließt das Modal beim Klicken außerhalb.
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose} 
    >
      {/* Der eigentliche Modal-Container. e.stopPropagation() verhindert, dass Klicks hier drin das Modal schließen */}
      <div 
        className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
          <div className={`w-40 md:w-56 aspect-[2/3] shrink-0 ${book.cover} rounded-2xl shadow-xl border border-zinc-800`}></div>
          
          <div className="flex flex-col gap-4 w-full">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">{book.title}</h2>
              <p className="text-xl text-zinc-400">{book.author}</p>
            </div>
            
            <div className="flex gap-3 text-sm font-medium mt-1">
              <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full">{book.genre}</span>
              <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full">{book.year}</span>
            </div>
            
            <p className="text-zinc-300 leading-relaxed mt-2">{book.description}</p>

            <button className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-3 rounded-xl transition-colors mt-4 w-fit border border-zinc-700 hover:border-zinc-500">
              <Plus className="w-5 h-5" />
              Add to My Shelf
            </button>
          </div>
        </div>

        <hr className="border-zinc-800/50 my-8" />

        <div>
          <h3 className="text-xl font-bold text-white mb-4">Community Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockReviews.map((review, i) => (
              <div key={i} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-white font-medium text-sm">
                    <div className="bg-zinc-800 p-1.5 rounded-full"><User className="w-3 h-3 text-zinc-400" /></div>
                    {review.user}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}