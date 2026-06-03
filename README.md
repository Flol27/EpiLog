# 📚 BookStack

> Eine soziale Buchtracking-Plattform – Bücher scannen, Lesefortschritt verfolgen und mit anderen Lesern teilen.

---

## 👥 Team

| Name | Rolle | Zeitaufwand |
|------|-------|-------------|
| [Name 1] | Backend / API | ca. XX Stunden |
| [Name 2] | Frontend / UI | ca. XX Stunden |
| [Name 3] | Datenbank / ORM | ca. XX Stunden |
| [Name 4] | Auth / Dokumentation | ca. XX Stunden |

**Gesamtzeitraum:** 20.05.2026 – 30.06.2026  
**Kurs:** Web Engineering – DHBW Stuttgart

---

## 🚀 Tech Stack

| Bereich | Technologie |
|--------|-------------|
| Backend | Node.js + Express |
| ORM | Sequelize |
| Datenbank | SQLite (Entwicklung) |
| Frontend | Bootstrap 5 + Vanilla JS |
| Authentifizierung | JWT + bcrypt |
| Externe API | Google Books API (ISBN-Lookup) |
| Versionsverwaltung | Git + GitHub |

---

## ✨ Features

- 🔍 **ISBN-Scan** – Bücher per Barcode-Scanner oder Suche über Google Books API erfassen
- 📖 **Leseregal** – Bücher mit Status verwalten: *Möchte lesen / Lese gerade / Abgeschlossen*
- 📊 **Lesestatistiken** – Fortschritt in Seiten, Bücher pro Monat, Gesamtstatistik
- ⭐ **Bewertungen & Kommentare** – Bücher bewerten und Rezensionen schreiben
- 👥 **Soziale Features** – Nutzerprofile, Follower-System, gemeinsame Bücher entdecken
- 🔐 **Authentifizierung** – Registrierung, Login, JWT-gesicherte API

---

## 🛠️ Lokales Setup

### Voraussetzungen

- [Node.js](https://nodejs.org/) v18 oder höher
- npm (wird mit Node.js mitgeliefert)
- Git

### Installation

```bash
# 1. Repository klonen
git clone https://github.com/[euer-username]/bookstack.git
cd bookstack

# 2. Abhängigkeiten installieren
npm install

# 3. Umgebungsvariablen konfigurieren
cp .env.example .env
# .env Datei öffnen und Werte anpassen (siehe unten)

# 4. Datenbank initialisieren
npm run db:migrate

# 5. (Optional) Testdaten einspielen
npm run db:seed

# 6. Server starten
npm start
```

Der Server läuft dann unter: **http://localhost:3000**

### Umgebungsvariablen (`.env`)

```env
PORT=3000
JWT_SECRET=dein-geheimer-schluessel
DB_DIALECT=sqlite
DB_STORAGE=./database.sqlite
```

---

## 🔑 Test-Zugangsdaten

Nach dem Seeding sind folgende Accounts verfügbar:

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Admin | admin@bookstack.de | Admin1234! |
| Nutzer | test@bookstack.de | Test1234! |

---

## 📡 API Dokumentation

Die REST API ist unter `/api/v1/` erreichbar. Alle geschützten Endpunkte erfordern einen JWT-Token im Header:

```
Authorization: Bearer <token>
```

### Endpunkte (Auswahl)

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|--------------|------|
| POST | `/api/v1/auth/register` | Neuen Nutzer registrieren | ❌ |
| POST | `/api/v1/auth/login` | Login, gibt JWT zurück | ❌ |
| GET | `/api/v1/books/search?isbn=` | Buch per ISBN suchen | ✅ |
| GET | `/api/v1/shelf` | Eigenes Regal abrufen | ✅ |
| POST | `/api/v1/shelf` | Buch zum Regal hinzufügen | ✅ |
| PUT | `/api/v1/shelf/:id` | Lesefortschritt aktualisieren | ✅ |
| DELETE | `/api/v1/shelf/:id` | Buch aus Regal entfernen | ✅ |
| GET | `/api/v1/reviews/:bookId` | Bewertungen zu einem Buch | ✅ |
| POST | `/api/v1/reviews` | Neue Bewertung schreiben | ✅ |

Eine vollständige **Postman Collection** liegt unter `/docs/BookStack.postman_collection.json`.

---

## 🗂️ Projektstruktur

```
bookstack/
├── src/
│   ├── config/         # Datenbank- und App-Konfiguration
│   ├── controllers/    # Request-Handler (Auth, Books, Shelf, Reviews)
│   ├── middleware/     # JWT-Authentifizierung, Error-Handler
│   ├── models/         # Sequelize-Modelle (User, Book, ShelfEntry, Review)
│   ├── routes/         # Express-Router
│   └── app.js          # Express App Entry Point
├── public/
│   ├── css/            # Bootstrap + eigene Styles
│   ├── js/             # Frontend JavaScript
│   └── views/          # HTML-Templates
├── docs/
│   └── BookStack.postman_collection.json
├── .env.example
├── package.json
└── README.md
```

---

## 🧪 Tests

```bash
# API-Tests mit Postman
# Collection importieren: docs/BookStack.postman_collection.json
# Environment: localhost, Port 3000
```

---

## 📄 Lizenz

Dieses Projekt wurde im Rahmen einer Studienarbeit an der DHBW Stuttgart erstellt.
