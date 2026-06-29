"use client";

import { useState, useEffect, useRef } from "react";
import { Compass, Search, Loader2, ScanLine, BookOpen, X } from "lucide-react";
import BookModal from "../components/BookModal";

// ── Typen ──────────────────────────────────────────
interface ScannedBook {
  isbn: string;
  title: string;
  authors: string;
  publisher: string;
  pages: number | null;
  year: string;
  cover: string | null;
  description: string;
}

async function fetchBookByISBN(isbn: string): Promise<ScannedBook | null> {
  try {
    const res = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(isbn)}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || data.length === 0) return null;

    const book = data[0];
    return {
      isbn: book.isbn ?? isbn,
      title: book.title ?? "Unknown Title",
      authors: book.author ?? "Unknown Author",
      publisher: "Unknown Publisher",
      pages: null,
      year: book.publishDate ?? "Unknown",
      cover: book.coverKey
        ? `https://covers.openlibrary.org/b/olid/${book.coverKey}-L.jpg`
        : null,
      description: "No description available.",
    };
  } catch {
    return null;
  }
}

// ── Scan Modal mit Scanbot SDK ──────────────────────
function ScanModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScannedBook | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const ScanbotSdkRef = useRef<any>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        const sdk = (await import("scanbot-web-sdk/ui")).default;
        await sdk.initialize({
          licenseKey: "",
          enginePath: "/wasm/",
        });
        ScanbotSdkRef.current = sdk;
        setSdkReady(true);

        const config = new sdk.UI.Config.BarcodeScannerScreenConfiguration();
        config.palette.sbColorPrimary = "#FACC15";
        config.palette.sbColorSecondary = "#FACC15";
        config.userGuidance.title.text = "Point camera at ISBN barcode";
        config.topBar.mode = "SOLID";
        config.actionBar.zoomButton.visible = false;

        const scanResult = await sdk.UI.createBarcodeScanner(config);
        if (scanResult && scanResult.items.length > 0) {
          const isbn = scanResult.items[0].barcode.text;
          await lookupISBN(isbn);
        }
      } catch (e) {
        setError("Scanner konnte nicht initialisiert werden.");
        console.error(e);
      }
    };
    initSDK();
  }, []);

  const startScanner = async () => {
    if (!ScanbotSdkRef.current) {
      setError("SDK nicht bereit.");
      return;
    }

    try {
      const sdk = ScanbotSdkRef.current;
      const config = new sdk.UI.Config.BarcodeScannerScreenConfiguration();
      config.palette.sbColorPrimary = "#FACC15";
      config.palette.sbColorSecondary = "#FACC15";
      config.userGuidance.title.text = "Point camera at ISBN barcode";
      config.topBar.mode = "SOLID";
      config.actionBar.zoomButton.visible = false;

      const scanResult = await sdk.UI.createBarcodeScanner(config);
      if (scanResult && scanResult.items.length > 0) {
        const isbn = scanResult.items[0].barcode.text;
        await lookupISBN(isbn);
      }
    } catch (e) {
      setError("Scan fehlgeschlagen. Bitte erneut versuchen.");
      console.error(e);
    }
  };

  const lookupISBN = async (isbn: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const cleaned = isbn.replace(/[^0-9X]/gi, "");
    if (cleaned.length !== 10 && cleaned.length !== 13) {
      setError("Invalid ISBN – must be 10 or 13 digits.");
      setLoading(false);
      return;
    }
    const book = await fetchBookByISBN(cleaned);
    if (!book) {
      setError(`No book found for ISBN ${cleaned}.`);
    } else {
      setResult(book);
    }
    setLoading(false);
  };

  const reset = () => {
    setResult(null);
    setError(null);
    startScanner();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-yellow-400" /> Scan ISBN
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors bg-zinc-900 p-2 rounded-full">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!result && (
          <button
            onClick={startScanner}
            disabled={!sdkReady || loading}
            className="w-full flex items-center justify-center gap-3 bg-yellow-400 text-black font-bold py-4 rounded-2xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {!sdkReady ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Initializing Scanner...</>
            ) : (
              <><ScanLine className="w-5 h-5" /> Open Camera Scanner</>
            )}
          </button>
        )}

        {loading && (
          <div className="flex items-center gap-3 text-zinc-400 py-4 justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-yellow-400" />
            <span>Looking up book...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-center gap-2 mb-4">
            <X className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="flex gap-4 items-start">
              {result.cover ? (
                <img src={result.cover} alt={result.title} className="w-20 h-28 object-cover rounded-xl border border-zinc-800 shrink-0" />
              ) : (
                <div className="w-20 h-28 bg-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-zinc-600" />
                </div>
              )}
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="text-white font-bold leading-tight">{result.title}</h3>
                <p className="text-yellow-400 text-sm">{result.authors}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-500 mt-1">
                  <span>📅 {result.year}</span>
                  {result.pages && <span>📄 {result.pages}p</span>}
                  <span>🏢 {result.publisher}</span>
                </div>
              </div>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">{result.description}</p>
            <div className="flex gap-3">
              <button className="flex-1 bg-yellow-400 text-black font-bold py-2.5 rounded-xl hover:bg-yellow-500 transition-colors text-sm">
                + Add to Shelf
              </button>
              <button onClick={reset} className="px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-sm">
                Scan Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Discover Haupt-Seite ────────────────────────────
export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  const [favoriteAuthor, setFavoriteAuthor] = useState<string | null>(null);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanOpen, setIsScanOpen] = useState(false);

  // ── RECO-ENGINE: FILTERT BEREITS GESPEICHERTE BÜCHER AUS ──
  useEffect(() => {
    async function calculateRecommendations() {
      try {
        setIsLoadingRecommendations(true);

        // 1. Hole alle Bücher aus dem eigenen Shelf des Nutzers
        const res = await fetch("/api/books", { credentials: "include" });
        if (!res.ok) throw new Error("Konnte User-Shelf nicht laden.");
        
        const dbItems = await res.json();
        const itemsArray = Array.isArray(dbItems) ? dbItems : dbItems.books || [];

        if (itemsArray.length === 0) {
          setIsLoadingRecommendations(false);
          return;
        }

        // NEU: Erstelle ein Set aller bereits gespeicherten ISBNs für einen O(1) Abgleich
        const ownedIsbns = new Set<string>(
          itemsArray.map((item: any) => item.isbn).filter(Boolean)
        );

        // 2. Parallel die Live-Autorendaten von OpenLibrary für die ISBNs auflösen
        const authorPromises = itemsArray.map(async (item: any) => {
          if (!item.isbn) return null;
          try {
            const olRes = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(item.isbn)}`);
            if (!olRes.ok) return null;
            const data = await olRes.json();
            return data && data.length > 0 ? data[0].author : null;
          } catch {
            return null;
          }
        });

        const resolvedAuthors = await Promise.all(authorPromises);

        // 3. Frequenz-Analyse (Häufigkeitsverteilung des Lieblingsautors)
        const frequencyMap: Record<string, number> = {};
        let maxCount = 0;
        let topAuthor: string | null = null;

        resolvedAuthors.forEach((author) => {
          if (!author || author === "Unknown Author") return;
          frequencyMap[author] = (frequencyMap[author] ?? 0) + 1;
          if (frequencyMap[author] > maxCount) {
            maxCount = frequencyMap[author];
            topAuthor = author;
          }
        });

        if (!topAuthor) {
          setIsLoadingRecommendations(false);
          return;
        }

        setFavoriteAuthor(topAuthor);

        // 4. Top-Bücher dieses Autors abrufen
        const olAuthorRes = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(topAuthor)}`);
        if (olAuthorRes.ok) {
          const authorWorks = await olAuthorRes.json();
          
          // NEU: Filtere alle Bücher heraus, deren ISBN bereits im ownedIsbns-Set existiert!
          const filteredWorks = authorWorks.filter((b: any) => {
            if (!b.isbn) return true; // Ohne ISBN behalten wir es testweise bei
            return !ownedIsbns.has(b.isbn); // NUR behalten, wenn NICHT im Shelf vorhanden
          });

          // Mappe maximal 5 noch nicht im Regal liegende Bücher
          const structuresRecs = filteredWorks
            .slice(0, 5)
            .map((b: any, i: number) => ({
              id: `rec-${i}`,
              title: b.title || "Unknown Title",
              isbn: b.isbn,
              author: b.author || topAuthor,
              year: b.publishDate || "Unknown",
              genre: b.genres || "Fiction",
              coverUrl: b.coverKey ? `https://covers.openlibrary.org/b/olid/${b.coverKey}-L.jpg` : null,
              cover: "bg-zinc-800",
              description: `Empfohlen, weil du gerne Bücher von ${topAuthor} liest und dieses Werk noch fehlt.`,
            }));

          setRecommendedBooks(structuresRecs);
        }
      } catch (err) {
        console.error("Fehler im Empfehlungs-Algorithmus:", err);
      } finally {
        setIsLoadingRecommendations(false);
      }
    }

    calculateRecommendations();
  }, []);

  // Debounce-Timer für die Freitextsuche (500ms)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Freitextsuche ausführen
  useEffect(() => {
    if (!debouncedTerm) { setApiResults([]); return; }
    const searchAPI = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(debouncedTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setApiResults(data.map((b: any, i: number) => ({
            id: `api-${i}`,
            title: b.title,
            isbn: b.isbn,
            author: b.author,
            year: b.publishDate,
            genre: b.genres,
            coverUrl: b.coverKey ? `https://covers.openlibrary.org/b/olid/${b.coverKey}-L.jpg` : null,
            cover: "bg-zinc-800",
            description: "Description not available in preview.",
          })));
        }
      } catch (error) {
        console.error("Error searching books:", error);
      } finally {
        setIsSearching(false);
      }
    };
    searchAPI();
  }, [debouncedTerm]);

  const openModal = (book: any) => { setSelectedBook(book); setIsModalOpen(true); };

  const renderBookCard = (book: any) => (
    <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors" />
      ) : (
        <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors flex items-center justify-center`}>
          <span className="text-zinc-500 text-sm font-medium">No Cover</span>
        </div>
      )}
      <div>
        <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
        <p className="text-zinc-400 text-sm truncate">{book.author}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-500">
      
      {/* Suchbereich */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Compass className="text-yellow-400 w-8 h-8" /> Discover
        </h1>
        <div className="flex gap-3 w-full">
          <div className="relative flex-1 shadow-lg">
            {isSearching ? (
              <Loader2 className="absolute left-4 top-3.5 w-5 h-5 text-yellow-400 animate-spin" />
            ) : (
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            )}
            <input
              type="text"
              placeholder="Search all books by title, author, or ISBN..."
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsScanOpen(true)}
            className="flex items-center gap-2 bg-yellow-400 text-black font-bold px-4 py-3 rounded-xl hover:bg-yellow-500 transition-colors shrink-0"
          >
            <ScanLine className="w-5 h-5" />
            <span className="hidden sm:inline">Scan ISBN</span>
          </button>
        </div>
      </div>

      {/* REAKTIVE RENDER-WEICHE: Suchergebnisse ODER Empfehlungen */}
      {searchTerm !== "" ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {apiResults.map(book => renderBookCard(book))}
            {!isSearching && apiResults.length === 0 && (
              <p className="text-zinc-500 col-span-full">No books found for "{searchTerm}".</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-12">
          <section>
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="bg-yellow-400 w-2 h-6 rounded-full"></span>
              Recommended for You
            </h2>
            
            {favoriteAuthor && (
              <p className="text-zinc-400 text-sm mb-6">
                Basierend auf deinem Lesegeschmack. Beliebtester Autor in deinem Regal: <span className="text-yellow-400 font-medium">{favoriteAuthor}</span>
              </p>
            )}

            {isLoadingRecommendations ? (
              <div className="flex items-center gap-3 text-zinc-500 py-12 justify-center w-full">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                <span>Analysiere deine Lesepräferenzen...</span>
              </div>
            ) : recommendedBooks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {recommendedBooks.map(book => renderBookCard(book))}
              </div>
            ) : (
              <p className="text-zinc-500 py-8 text-sm text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 w-full">
                {favoriteAuthor 
                  ? `Du besitzt bereits alle auf OpenLibrary gelisteten Bücher von ${favoriteAuthor}!`
                  : "Füge zuerst ein paar Bücher zu deinem Shelf hinzu, damit wir deinen Lieblingsautor auswerten können!"}
              </p>
            )}
          </section>
        </div>
      )}

      <BookModal book={selectedBook} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {isScanOpen && <ScanModal onClose={() => setIsScanOpen(false)} />}
    </div>
  );
}