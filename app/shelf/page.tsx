"use client";

import { useState } from "react";
import { Search, Library } from "lucide-react";
import { mockBooks } from "../lib/data";
import BookModal from "../components/BookModal";

export default function Shelf() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  
  // Modal State
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredBooks = mockBooks.filter(book => {
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
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
          <Library className="text-yellow-400 w-8 h-8"/> My Shelf
        </h1>
      </div>

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
        <select
          className="bg-[#121214] border border-zinc-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option value="All">All Genres</option>
          <option value="Fiction">Fiction</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Education">Education</option>
          <option value="Self-Help">Self-Help</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredBooks.map(book => (
          // onClick statt href
          <div key={book.id} onClick={() => openModal(book)} className="group flex flex-col gap-3 cursor-pointer">
            <div className={`w-full aspect-[2/3] ${book.cover} rounded-xl shadow-lg border border-zinc-800 group-hover:border-yellow-400 transition-colors`}></div>
            <div>
              <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors truncate">{book.title}</h3>
              <p className="text-zinc-400 text-sm">{book.author}</p>
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p className="text-zinc-500 col-span-full py-10">No books found matching your criteria.</p>
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