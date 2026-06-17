"use client";

import { useState } from "react";
import { Compass, Search } from "lucide-react";
import { mockBooks } from "../lib/data";
import BookModal from "../components/BookModal";

interface Book {
  title: string;
  author: string;
  isbn: string;
}

export default function Discover() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [query, setQuery] = useState("");      
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");

  // Gefilterte Bücher für die Suche
  const searchResults = mockBooks.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  // Die Suchfunktion für die OpenLibrary API
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/openlibrary_search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Bücher");
      }

      const data = await response.json();
      setBooks(data); 
    } catch (err) {
      setError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 w-full animate-in fade-in duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto mt-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Compass className="text-yellow-400 w-8 h-8"/> Discover
        </h1>
        <div className="relative w-full shadow-lg">
          <form onSubmit={handleSearch} className="w-full relative flex items-center">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 pointer-events-none" />
            
            <input
              type="text"
              placeholder="Search all books by title or author..."
              className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-12 pr-24 text-white focus:outline-none focus:border-yellow-400 transition-colors"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:bg-zinc-700 text-zinc-900 font-medium rounded-lg text-sm transition-colors cursor-pointer"
            >
              {loading ? "Sucht..." : "Suchen"}
            </button>
          </form>
        </div>
      </div>

      {/* Logic: Wenn gesucht wird, zeige Ergebnisse. Wenn nicht, zeige die Kategorien. */}
      {searchTerm !== "" ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-6">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map(book => (
              <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
                <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
                <div>
                  <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
                  <p className="text-zinc-400 text-sm">{book.author}</p>
                </div>
              </div>
            ))}
            {searchResults.length === 0 && <p className="text-zinc-500">No books found for "{searchTerm}".</p>}
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
              {mockBooks.filter(b => b.recommended).map(book => (
                <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
                  <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
                    <p className="text-zinc-400 text-sm">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category: Trending */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-zinc-700 w-2 h-6 rounded-full"></span>
              Trending Now
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockBooks.filter(b => b.trending).map(book => (
                <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
                  <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
                    <p className="text-zinc-400 text-sm">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Category: New Arrivals */}
          <section>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="bg-zinc-700 w-2 h-6 rounded-full"></span>
              New Arrivals
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {mockBooks.filter(b => b.new).map(book => (
                <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
                  <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
                  <div>
                    <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
                    <p className="text-zinc-400 text-sm">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Das Modal wird hier gerendert und reagiert auf den State */}
      <BookModal 
        book={selectedBook} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}