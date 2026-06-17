export const mockBooks = [
  { id: "1", title: "The Kite Runner", author: "Khaled Hosseini", year: 2003, genre: "Fiction", cover: "bg-blue-900", description: "An unforgettable story of friendship and betrayal in 1970s Afghanistan. A timeless classic that combines emotional depth with historical context.", trending: true, new: false, recommended: true },
  { id: "2", title: "Dune", author: "Frank Herbert", year: 1965, genre: "Sci-Fi", cover: "bg-orange-900", description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.", trending: true, new: false, recommended: false },
  { id: "3", title: "Clean Code", author: "Robert C. Martin", year: 2008, genre: "Education", cover: "bg-zinc-700", description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. A must-read for every developer.", trending: false, new: false, recommended: true },
  { id: "4", title: "Atomic Habits", author: "James Clear", year: 2018, genre: "Self-Help", cover: "bg-amber-700", description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you exactly how to form good habits.", trending: true, new: false, recommended: false },
  { id: "5", title: "Project Hail Mary", author: "Andy Weir", year: 2021, genre: "Sci-Fi", cover: "bg-indigo-900", description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian.", trending: false, new: true, recommended: true },
  { id: "6", title: "Yellowface", author: "R.F. Kuang", year: 2023, genre: "Fiction", cover: "bg-yellow-600", description: "White lies. Dark humor. Deadly consequences. Bestselling sensation Juniper Song is not who she says she is, she didn't write the book she claims she wrote, and she is most certainly not Asian American.", trending: false, new: true, recommended: false },
];

export const mockReviews = [
  { user: "MaxM", rating: 5, text: "An absolute masterpiece! I couldn't put it down. The character development is second to none." },
  { user: "Sarah_Read", rating: 4, text: "Very well written, though the beginning dragged a bit. By the end, it gets incredibly tense." }
];

export const mockFriends = [
  { 
    id: "f1", 
    name: "Sarah Connor", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah", 
    about: "Sci-Fi enthusiast and software engineer. Always looking for the next big space opera.", 
    favGenre: "Sci-Fi", 
    favBook: "Dune", 
    stats: { booksRead: 14, pagesRead: 4520, avgRating: 4.5, dayStreak: 12 } 
  },
  { 
    id: "f2", 
    name: "Max Miller", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", 
    about: "I read a bit of everything. Trying to hit 50 books this year!", 
    favGenre: "Fiction", 
    favBook: "The Kite Runner", 
    stats: { booksRead: 22, pagesRead: 7100, avgRating: 3.8, dayStreak: 3 } 
  },
  { 
    id: "f3", 
    name: "Elena Rodriguez", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena", 
    about: "Self-help junkie. If it promises to make me 1% better every day, I'm reading it.", 
    favGenre: "Self-Help", 
    favBook: "Atomic Habits", 
    stats: { booksRead: 8, pagesRead: 2100, avgRating: 4.9, dayStreak: 25 } 
  }
];

export const mockActivities = [
  { id: "a1", friendName: "Sarah Connor", action: "read 45 pages of", bookTitle: "Project Hail Mary", date: "June 16, 2026" },
  { id: "a2", friendName: "Max Miller", action: "finished reading", bookTitle: "The Kite Runner", date: "June 15, 2026" },
  { id: "a3", friendName: "Elena Rodriguez", action: "started reading", bookTitle: "Yellowface", date: "June 14, 2026" },
];