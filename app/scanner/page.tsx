"use client";

import { useState } from "react";
import { useZxing } from "react-zxing";
import { Search, Camera, CameraOff, BookOpen, X, Loader2, Hash } from "lucide-react";

// ── Typen ──────────────────────────────────────────
interface BookResult {
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  pages: number | null;
  year: string;
  cover: string | null;
  description: string;
}

// ── Google Books API ────────────────────────────────
async function fetchBookByISBN(isbn: string): Promise<BookResult | null> {
  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const data = await res.json();

    if (!data.items || data.items.length === 0) return null;

    const info = data.items[0].volumeInfo;
    return {
      isbn,
      title: info.title ?? "Unknown Title",
      authors: info.authors?.join(", ") ?? "Unknown Author",
      publisher: info.publisher ?? "Unknown Publisher",
      pages: info.pageCount ?? null,
      year: info.publishedDate?.substring(0, 4) ?? "Unknown",
      cover: info.imageLinks?.thumbnail?.replace("http://", "https://") ?? null,
      description: info.description ?? "No description available.",
    };
  } catch (err) {
    console.error("Google Books API error:", err);
    return null;
  }
}

// ── Haupt-Komponente ────────────────────────────────
export default function Scanner() {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [scanning, setScanning] = useState(false);
  const [manualISBN, setManualISBN] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scannedISBN, setScannedISBN] = useState<string | null>(null);

  // ── react-zxing Hook ──
  const { ref } = useZxing({
    paused: !scanning,
    onDecodeResult: async (res) => {
      const isbn = res.rawValue;
      setScannedISBN(isbn);
      setScanning(false);
      await lookupISBN(isbn);
    },
    onError: (err) => {
      // Leere Frames ignorieren (kein echter Fehler)
      if (err?.message?.includes("No MultiFormat")) return;
      setError("Kamera-Fehler: " + err?.message);
    },
  });

  // ── ISBN-Lookup ──
  const lookupISBN = async (isbn: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    const cleaned = isbn.replace(/[^0-9X]/gi, "");
    if (cleaned.length !== 10 && cleaned.length !== 13) {
      setError("Ungültige ISBN – muss 10 oder 13 Zeichen lang sein.");
      setLoading(false);
      return;
    }

    const book = await fetchBookByISBN(cleaned);
    if (!book) {
      setError(`Kein Buch für ISBN ${cleaned} gefunden.`);
    } else {
      setResult(book);
    }
    setLoading(false);
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualISBN.trim()) return;
    await lookupISBN(manualISBN.trim());
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setScannedISBN(null);
    setManualISBN("");
    setScanning(false);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BookOpen className="text-yellow-400 w-8 h-8" />
          Book Scanner
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Scan a barcode or enter an ISBN manually to find a book.
        </p>
      </div>

      {/* ── Modus-Toggle ── */}
      <div className="flex gap-2 bg-[#121214] border border-zinc-800 rounded-xl p-1 w-fit">
        <button
          onClick={() => { setMode("camera"); reset(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "camera"
              ? "bg-yellow-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Camera className="w-4 h-4" /> Camera Scan
        </button>
        <button
          onClick={() => { setMode("manual"); reset(); setScanning(false); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "manual"
              ? "bg-yellow-400 text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Hash className="w-4 h-4" /> Manual ISBN
        </button>
      </div>

      {/* ── Kamera-Modus ── */}
      {mode === "camera" && (
        <div className="flex flex-col gap-4">
          <div className="relative bg-[#121214] border border-zinc-800 rounded-2xl overflow-hidden aspect-video">
            {/* Video-Feed */}
            <video
              ref={ref}
              className={`w-full h-full object-cover ${!scanning ? "opacity-0" : "opacity-100"} transition-opacity`}
              muted
              playsInline
            />

            {/* Overlay wenn nicht aktiv */}
            {!scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="bg-zinc-800 p-4 rounded-2xl">
                  <CameraOff className="w-10 h-10 text-zinc-500" />
                </div>
                <p className="text-zinc-500 text-sm">Camera is off</p>
              </div>
            )}

            {/* Scan-Zielrahmen */}
            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-32 border-2 border-yellow-400 rounded-lg relative">
                  {/* Ecken-Akzente */}
                  <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-yellow-400 rounded-tl" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-yellow-400 rounded-tr" />
                  <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-yellow-400 rounded-bl" />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-yellow-400 rounded-br" />
                  {/* Scan-Linie */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-yellow-400/70 animate-pulse" />
                </div>
                <p className="absolute bottom-6 text-yellow-400 text-xs font-medium tracking-widest">
                  POINT AT BARCODE
                </p>
              </div>
            )}

            {/* Gescannte ISBN Badge */}
            {scannedISBN && !scanning && (
              <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                ISBN: {scannedISBN}
              </div>
            )}
          </div>

          {/* Kamera-Button */}
          <button
            onClick={() => {
              if (scanning) {
                setScanning(false);
              } else {
                reset();
                setScanning(true);
              }
            }}
            className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              scanning
                ? "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                : "bg-yellow-400 text-black hover:bg-yellow-500"
            }`}
          >
            {scanning ? (
              <><CameraOff className="w-4 h-4" /> Stop Scanning</>
            ) : (
              <><Camera className="w-4 h-4" /> Start Scanning</>
            )}
          </button>
        </div>
      )}

      {/* ── Manueller Modus ── */}
      {mode === "manual" && (
        <form onSubmit={handleManualSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Hash className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Enter ISBN (e.g. 9780747532699)"
              value={manualISBN}
              onChange={(e) => setManualISBN(e.target.value)}
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !manualISBN.trim()}
            className="bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </form>
      )}

      {/* ── Ladezustand ── */}
      {loading && (
        <div className="flex items-center gap-3 text-zinc-400 py-4">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
          <span>Looking up book...</span>
        </div>
      )}

      {/* ── Fehlermeldung ── */}
      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 font-medium text-sm">Book not found</p>
            <p className="text-red-300/70 text-xs mt-1">{error}</p>
          </div>
          <button onClick={reset} className="ml-auto text-red-400 hover:text-red-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Buch-Ergebnis ── */}
      {result && !loading && (
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex gap-5 items-start">
            {/* Cover */}
            <div className="shrink-0">
              {result.cover ? (
                <img
                  src={result.cover}
                  alt={result.title}
                  className="w-24 h-36 object-cover rounded-xl shadow-lg border border-zinc-800"
                />
              ) : (
                <div className="w-24 h-36 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                  <BookOpen className="w-8 h-8 text-zinc-600" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white leading-tight">{result.title}</h2>
              <p className="text-yellow-400 font-medium text-sm">{result.authors}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 mt-1">
                <span>📅 {result.year}</span>
                {result.pages && <span>📄 {result.pages} pages</span>}
                <span>🏢 {result.publisher}</span>
                <span>🔢 ISBN: {result.isbn}</span>
              </div>
            </div>
          </div>

          {/* Beschreibung */}
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
            {result.description}
          </p>

          {/* Aktions-Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 bg-yellow-400 text-black font-bold py-2.5 rounded-xl hover:bg-yellow-500 transition-colors text-sm">
              + Add to Shelf
            </button>
            <button
              onClick={reset}
              className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm"
            >
              Scan Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}