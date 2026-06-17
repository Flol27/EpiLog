"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { mockBooks } from "../lib/data";

// Typdefinition für die API-Ergebnisse (außerhalb der Komponente platziert)
interface Book {
  title: string;
  author: string;
  isbn: string;
}

export default function Shelf() {
  // 1. Deine bestehenden States für die lokale Filterung
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");

  // 2. Deine NEUEN States für die Live-API-Suche (jetzt direkt in Shelf!)
  const [query, setQuery] = useState("");      
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");        

  // Filter-Logik für die mockBooks
  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genreFilter === "All" || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  // Die Suchfunktion für die OpenLibrary API
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      
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
    <div className="flex flex-col gap-8 w-full">
      {/* Suchleiste & Filter für lokale Mock-Daten */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            placeholder="Suche nach Buchtitel..."
            className="w-full bg-[#121214] border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-[#121214] border border-zinc-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="All">Alle Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Education">Education</option>
        </select>
      </div>

      {/* Buch-Grid der lokalen Mock-Daten */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map(book => (
          <Link href={`/book/${book.id}`} key={book.id} className="group flex flex-col gap-3 cursor-pointer">
            <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{book.title}</h3>
              <p className="text-zinc-400 text-sm">{book.author}</p>
            </div>
          </Link>
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-zinc-500 col-span-full py-10">Keine Bücher für diese Suche gefunden.</p>
        )}
      </div>

      <hr className="border-zinc-800 my-4" />

      {/* API-SUCHE BEREICH */}
      <div className="max-w-xl mx-auto p-4 space-y-6 w-full">
        <h2 className="text-xl font-bold text-white mb-2">Weltweite OpenLibrary Suche</h2>
        
        {/* 1. Suchformular */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buchname oder ISBN eingeben..."
            className="flex-1 px-4 py-2 bg-[#121214] border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-medium rounded-xl transition-colors"
          >
            {loading ? "Sucht..." : "Suchen"}
          </button>
        </form>

        {/* 2. Fehlermeldung */}
        {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

        {/* 3. Ergebnisliste der API */}
        <div className="space-y-3">
          {books.length === 0 && !loading && (
            <p className="text-zinc-500 text-sm italic">Noch keine externen Ergebnisse. Starte eine Online-Suche!</p>
          )}
          
          {books.map((book, index) => (
            <div key={index} className="p-4 bg-[#121214] border border-zinc-800 rounded-xl">
              <h3 className="font-bold text-lg text-emerald-400">{book.title}</h3>
              <p className="text-zinc-300 text-sm">Autor: {book.author}</p>
              <p className="text-zinc-500 text-xs font-mono mt-1">ISBN: {book.isbn}</p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}