# 📚 EpiLog

> Eine soziale Buchtracking-Plattform – Bücher scannen, Lesefortschritt verfolgen und mit anderen Lesern teilen.

## ✨ Features

- 🔍 **ISBN-Scan** – Bücher per Barcode-Scanner oder Suche über Open Library API erfassen
- 📖 **Leseregal** – Bücher mit Status verwalten: *Möchte lesen / Lese gerade / Abgeschlossen*
- 📊 **Lesestatistiken** – Fortschritt in Seiten, Bücher pro Monat, Gesamtstatistik
- ⭐ **Bewertungen & Kommentare** – Bücher bewerten und Rezensionen schreiben
- 👥 **Soziale Features** – Nutzerprofile, Follower-System, gemeinsame Bücher entdecken
- 🔐 **Authentifizierung** – Registrierung, Login, JWT-gesicherte API

---

## Teamübersicht & Zeitaufwand
| Mitglied | Aufgabe / Fokus | Aufwand (Stunden) | Anteil (%) |
| :--- | :--- | :---: | :---: |
| **Flo** | Backend, Funktionalität | 15h | 25% |
| **Peter** | Backend, Funktionalität | 15h | 25% |
| **Marcel** | Frontend, UI | 15h | 25% |
| **Rudi** | Datenbank, API | 15h | 25% |
| **Gesamt** | | **60h** | **100%** |

---

## Setup-Dokumentation (Lokale Installation)
Diese Anleitung führt dich Schritt für Schritt durch die Installation, um das Projekt lokal auf deinem Computer auszuführen – auch ohne Vorkenntnisse.

### 1. Voraussetzungen installieren
Lade die folgenden Programme herunter und installiere sie (Standard-Einstellungen beibehalten):
1. **Git:** https://git-scm.com/downloads
2. **Node.js (LTS Version):** https://nodejs.org/

### 2. Projekt herunterladen, einstellen und starten
Öffne dein Terminal (Linux) und gib folgende Befehle ein:

#### 1. Repository klonen
```bash
git clone https://github.com/Flol27/EpiLog
```

#### 2. In den Projektordner wechseln
```bash
cd EpiLog
```

#### 3. Dependencies installieren
```bash
npm install
```

#### 4. Environment Variablen setzen und editieren
```bash
cp example.env .env
nano .env
```
> [!TIP] env file
>```env
>ADMIN_EMAIL="admin@epilog.com"
>ADMIN_PASSWORD="admin"
>DATABASE_URL="file:./epilog.sqlite"
>JWT_SECRET=dein-geheimer-schluessel
>```

#### 6. Datenbank initialisieren
```bash
npx prisma generate
npx prisma migrate build
```

#### 7. Run
```bash
npm run build
npm start
```

Der Server läuft dann unter: **http://localhost:3000**

---

## 🔑 Test-Zugangsdaten
Nach dem Seeding sind folgende Accounts verfügbar:

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Admin | admin@epilog.de | admin |

---

## 📡 API Dokumentation
Die REST API ist unter `/api/` erreichbar. Alle geschützten Endpunkte erfordern einen JWT-Token im Header:

```
Authorization: Bearer <token>
```

Vollständige Swagger Dokumentation unter: [API-Documentation](https://epilog.schamagusa.de/docs)

---

## 🧪 Tests
> API-Tests mit Swagger
> Auf https://epilog.schamagusa.de/docs

---

## 📄 Lizenz
Dieses Projekt wurde im Rahmen einer Studienarbeit an der DHBW Stuttgart erstellt.
