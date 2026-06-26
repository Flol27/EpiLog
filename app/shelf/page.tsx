"use client";

import { useState, useMemo } from "react";
import { Search, Library } from "lucide-react";
import { mockBooks } from "../lib/data";
import BookModal from "../components/BookModal";

// Genre-Icons (einfach als Emoji, leicht austauschbar)
const GENRE_ICONS: Record<string, string> = {
  "Fiction":   "📖",
  "Sci-Fi":    "🚀",
  "Education": "🎓",
  "Self-Help": "💡",
};

export default function Shelf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bücher pro Genre zählen
  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockBooks.forEach((book) => {
      counts[book.genre] = (counts[book.genre] ?? 0) + 1;
    });
    return counts;
  }, []);

  const genres = Object.keys(genreCounts);

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  const openModal = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in duration-500">

      {/* ── Header ── */}
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Library className="text-yellow-400 w-8 h-8" /> My Shelf
        </h1>
      </div>

      {/* ── Genre-Karten ── */}
      <div className="flex flex-wrap gap-3">
        {/* "All"-Karte */}
        <button
          onClick={() => setGenreFilter("All")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
            ${genreFilter === "All"
              ? "bg-yellow-400 text-black border-yellow-400"
              : "bg-[#121214] text-zinc-300 border-zinc-800 hover:border-zinc-600"
            }`}
        >
          <span>📚</span>
          <span>All</span>
          <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold
            ${genreFilter === "All" ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"}`}>
            {mockBooks.length}
          </span>
        </button>

        {/* Genre-Karten */}
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setGenreFilter(genre)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all
              ${genreFilter === genre
                ? "bg-yellow-400 text-black border-yellow-400"
                : "bg-[#121214] text-zinc-300 border-zinc-800 hover:border-zinc-600"
              }`}
          >
            <span>{GENRE_ICONS[genre] ?? "📄"}</span>
            <span>{genre}</span>
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-bold
              ${genreFilter === genre ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"}`}>
              {genreCounts[genre]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Suchzeile ── */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Search your library..."
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* ── Bücher-Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            onClick={() => openModal(book)}
            className="group flex flex-col gap-3 cursor-pointer"
          >
            <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`} />
            <div>
              <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">
                {book.title}
              </h3>
              <p className="text-zinc-400 text-sm">{book.author}</p>
              <span className="text-xs text-zinc-600 mt-0.5 inline-block">{book.genre}</span>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-zinc-500 col-span-full py-10 text-center">
            No books found matching your criteria.
          </p>
        )}
      </div>

      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}