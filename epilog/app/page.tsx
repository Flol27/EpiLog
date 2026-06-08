"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "home" | "bibliothek" | "entdecken" | "freunde" | "statistiken";

interface Book {
  id: number;
  title: string;
  author: string;
  cover: string;
  progress?: number;
  rating?: number;
  status: "lese_gerade" | "abgeschlossen" | "möchte_lesen";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const BOOKS: Book[] = [
  { id: 1, title: "Der Prozess", author: "Franz Kafka", cover: "#2D4A3E", progress: 64, status: "lese_gerade" },
  { id: 2, title: "Homo Faber", author: "Max Frisch", cover: "#4A2D3E", progress: 30, status: "lese_gerade" },
  { id: 3, title: "Die Verwandlung", author: "Franz Kafka", cover: "#3E4A2D", rating: 5, status: "abgeschlossen" },
  { id: 4, title: "Steppenwolf", author: "Hermann Hesse", cover: "#2D3E4A", rating: 4, status: "abgeschlossen" },
  { id: 5, title: "Siddharta", author: "Hermann Hesse", cover: "#4A3E2D", status: "möchte_lesen" },
  { id: 6, title: "1984", author: "George Orwell", cover: "#3D2D4A", status: "möchte_lesen" },
];

const STATS = {
  gelesenDiesesJahr: 12,
  seitenGelesen: 3842,
  streak: 7,
  ziele: 20,
};

// ─── Sub-Components ───────────────────────────────────────────────────────────

function BookCard({ book }: { book: Book }) {
  return (
    <div className="book-card">
      <div className="book-cover" style={{ backgroundColor: book.cover }}>
        <span className="book-cover-initial">{book.title[0]}</span>
      </div>
      <div className="book-info">
        <p className="book-title">{book.title}</p>
        <p className="book-author">{book.author}</p>
        {book.progress !== undefined && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-track">
              <div className="progress-bar-fill" style={{ width: `${book.progress}%` }} />
            </div>
            <span className="progress-label">{book.progress}%</span>
          </div>
        )}
        {book.rating !== undefined && (
          <div className="stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className={i < book.rating! ? "star filled" : "star"}>★</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HomeTab() {
  const reading = BOOKS.filter((b) => b.status === "lese_gerade");
  const done = BOOKS.filter((b) => b.status === "abgeschlossen");

  return (
    <div className="tab-content">
      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">{STATS.gelesenDiesesJahr}</span>
          <span className="stat-label">Bücher 2026</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.seitenGelesen.toLocaleString()}</span>
          <span className="stat-label">Seiten</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.streak}🔥</span>
          <span className="stat-label">Tage Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{STATS.gelesenDiesesJahr}/{STATS.ziele}</span>
          <span className="stat-label">Jahresziel</span>
        </div>
      </div>

      {/* Currently Reading */}
      <section className="section">
        <h2 className="section-title">Lese ich gerade</h2>
        <div className="book-list">
          {reading.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>

      {/* Done */}
      <section className="section">
        <h2 className="section-title">Abgeschlossen</h2>
        <div className="book-list">
          {done.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>
    </div>
  );
}

function BibliothekTab() {
  const [filter, setFilter] = useState<Book["status"] | "alle">("alle");
  const filtered = filter === "alle" ? BOOKS : BOOKS.filter((b) => b.status === filter);

  return (
    <div className="tab-content">
      <div className="filter-row">
        {(["alle", "lese_gerade", "abgeschlossen", "möchte_lesen"] as const).map((f) => (
          <button key={f} className={`filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "alle" ? "Alle" : f === "lese_gerade" ? "Lese ich" : f === "abgeschlossen" ? "Gelesen" : "Merkliste"}
          </button>
        ))}
      </div>
      <div className="book-grid">
        {filtered.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
      <button className="add-btn">+ Buch hinzufügen</button>
    </div>
  );
}

function EntdeckenTab() {
  return (
    <div className="tab-content">
      <div className="search-wrap">
        <input className="search-input" placeholder="Titel, Autor oder ISBN scannen…" />
        <button className="scan-btn">📷 Scan</button>
      </div>
      <section className="section">
        <h2 className="section-title">Trending diese Woche</h2>
        <div className="book-grid">
          {BOOKS.slice(0, 4).map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>
    </div>
  );
}

function FreundeTab() {
  const friends = [
    { name: "Anna K.", buecher: 18, avatar: "#5B8A6E" },
    { name: "Jonas M.", buecher: 7, avatar: "#8A5B6E" },
    { name: "Sara L.", buecher: 24, avatar: "#6E8A5B" },
  ];

  return (
    <div className="tab-content">
      <section className="section">
        <h2 className="section-title">Meine Freunde</h2>
        <div className="friend-list">
          {friends.map((f) => (
            <div key={f.name} className="friend-card">
              <div className="friend-avatar" style={{ backgroundColor: f.avatar }}>
                {f.name[0]}
              </div>
              <div>
                <p className="friend-name">{f.name}</p>
                <p className="friend-meta">{f.buecher} Bücher 2026</p>
              </div>
              <button className="friend-action">Profil</button>
            </div>
          ))}
        </div>
        <button className="add-btn">+ Freund suchen</button>
      </section>
    </div>
  );
}

function StatistikTab() {
  const months = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun"];
  const values = [2, 1, 3, 2, 2, 2];
  const max = Math.max(...values);

  return (
    <div className="tab-content">
      <section className="section">
        <h2 className="section-title">Bücher pro Monat</h2>
        <div className="bar-chart">
          {months.map((m, i) => (
            <div key={m} className="bar-col">
              <div className="bar" style={{ height: `${(values[i] / max) * 100}%` }} />
              <span className="bar-label">{m}</span>
            </div>
          ))}
        </div>
      </section>
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-number">Krimi</span>
          <span className="stat-label">Lieblingsgenre</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">320</span>
          <span className="stat-label">Ø Seiten/Buch</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">4.2★</span>
          <span className="stat-label">Ø Bewertung</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Start", icon: "🏠" },
    { id: "bibliothek", label: "Bibliothek", icon: "📚" },
    { id: "entdecken", label: "Entdecken", icon: "🔍" },
    { id: "freunde", label: "Freunde", icon: "👥" },
    { id: "statistiken", label: "Statistiken", icon: "📊" },
  ];

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Georgia', serif;
          background: #F5F0E8;
          color: #1A1A1A;
          min-height: 100vh;
        }

        .app {
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #FDFAF4;
          overflow: hidden;
        }

        /* Header */
        .header {
          padding: 20px 20px 12px;
          background: #1A1A1A;
          color: #F5F0E8;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-logo {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
          color: #C8A96E;
        }
        .header-greeting {
          font-size: 13px;
          color: #888;
          font-style: italic;
        }
        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #C8A96E;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 15px;
          color: #1A1A1A;
        }

        /* Tab Bar */
        .tab-bar {
          display: flex;
          background: #1A1A1A;
          border-bottom: 2px solid #C8A96E;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .tab-bar::-webkit-scrollbar { display: none; }

        .tab-btn {
          flex: 1;
          min-width: 70px;
          padding: 10px 4px;
          border: none;
          background: transparent;
          color: #888;
          font-size: 10px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .tab-btn .tab-icon { font-size: 18px; }
        .tab-btn.active { color: #C8A96E; }
        .tab-btn:hover { color: #F5F0E8; }

        /* Content */
        .tab-content {
          padding: 20px 16px;
          flex: 1;
          overflow-y: auto;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 24px;
        }
        .stat-card {
          background: #1A1A1A;
          color: #F5F0E8;
          border-radius: 10px;
          padding: 12px 6px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-number {
          font-size: 16px;
          font-weight: 700;
          color: #C8A96E;
        }
        .stat-label {
          font-size: 9px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Section */
        .section { margin-bottom: 28px; }
        .section-title {
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #1A1A1A;
          margin-bottom: 14px;
          padding-bottom: 6px;
          border-bottom: 1px solid #E0D8C8;
        }

        /* Book List (horizontal scroll) */
        .book-list {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 8px;
          scrollbar-width: none;
        }
        .book-list::-webkit-scrollbar { display: none; }

        /* Book Grid */
        .book-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        /* Book Card */
        .book-card {
          min-width: 130px;
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          flex-shrink: 0;
        }
        .book-cover {
          height: 90px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .book-cover-initial {
          font-size: 28px;
          font-weight: 700;
          color: rgba(255,255,255,0.7);
        }
        .book-info { padding: 10px; }
        .book-title {
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .book-author {
          font-size: 10px;
          color: #888;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Progress */
        .progress-bar-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .progress-bar-track {
          flex: 1;
          height: 4px;
          background: #E0D8C8;
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: #C8A96E;
          border-radius: 2px;
          transition: width 0.3s;
        }
        .progress-label { font-size: 9px; color: #888; }

        /* Stars */
        .stars { display: flex; gap: 1px; }
        .star { font-size: 11px; color: #E0D8C8; }
        .star.filled { color: #C8A96E; }

        /* Filter */
        .filter-row {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .filter-row::-webkit-scrollbar { display: none; }
        .filter-btn {
          padding: 6px 14px;
          border: 1.5px solid #E0D8C8;
          border-radius: 20px;
          background: transparent;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          color: #666;
          transition: all 0.2s;
        }
        .filter-btn.active {
          background: #1A1A1A;
          border-color: #1A1A1A;
          color: #C8A96E;
        }

        /* Add Button */
        .add-btn {
          width: 100%;
          padding: 12px;
          border: 2px dashed #C8A96E;
          border-radius: 10px;
          background: transparent;
          color: #C8A96E;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-btn:hover { background: #FFF8EE; }

        /* Search */
        .search-wrap {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }
        .search-input {
          flex: 1;
          padding: 12px 14px;
          border: 1.5px solid #E0D8C8;
          border-radius: 10px;
          background: white;
          font-size: 13px;
          outline: none;
          font-family: inherit;
        }
        .search-input:focus { border-color: #C8A96E; }
        .scan-btn {
          padding: 12px 14px;
          background: #1A1A1A;
          color: #C8A96E;
          border: none;
          border-radius: 10px;
          font-size: 13px;
          cursor: pointer;
          white-space: nowrap;
        }

        /* Friends */
        .friend-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
        .friend-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: white;
          border-radius: 10px;
          padding: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .friend-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 16px;
          flex-shrink: 0;
        }
        .friend-name { font-size: 14px; font-weight: 700; }
        .friend-meta { font-size: 11px; color: #888; }
        .friend-action {
          margin-left: auto;
          padding: 6px 12px;
          border: 1.5px solid #1A1A1A;
          border-radius: 6px;
          background: transparent;
          font-size: 11px;
          cursor: pointer;
        }

        /* Bar Chart */
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          height: 120px;
          background: white;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .bar-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          height: 100%;
          justify-content: flex-end;
        }
        .bar {
          width: 100%;
          background: #C8A96E;
          border-radius: 4px 4px 0 0;
          min-height: 8px;
          transition: height 0.3s;
        }
        .bar-label { font-size: 10px; color: #888; }

        /* Bottom Nav spacing */
        .main-content { flex: 1; overflow-y: auto; }

        /* ─── Responsive: Tablet (640px+) ─── */
        @media (min-width: 640px) {
          .app {
            max-width: unset;
          }
          .stats-row {
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }
          .stat-card {
            padding: 16px 10px;
          }
          .stat-number { font-size: 20px; }
          .stat-label { font-size: 11px; }
          .book-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
          .book-card { min-width: unset; }
          .book-cover { height: 120px; }
          .book-title { font-size: 13px; }
          .book-author { font-size: 11px; }
          .section-title { font-size: 16px; }
          .tab-btn { font-size: 12px; padding: 12px 8px; }
          .tab-btn .tab-icon { font-size: 20px; }
          .header { padding: 24px 28px 16px; }
          .header-logo { font-size: 26px; }
          .tab-content { padding: 24px 24px; }
          .friend-card { padding: 16px; }
          .friend-name { font-size: 15px; }
          .bar-chart { height: 160px; }
        }

        /* ─── Responsive: Desktop (1024px+) ─── */
        @media (min-width: 1024px) {
          .tab-bar {
            display: flex;
            justify-content: center;
          }
          .tab-btn {
            flex-direction: row;
            gap: 8px;
            font-size: 13px;
            padding: 14px 32px;
            min-width: unset;
            flex: unset;
          }
          .tab-btn .tab-icon { font-size: 16px; }
          .book-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 20px;
          }
          .book-cover { height: 140px; }
          .book-info { padding: 12px; }
          .book-title { font-size: 14px; }
          .stats-row {
            gap: 16px;
            grid-template-columns: repeat(4, 1fr);
            max-width: 600px;
          }
          .stat-card {
            padding: 20px 14px;
            border-radius: 12px;
          }
          .stat-number { font-size: 24px; }
          .tab-content { padding: 40px 60px; }
          .section { margin-bottom: 36px; }
          .friend-list { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .bar-chart { height: 200px; padding: 24px; max-width: 700px; }
          .search-input { font-size: 15px; padding: 14px 18px; max-width: 600px; }
          .search-wrap { max-width: 700px; }
          .scan-btn { font-size: 15px; padding: 14px 20px; }
          .add-btn { font-size: 15px; padding: 16px; max-width: 400px; }
        }
      `}</style>

      <div className="app">
        {/* Header */}
        <header className="header">
          <div>
            <div className="header-logo">BookStack</div>
            <div className="header-greeting">Guten Abend, Peter</div>
          </div>
          <div className="header-avatar">P</div>
        </header>

        {/* Tab Bar */}
        <nav className="tab-bar">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="main-content">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "bibliothek" && <BibliothekTab />}
          {activeTab === "entdecken" && <EntdeckenTab />}
          {activeTab === "freunde" && <FreundeTab />}
          {activeTab === "statistiken" && <StatistikTab />}
        </main>
      </div>
    </>
  );
}
