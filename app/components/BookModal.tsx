"use client";

import { useEffect, useState } from "react";
import { X, Star, User, Plus, Trash2, Loader2 } from "lucide-react";
import { mockReviews } from "../lib/data";

interface Book {
  id: string; 
  isbn: string;
  title: string; 
  author: string; 
  year: number | string; 
  genre: string; 
  cover: string; 
  coverUrl?: string; 
  description: string;
}

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  isOwnShelf?: boolean; // NEU: Steuert, ob wir im eigenen Regal (Löschen) oder beim Suchen (Hinzufügen) sind
  onBookRemoved?: (bookId: string) => void; // NEU: Aktualisiert das UI im Shelf sofort ohne Page-Reload
}

export default function BookModal({ 
  book, 
  isOpen, 
  onClose, 
  isOwnShelf = false, 
  onBookRemoved 
}: BookModalProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false); // Lade-Indikator gegen Doppelklicks

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleAddToShelf = async () => {
    if (!book.isbn) {
      alert("Dieses Buch besitzt leider keine gültige ISBN.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: book.isbn, title: book.title }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fehler beim Hinzufügen des Buches.");

      alert(`"${book.title}" wurde deinem Shelf hinzugefügt!`);
      onClose(); 
    } catch (error: any) {
      console.error("DB-Fehler:", error);
      alert(error.message || "Etwas ist schiefgelaufen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveFromShelf = async () => {
    if (!confirm(`Möchtest du "${book.title}" wirklich aus deinem Regal löschen?`)) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Nutzt die relationale ID des Buch-Eintrags aus deiner SQLite-Datenbank
      const res = await fetch(`/api/books?id=${book.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Nicht autorisiert. Bitte logge dich neu ein.");
        throw new Error("Fehler beim Löschen aus der Datenbank.");
      }

      // Wenn die übergeordnete Shelf-Komponente eine Update-Funktion mitgegeben hat, rufen wir sie auf
      if (onBookRemoved) {
        onBookRemoved(book.id);
      }

      onClose(); // Schließt das Modal nach erfolgreichem Löschen
    } catch (error: any) {
      console.error("Lösch-Fehler:", error);
      alert(error.message || "Das Buch konnte nicht gelöscht werden.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
          
          {/* Dynamische Cover-Anzeige */}
          <div className={`w-40 md:w-56 aspect-[2/3] shrink-0 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden ${!book.coverUrl ? book.cover : 'bg-zinc-900'}`}>
            {book.coverUrl ? (
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No Cover</div>
            )}
          </div>
          
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

            {/* DYNAMISCHE BUTTONS: Basierend auf dem aktuellen Standort (isOwnShelf) */}
            {isOwnShelf ? (
              <button 
                onClick={handleRemoveFromShelf}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium px-5 py-3 rounded-xl transition-colors mt-4 w-fit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Deleting...</>
                ) : (
                  <><Trash2 className="w-5 h-5" /> Remove from Shelf</>
                )}
              </button>
            ) : (
              <button 
                onClick={handleAddToShelf}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-3 rounded-xl transition-colors mt-4 w-fit disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-400/10"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                ) : (
                  <><Plus className="w-5 h-5" /> Add to My Shelf</>
                )}
              </button>
            )}
          </div>
        </div>

        <hr className="border-zinc-800/50 my-8" />

        {/* Reviews */}
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