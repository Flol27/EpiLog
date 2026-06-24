"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, Camera, Loader2, BookOpen } from "lucide-react";

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScanModal({ isOpen, onClose }: ScanModalProps) {
  const [isbn, setIsbn] = useState("");
  const [titleAuthor, setTitleAuthor] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState("");

  const scannerRef = useRef<Html5Qrcode | null>(null);

  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setError("Suche fehlgeschlagen. Bitte erneut versuchen.");
      }
    } catch {
      setError("Netzwerkfehler. Bist du online?");
    } finally {
      setIsSearching(false);
    }
  };


  const startCamera = async () => {
    setCameraActive(true);
    setError("");

    // Kurz warten, bis das Kamera-Div im DOM gerendert ist
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" }, // Rückkamera bevorzugen
          { fps: 10, qrbox: { width: 250, height: 150 } },
          (decodedText) => {
            // Erfolg: Barcode erkannt
            stopCamera();
            setIsbn(decodedText);
            handleSearch(decodedText);
          },
          () => {
            // Pro Frame ohne Treffer – bewusst ignoriert
          }
        );
      } catch {
        setError("Kamera konnte nicht gestartet werden. Zugriff erlaubt?");
        setCameraActive(false);
      }
    }, 100);
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Scanner war evtl. schon gestoppt
      }
      scannerRef.current = null;
    }
    setCameraActive(false);
  };


  // Aufräumen: Kamera stoppen, wenn das Modal geschlossen wird
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResults([]);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-yellow-400" /> Buch finden
        </h2>

        {/* ISBN-Suchfeld */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-zinc-300">ISBN-Nummer</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="z.B. 9783161484100"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(isbn)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button onClick={() => handleSearch(isbn)} className="bg-yellow-400 text-black font-semibold px-4 rounded-xl hover:bg-yellow-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Titel/Autor-Suchfeld */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-sm font-medium text-zinc-300">oder Titel / Autor</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="z.B. Dune Frank Herbert"
              value={titleAuthor}
              onChange={(e) => setTitleAuthor(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(titleAuthor)}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
            <button onClick={() => handleSearch(titleAuthor)} className="bg-zinc-800 border border-zinc-700 text-white px-4 rounded-xl hover:bg-zinc-700 transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Kamera-Bereich */}
        <div className="mb-4">
          {!cameraActive ? (
            <button onClick={startCamera} className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-700 text-white py-3 rounded-xl hover:bg-zinc-800 transition-colors">
              <Camera className="w-5 h-5 text-yellow-400" /> Mit Kamera scannen
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div id="reader" className="w-full rounded-xl overflow-hidden border border-zinc-700" />
              <button onClick={stopCamera} className="text-sm text-zinc-400 hover:text-white transition-colors">
                Kamera stoppen
              </button>
            </div>
          )}
        </div>

        {/* Fehler */}
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {/* Lade-Spinner */}
        {isSearching && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
          </div>
        )}

        {/* Ergebnisse */}
        {results.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Ergebnisse</h3>
            {results.slice(0, 5).map((book, i) => (
              <div key={i} className="flex gap-3 items-center bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/50">
                {book.coverKey ? (
                  <img src={`https://covers.openlibrary.org/b/olid/${book.coverKey}-M.jpg`} alt={book.title} className="w-12 h-16 object-cover rounded-md shrink-0 bg-zinc-800" />
                ) : (
                  <div className="w-12 h-16 bg-zinc-800 rounded-md shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{book.title}</p>
                  <p className="text-zinc-400 text-sm truncate">{book.author}</p>
                  <p className="text-zinc-500 text-xs">{book.publishDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}