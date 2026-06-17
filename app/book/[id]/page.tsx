import Link from "next/link";
import { ArrowLeft, Star, User } from "lucide-react";
import { mockBooks, mockReviews } from "../../lib/data";

// Die 'params.id' kommt automatisch aus der URL (z.B. /book/1 -> id ist "1")
export default function BookDetail({ params }: { params: { id: string } }) {
  const book = mockBooks.find(b => b.id === params.id);

  if (!book) {
    return <div className="text-white text-center mt-20 text-xl font-bold">Buch nicht gefunden.</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto flex flex-col gap-10">
      <Link href="/shelf" className="text-zinc-400 hover:text-yellow-400 flex items-center gap-2 w-fit transition-colors">
        <ArrowLeft className="w-5 h-5" /> Zurück zum Shelf
      </Link>

      {/* Buch Header */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className={`w-48 md:w-64 aspect-[2/3] shrink-0 ${book.cover} rounded-2xl shadow-2xl border border-zinc-800`}></div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">{book.title}</h1>
            <p className="text-xl md:text-2xl text-zinc-400">{book.author}</p>
          </div>
          
          <div className="flex gap-3 text-sm font-medium mt-2">
            <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-4 py-1.5 rounded-full">{book.genre}</span>
            <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-4 py-1.5 rounded-full">Release: {book.year}</span>
          </div>
          
          <p className="text-zinc-300 leading-relaxed mt-4 text-lg">
            {book.description}
          </p>
        </div>
      </div>

      <hr className="border-zinc-800/50 my-2" />

      {/* Reviews Section */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          Community Reviews
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockReviews.map((review, i) => (
            <div key={i} className="bg-[#121214] p-6 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3 text-white font-medium">
                  <div className="bg-zinc-800 p-2 rounded-full"><User className="w-4 h-4 text-zinc-400" /></div>
                  {review.user}
                </div>
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-zinc-400 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}