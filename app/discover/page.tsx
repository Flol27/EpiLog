"use client";

import { useState, useEffect } from "react";
import { Compass, Search, Loader2 } from "lucide-react";
import { mockBooks } from "../lib/data";
import BookModal from "../components/BookModal";

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Debounce-Logik: Wartet 500ms nach der letzten Eingabe
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Fetch-Logik: Ruft deine eigene API auf
  useEffect(() => {
    if (!debouncedTerm) {
      setApiResults([]);
      return;
    }

    const searchAPI = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(debouncedTerm)}`);
        if (response.ok) {
          const data = await response.json();
          
          // Formatiere die API-Daten für das Frontend
          const formattedBooks = data.map((b: any, index: number) => ({
            id: `api-${index}`,
            title: b.title,
            author: b.author,
            year: 'Unknown',
            genre: 'Search Result',
            // Wenn es eine ISBN gibt, holen wir das Bild. Sonst Platzhalter-Style.
            coverUrl: b.isbn !== 'Keine ISBN vorhanden' 
              ? `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg` 
              : null,
            cover: 'bg-zinc-800', 
            description: 'Description not available in preview.',
          }));
          
          setApiResults(formattedBooks);
        }
      } catch (error) {
        console.error("Error searching books:", error);
      } finally {
        setIsSearching(false);
      }
    };

    searchAPI();
  }, [debouncedTerm]);

  const openModal = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // Helper zum Rendern der Buchkarten (Unterstützt echte Bilder & Fallbacks)
  const renderBookCard = (book: any) => (
    <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
      {book.coverUrl ? (
        <img src={book.coverUrl} alt={book.title} className="w-full aspect-[2/3] object-cover rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors" />
      ) : (
        <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors flex items-center justify-center p-2 text-center`}>
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
      
      {/* Header & Search */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Compass className="text-yellow-400 w-8 h-8"/> Discover
        </h1>
        <div className="relative w-full shadow-lg">
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
      </div>

      {/* Logic: API Results vs Categories */}
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
          {/* Category: Recommended */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-yellow-400 w-2 h-6 rounded-full"></span>
              Recommended for You
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockBooks.filter(b => b.recommended).map(book => renderBookCard(book))}
            </div>
          </section>

          {/* Category: Trending */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-zinc-700 w-2 h-6 rounded-full"></span>
              Trending Now
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockBooks.filter(b => b.trending).map(book => renderBookCard(book))}
            </div>
          </section>

          {/* Category: New Arrivals */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-zinc-700 w-2 h-6 rounded-full"></span>
              New Arrivals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockBooks.filter(b => b.new).map(book => renderBookCard(book))}
            </div>
          </section>
        </div>
      )}

      <BookModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}