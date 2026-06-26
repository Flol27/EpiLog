import Database from 'better-sqlite3';
import argon2 from 'argon2';

// Datenbankdatei im Projektwurzelverzeichnis anlegen
const db = new Database(process.env.DB);

// Feature 1: initDB() automatisch beim Import ausführen
async function initDB() {

    db.pragma('foreign_keys = ON;'); // Damit die Relationen beachtet werden (In der Datenbank)

    // Books
    db.exec(`
    CREATE TABLE IF NOT EXISTS "books" (
        "id"	INTEGER NOT NULL,
        "isbn"	INTEGER NOT NULL UNIQUE,
        "title"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // Users
    db.exec(`
    CREATE TABLE IF NOT EXISTS "users" (
        "id"	INTEGER,
        "email"	TEXT NOT NULL UNIQUE,
        "username" TEXT NOT NULL UNIQUE,
        "password"	TEXT NOT NULL,
        "role"	TEXT,
        "firstname"	TEXT NOT NULL,
        "lastname"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // book-user
    db.exec(`
    CREATE TABLE IF NOT EXISTS "book_user" (
        "u_id"	INTEGER NOT NULL,
        "b_id"	INTEGER NOT NULL,
        "pages_read"	INTEGER,
        "readstreak_edit_date" NUMERIC,
        "start_date"	NUMERIC,
        "read_date"	NUMERIC,
        "rating"	INTEGER,
        "rating_text"	TEXT,
        PRIMARY KEY("u_id","b_id"),
        FOREIGN KEY("b_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // Admin anlegen, falls Tabelle noch leer ist
    const rowCount = db.prepare('SELECT count(*) as count FROM users').get();

    if (rowCount.count === 0) {
        //Create Admin User
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPasswd = await argon2.hash(process.env.ADMIN_PASSWORD);

        //insert in Database
        const insertAdmin = db.prepare('INSERT INTO "users" (email, username, password, role, firstname) VALUES (?, ?, ?, ?, ?)');
        insertAdmin.run(adminEmail, 'admin', adminPasswd, 'admin', 'Admin');
        console.log('Datenbank initialisiert und Admin-User angelegt.');
    }
}

await initDB();

// Exportiere die DB-Instanz für andere Funktionen
export default db;
