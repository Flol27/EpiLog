"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Library, Loader2, AlertCircle, BookOpen } from "lucide-react";
import BookModal from "../components/BookModal";

const GENRE_ICONS: Record<string, string> = {
  "Fiction":   "📖",
  "Sci-Fi":    "🚀",
  "Education": "🎓",
  "Self-Help": "💡",
};

export default function Shelf() {
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadShelfData() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch("/api/books", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (!res.ok) {
          if (res.status === 401) throw new Error("Not authorized. Please log in again.");
          throw new Error("Failed to load shelf data.");
        }

        const dbItems = await res.json();
        const itemsArray = Array.isArray(dbItems) ? dbItems : dbItems.books || [];

        if (itemsArray.length === 0) {
          setBooks([]);
          setIsLoading(false);
          return;
        }

        // Load OpenLibrary details for each ISBN in parallel
        const fullBooksPromises = itemsArray.map(async (dbItem: any) => {
          const isbn = dbItem.isbn;
          if (!isbn) return null;

          try {
            const olRes = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(isbn)}`);
            const olData = await olRes.json();
            const olBook = olData[0] || {};

            return {
              id: dbItem.id,
              isbn,
              title: olBook.title || dbItem.title || "Unknown Title",
              author: olBook.author || "Unknown Author",
              year: olBook.publishDate,
              genre: olBook.genres || "Fiction",
              coverUrl: olBook.coverKey ? `https://covers.openlibrary.org/b/olid/${olBook.coverKey}-L.jpg` : null,
              description: "Details loaded from OpenLibrary.",
              pagesRead: dbItem.pagesRead || 0,
              // Prioritize DB value, fallback to OpenLibrary
              totalPages: dbItem.totalPages || olBook.number_of_pages || 0,
            };
          } catch {
            return {
              id: dbItem.id, isbn,
              title: dbItem.title || `Error loading (${isbn})`,
              author: "API Error", genre: "Unknown",
              pagesRead: dbItem.pagesRead || 0,
              totalPages: dbItem.totalPages || 0,
            };
          }
        });

        const resolvedBooks = await Promise.all(fullBooksPromises);
        setBooks(resolvedBooks.filter(b => b !== null));

      } catch (err: any) {
        setError(err.message || "Failed to load books.");
      } finally {
        setIsLoading(false);
      }
    }

    loadShelfData();
  }, []);

  const handleBookRemovedFromState = (removedId: string) => {
    setBooks((prev) => prev.filter((book) => book.id !== removedId));
    setIsModalOpen(false);
  };

  const handlePageUpdate = (bookId: string, newPages: number, newTotal?: number) => {
    setBooks((prev) =>
      prev.map((book) =>
        String(book.id) === String(bookId)
          ? { ...book, pagesRead: newPages, ...(newTotal !== undefined ? { totalPages: newTotal } : {}) }
          : book
      )
    );
    setSelectedBook((prev: any) =>
      prev && String(prev.id) === String(bookId)
        ? { ...prev, pagesRead: newPages, ...(newTotal !== undefined ? { totalPages: newTotal } : {}) }
        : prev
    );
  };

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    books.forEach((book) => {
      if (book.genre) counts[book.genre] = (counts[book.genre] ?? 0) + 1;
    });
    return counts;
  }, [books]);

  const genres = Object.keys(genreCounts);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Library className="text-yellow-400 w-8 h-8" /> My Shelf
        </h1>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
          <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
          <p className="text-sm">Loading your books...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setGenreFilter("All")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                ${genreFilter === "All" ? "bg-yellow-400 text-black border-yellow-400" : "bg-[#121214] text-zinc-300 border-zinc-800 hover:border-zinc-600"}`}
            >
              <span>📚</span> All
              <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${genreFilter === "All" ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                {books.length}
              </span>
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setGenreFilter(genre)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
                  ${genreFilter === genre ? "bg-yellow-400 text-black border-yellow-400" : "bg-[#121214] text-zinc-300 border-zinc-800 hover:border-zinc-600"}`}
              >
                <span>{GENRE_ICONS[genre] ?? "📄"}</span> {genre}
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold ${genreFilter === genre ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"}`}>
                  {genreCounts[genre]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search your library..."
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => { setSelectedBook(book); setIsModalOpen(true); }}
                className="group flex flex-col gap-3 cursor-pointer"
              >
                {book.coverUrl ? (
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors"
                  />
                ) : (
                  <div className="w-full aspect-[2/3] bg-zinc-800 rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors flex flex-col items-center justify-center gap-2">
                    <BookOpen className="w-6 h-6 text-zinc-600" />
                    <span className="text-zinc-500 text-xs font-medium">No Cover</span>
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
                  <p className="text-zinc-400 text-sm truncate">{book.author}</p>
                  {book.totalPages > 0 ? (
                    <div className="mt-1.5 text-xs font-medium text-zinc-500">
                      <div className="flex justify-between mb-1">
                        <span>{book.pagesRead} / {book.totalPages} p</span>
                        <span className="text-yellow-400">{Math.round((book.pagesRead / book.totalPages) * 100)}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (book.pagesRead / book.totalPages) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-600 mt-0.5 inline-block">{book.genre}</span>
                  )}
                </div>
              </div>
            ))}
            {filteredBooks.length === 0 && (
              <p className="text-zinc-500 col-span-full py-10 text-center">No books found matching your criteria.</p>
            )}
          </div>
        </>
      )}

      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isOwnShelf={true}
        onBookRemoved={handleBookRemovedFromState}
        onPageUpdate={handlePageUpdate}
      />
    </div>
  );
}