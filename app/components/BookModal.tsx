"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Star, Plus, Trash2, Loader2, Pencil, Check, Barcode, Users, Minus } from "lucide-react";

interface Book {
  id: string;
  isbn: string;
  title: string;
  author: string;
  year: number | string;
  genre: string;
  cover: string;
  coverUrl?: string;
  description: string;
  pagesRead?: number;
  totalPages?: number;
}

interface ReviewUser {
  firstname: string;
  lastname: string | null;
  username: string;
  profilePic: string | null;
}

interface Review {
  id: number;
  rating: number;
  text: string | null;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

interface BookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  isOwnShelf?: boolean;
  onBookRemoved?: (bookId: string) => void;
  onPageUpdate?: (bookId: string, newPages: number, newTotal?: number) => void;
}

/* ── Star Rating ───────────────────────────────────────────────────── */
function StarRating({ value, onChange, readonly = false }: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-transform ${!readonly ? "hover:scale-110 cursor-pointer" : "cursor-default"}`}
        >
          <Star className={`w-5 h-5 transition-colors ${star <= (hovered || value) ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`} />
        </button>
      ))}
    </div>
  );
}

/* ── Review Card ───────────────────────────────────────────────────── */
function ReviewCard({ review, isOwn, onDelete, onEdit }: {
  review: Review;
  isOwn?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}) {
  const seed = review.user.username;
  const name = `${review.user.firstname}${review.user.lastname ? " " + review.user.lastname : ""}`;
  const date = new Date(review.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={`bg-zinc-900/60 border rounded-2xl p-5 flex flex-col gap-3 ${isOwn ? "border-yellow-400/30" : "border-zinc-800/60"}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden shrink-0">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">
              {name}
              {isOwn && <span className="ml-2 text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-1.5 py-0.5 rounded-full">You</span>}
            </p>
            <p className="text-zinc-500 text-xs mt-0.5">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating value={review.rating} readonly />
          {isOwn && (
            <div className="flex gap-1 ml-2">
              <button onClick={onEdit} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button onClick={onDelete} className="text-zinc-500 hover:text-red-400 p-1 rounded-lg hover:bg-red-400/5 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      {review.text && <p className="text-zinc-300 text-sm leading-relaxed">{review.text}</p>}
    </div>
  );
}

/* ── Main Modal ────────────────────────────────────────────────────── */
export default function BookModal({
  book,
  isOpen,
  onClose,
  isOwnShelf = false,
  onBookRemoved,
  onPageUpdate,
}: BookModalProps) {
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [pageInput, setPageInput]         = useState<string>("0");
  const [isSavingPages, setIsSavingPages] = useState(false);
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [totalInput, setTotalInput]       = useState<string>("");

  // Reviews state
  const [ownReview, setOwnReview]         = useState<Review | null>(null);
  const [friendReviews, setFriendReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating]   = useState(0);
  const [reviewText, setReviewText]       = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Sync page inputs when book changes
  useEffect(() => {
    if (book) {
      setPageInput(book.pagesRead?.toString() || "0");
      setTotalInput(book.totalPages?.toString() || "");
    }
  }, [book]);

  // Lock scroll
  useEffect(() => {
    if (isOpen) {
      const w = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${w}px`;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.paddingRight = "0px";
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Load reviews
  const loadReviews = useCallback(async () => {
    if (!book?.isbn) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/reviews?isbn=${book.isbn}`);
      if (res.ok) {
        const data = await res.json();
        setOwnReview(data.ownReview ?? null);
        setFriendReviews(data.friendReviews ?? []);
        if (data.ownReview) {
          setReviewRating(data.ownReview.rating);
          setReviewText(data.ownReview.text ?? "");
        }
      }
    } finally {
      setReviewsLoading(false);
    }
  }, [book?.isbn]);

  useEffect(() => {
    if (isOpen && book) {
      loadReviews();
    } else {
      setOwnReview(null);
      setFriendReviews([]);
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewText("");
    }
  }, [isOpen, book, loadReviews]);

  if (!isOpen || !book) return null;

  // Add to shelf
  const handleAddToShelf = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: book.isbn, title: book.title }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fehler beim Hinzufügen.");
      alert(`"${book.title}" wurde deinem Shelf hinzugefügt!`);
      onClose();
    } catch (e: any) { alert(e.message); } finally { setIsSubmitting(false); }
  };

  // Remove from shelf
  const handleRemoveFromShelf = async () => {
    if (!confirm(`"${book.title}" wirklich löschen?`)) return;
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/books?id=${book.id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Fehler beim Löschen.");
      onBookRemoved?.(book.id);
      onClose();
    } catch (e: any) { alert(e.message); } finally { setIsSubmitting(false); }
  };

  // Save pages
  const savePages = async (newPages: number, newTotal?: number) => {
    const total = newTotal !== undefined ? newTotal : (book.totalPages || 0);
    if (total > 0 && newPages > total) { alert(`Nur ${total} Seiten verfügbar.`); return; }
    const safePages = Math.max(0, newPages);
    try {
      setIsSavingPages(true);
      const res = await fetch("/api/books/pages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, pagesRead: safePages, totalPages: newTotal }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern.");
      onPageUpdate?.(book.id, safePages, newTotal);
      setPageInput(safePages.toString());
      if (newTotal !== undefined) setTotalInput(newTotal.toString());
    } catch { alert("Speichern fehlgeschlagen."); } finally { setIsSavingPages(false); }
  };

  // Submit review
  const handleReviewSubmit = async () => {
    if (reviewRating === 0) { alert("Bitte wähle eine Bewertung."); return; }
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isbn: book.isbn, rating: reviewRating, text: reviewText }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern.");
      await loadReviews();
      setShowReviewForm(false);
    } catch (e: any) { alert(e.message); } finally { setReviewSubmitting(false); }
  };

  // Delete review
  const handleDeleteReview = async () => {
    if (!confirm("Review wirklich löschen?")) return;
    try {
      await fetch(`/api/reviews?isbn=${book.isbn}`, { method: "DELETE" });
      setOwnReview(null);
      setReviewRating(0);
      setReviewText("");
    } catch {}
  };

  const totalReviews = (ownReview ? 1 : 0) + friendReviews.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#121214] border border-zinc-800 rounded-3xl p-6 md:p-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-900 p-2 rounded-full">
          <X className="w-5 h-5" />
        </button>

        {/* Book Info */}
        <div className="flex flex-col md:flex-row gap-8 items-start mt-4">
          <div className="w-40 md:w-48 aspect-[2/3] shrink-0 rounded-2xl shadow-xl border border-zinc-800 overflow-hidden bg-zinc-900">
            {book.coverUrl
              ? <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-zinc-500 text-sm">No Cover</div>
            }
          </div>

          <div className="flex flex-col gap-3 w-full">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-1">{book.title}</h2>
              <p className="text-xl text-zinc-400">{book.author}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 text-sm font-medium">
              {book.genre && <span className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1 rounded-full">{book.genre}</span>}
              {book.year  && <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 px-3 py-1 rounded-full">{book.year}</span>}
              {book.isbn  && (
                <span className="flex items-center gap-1.5 bg-zinc-800/60 text-zinc-400 border border-zinc-700/60 px-3 py-1 rounded-full font-mono text-xs">
                  <Barcode className="w-3.5 h-3.5" /> {book.isbn}
                </span>
              )}
            </div>

            {book.description && <p className="text-zinc-300 leading-relaxed text-sm mt-1">{book.description}</p>}

            {/* Pages Progress (only on own shelf) */}
            {isOwnShelf && (
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-fit flex items-center gap-4">
                <span className="text-zinc-400 text-sm font-medium">Progress:</span>
                <div className="flex items-center gap-2 bg-black border border-zinc-700 rounded-lg p-1">
                  <button
                    disabled={isSavingPages || parseInt(pageInput) <= 0}
                    onClick={() => savePages((parseInt(pageInput) || 0) - 1)}
                    className="p-1 hover:bg-zinc-800 text-zinc-400 rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onBlur={() => savePages(parseInt(pageInput) || 0)}
                    className="w-12 bg-transparent text-center text-white font-bold focus:outline-none"
                  />
                  <button
                    disabled={isSavingPages}
                    onClick={() => savePages((parseInt(pageInput) || 0) + 1)}
                    className="p-1 hover:bg-zinc-800 text-zinc-400 rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500 text-sm">/</span>
                  {isEditingTotal ? (
                    <input
                      type="number"
                      value={totalInput}
                      onChange={(e) => setTotalInput(e.target.value)}
                      onBlur={() => { setIsEditingTotal(false); savePages(parseInt(pageInput) || 0, parseInt(totalInput)); }}
                      className="w-16 bg-zinc-800 text-white text-center rounded"
                      autoFocus
                    />
                  ) : (
                    <span className="text-zinc-400 cursor-pointer hover:text-yellow-400 font-bold" onClick={() => setIsEditingTotal(true)}>
                      {book.totalPages || "?"}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-2">
              {isOwnShelf ? (
                <button onClick={handleRemoveFromShelf} disabled={isSubmitting} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Remove from Shelf
                </button>
              ) : (
                <button onClick={handleAddToShelf} disabled={isSubmitting} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Add to My Shelf
                </button>
              )}
              <button
                onClick={() => { if (ownReview) { setReviewRating(ownReview.rating); setReviewText(ownReview.text ?? ""); } setShowReviewForm((v) => !v); }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <Pencil className="w-4 h-4" />
                {ownReview ? "Edit Review" : "Write Review"}
              </button>
            </div>
          </div>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="mt-6 bg-zinc-900/60 border border-yellow-400/20 rounded-2xl p-5 flex flex-col gap-4">
            <h4 className="text-white font-semibold">{ownReview ? "Edit Review" : "Your Review"}</h4>
            <div className="flex flex-col gap-1.5">
              <p className="text-zinc-400 text-sm">Rating</p>
              <StarRating value={reviewRating} onChange={setReviewRating} />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-zinc-400 text-sm">Comment (optional)</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What do you think about this book?"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400/50 transition-colors resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleReviewSubmit} disabled={reviewSubmitting || reviewRating === 0} className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50">
                {reviewSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Save
              </button>
              <button onClick={() => setShowReviewForm(false)} className="px-5 py-2.5 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        <hr className="border-zinc-800/50 my-8" />

        {/* Reviews Section */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-zinc-400" />
              Reviews
              {totalReviews > 0 && <span className="text-sm font-normal text-zinc-500 ml-1">({totalReviews})</span>}
            </h3>
          </div>

          {reviewsLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(2)].map((_, i) => <div key={i} className="h-24 bg-zinc-900/40 rounded-2xl animate-pulse" />)}
            </div>
          ) : totalReviews === 0 ? (
            <div className="text-center py-10 text-zinc-600 flex flex-col items-center gap-3">
              <Star className="w-8 h-8 text-zinc-800" />
              <p className="text-sm">No reviews from you or your friends yet.</p>
              {!showReviewForm && (
                <button onClick={() => setShowReviewForm(true)} className="text-yellow-400 text-sm hover:underline">
                  Write the first review →
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ownReview && (
                <ReviewCard
                  review={ownReview}
                  isOwn
                  onDelete={handleDeleteReview}
                  onEdit={() => { setReviewRating(ownReview.rating); setReviewText(ownReview.text ?? ""); setShowReviewForm(true); }}
                />
              )}
              {friendReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
