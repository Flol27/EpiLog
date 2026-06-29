"use client";

import { useEffect, useState } from "react";
import { X, Star, User, Plus, Trash2, Loader2, Minus } from "lucide-react";
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
  pagesRead?: number;
  totalPages?: number;
}

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  isOwnShelf?: boolean; 
  onBookRemoved?: (bookId: string) => void; 
  onPageUpdate?: (bookId: string, newPages: number, newTotal?: number) => void; 
}

export default function BookModal({ 
  book, 
  isOpen, 
  onClose, 
  isOwnShelf = false, 
  onBookRemoved,
  onPageUpdate 
}: BookModalProps) {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageInput, setPageInput] = useState<string>(""); 
  const [isSavingPages, setIsSavingPages] = useState(false);
  
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [totalInput, setTotalInput] = useState<string>("");

  useEffect(() => {
    if (book) {
      setPageInput(book.pagesRead?.toString() || "0");
      setTotalInput(book.totalPages?.toString() || "");
    }
  }, [book]);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const handleAddToShelf = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: book.isbn, title: book.title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fehler beim Hinzufügen.");
      alert(`"${book.title}" wurde deinem Shelf hinzugefügt!`);
      onClose(); 
    } catch (e: any) { alert(e.message); } finally { setIsSubmitting(false); }
  };

  const handleRemoveFromShelf = async () => {
    if (!confirm(`Wirklich löschen?`)) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/books?id=${book.id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Fehler beim Löschen.");
      if (onBookRemoved) onBookRemoved(book.id);
      onClose();
    } catch (e: any) { alert(e.message); } finally { setIsSubmitting(false); }
  };

  const savePages = async (newPages: number, newTotal?: number) => {
    const total = newTotal !== undefined ? newTotal : (book.totalPages || 0);
    if (total > 0 && newPages > total) { alert(`Fehler: Nur ${total} Seiten.`); return; }
    
    const safePages = Math.max(0, newPages);

    try {
      setIsSavingPages(true);
      const res = await fetch("/api/books/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, pagesRead: safePages, totalPages: newTotal }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern.");
      
      if (onPageUpdate) onPageUpdate(book.id, safePages, newTotal);
      setPageInput(safePages.toString());
      if (newTotal !== undefined) setTotalInput(newTotal.toString());
    } catch (e) { alert("Speichern fehlgeschlagen."); } finally { setIsSavingPages(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full"><X className="w-5 h-5" /></button>

        <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
          <div className="w-40 md:w-56 aspect-[2/3] shrink-0 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden bg-zinc-900">
             {book.coverUrl ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-500">No Cover</div>}
          </div>
          
          <div className="flex flex-col gap-4 w-full">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{book.title}</h2>
              <p className="text-xl text-zinc-400">{book.author}</p>
            </div>
            
            <div className="flex gap-3 text-sm font-medium">
              <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full">{book.genre}</span>
              <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full">{book.year}</span>
            </div>
            
            <p className="text-zinc-300 leading-relaxed">{book.description}</p>

            {isOwnShelf && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-fit flex items-center gap-4">
                <span className="text-zinc-400 text-sm font-medium">Progress:</span>
                <div className="flex items-center gap-2 bg-black border border-zinc-700 rounded-lg p-1">
                  <button disabled={isSavingPages || parseInt(pageInput) <= 0} onClick={() => savePages((parseInt(pageInput) || 0) - 1)} className="p-1 hover:bg-zinc-800 text-zinc-400 rounded"><Minus className="w-4 h-4" /></button>
                  <input type="number" value={pageInput} onChange={(e) => setPageInput(e.target.value)} onBlur={() => savePages(parseInt(pageInput) || 0)} className="w-12 bg-transparent text-center text-white font-bold focus:outline-none" />
                  <button disabled={isSavingPages} onClick={() => savePages((parseInt(pageInput) || 0) + 1)} className="p-1 hover:bg-zinc-800 text-zinc-400 rounded"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500 text-sm">/</span>
                  {isEditingTotal ? (
                    <input type="number" value={totalInput} onChange={(e) => setTotalInput(e.target.value)} onBlur={() => { setIsEditingTotal(false); savePages(parseInt(pageInput) || 0, parseInt(totalInput)); }} className="w-16 bg-zinc-800 text-white text-center rounded" autoFocus />
                  ) : (
                    <span className="text-zinc-400 cursor-pointer hover:text-yellow-400 font-bold" onClick={() => setIsEditingTotal(true)}>{book.totalPages || "?"}</span>
                  )}
                </div>
              </div>
            )}

            {isOwnShelf ? (
              <button onClick={handleRemoveFromShelf} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-3 rounded-xl w-fit"><Trash2 className="w-5 h-5" /> Remove from Shelf</button>
            ) : (
              <button onClick={handleAddToShelf} className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-xl w-fit"><Plus className="w-5 h-5" /> Add to My Shelf</button>
            )}
          </div>
        </div>

        <hr className="border-zinc-800/50 my-8" />
        <h3 className="text-xl font-bold text-white mb-4">Community Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReviews.map((review, i) => (
            <div key={i} className="bg-zinc-900/50 p-5 rounded-2xl border border-zinc-800/50">
              <div className="flex justify-between mb-3"><div className="flex items-center gap-2 text-sm text-white"><div className="bg-zinc-800 p-1.5 rounded-full"><User className="w-3 h-3" /></div>{review.user}</div><div className="flex gap-1">{[...Array(review.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div></div>
              <p className="text-zinc-400 text-sm">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}