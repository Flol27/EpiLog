import Database from 'better-sqlite3';  // SQL
import fs from 'fs';                    // Check if File exists
import * as argon2 from 'argon2';       // password hashing

let db; // My Database
export async function openDb() {

    // Development-Modus (Hot Reload Schutz)
    if (process.env.NODE_ENV === 'development' && global._sqliteDB) {
        return global._sqliteDB;
    }

    if(db) return db; // Wenn schon exestiert, nicht nochmal öffnen

    const dbPath = process.env.DB;
    const dbExists = fs.existsSync(dbPath);

    db = dbExists ? new Database(dbPath) : await initDb(dbPath);
    if(!db) throw new Error("Datenbank konnte nicht initialisiert werden!") // Error catching
    db.pragma('foreign_keys = ON;'); // Damit die Relationen beachtet werden (In der Datenbank)

    return db;
}

async function initDb(dbPath) {
    const db = new Database(dbPath);

    // Authors
    db.exec(`
    CREATE TABLE IF NOT EXISTS "authors" (
        "id"	INTEGER,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // Publisher
    db.exec(`
    CREATE TABLE IF NOT EXISTS "publisher" (
        "id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // Books
    db.exec(`
    CREATE TABLE "books" (
        "id"	INTEGER NOT NULL,
        "isbn"	TEXT UNIQUE,
        "title"	TEXT NOT NULL,
        "subtitle"	TEXT,
        "description" TEXT,
        "publisher_id"	INTEGER,
        "picture"	TEXT,
        "pages"	INTEGER,
        "pub_year"	INTEGER,
        PRIMARY KEY("id" AUTOINCREMENT),
        FOREIGN KEY("publisher_id") REFERENCES "publisher"("id") ON DELETE NO ACTION
    );
    `);

    // Genres
    db.exec(`
    CREATE TABLE IF NOT EXISTS "genres" (
        "id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // Users
    db.exec(`
    CREATE TABLE "users" (
        "id"	INTEGER,
        "email"	TEXT NOT NULL UNIQUE,
        "password"	TEXT NOT NULL,
        "role"	TEXT,
        "firstname"	TEXT NOT NULL,
        "lastname"	TEXT,
        PRIMARY KEY("id" AUTOINCREMENT)
    );
    `);

    // book-author
    db.exec(`
    CREATE TABLE IF NOT EXISTS "book_author" (
        "b_id"	INTEGER NOT NULL,
        "a_id"	INTEGER NOT NULL,
        PRIMARY KEY("a_id","b_id"),
        FOREIGN KEY("a_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("b_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // book-genre
    db.exec(`
    CREATE TABLE IF NOT EXISTS "book_genres" (
        "b_id"	INTEGER NOT NULL,
        "g_id"	INTEGER NOT NULL,
        PRIMARY KEY("b_id","g_id"),
        FOREIGN KEY("b_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("g_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // reads (book-user)
    db.exec(`
    CREATE TABLE IF NOT EXISTS "reads" (
        "u_id"	INTEGER NOT NULL,
        "b_id"	INTEGER NOT NULL,
        "paged_read"	INTEGER,
        "start_date"	NUMERIC,
        "read_date"	NUMERIC,
        "rating"	INTEGER,
        "rating_text"	TEXT,
        PRIMARY KEY("u_id","b_id"),
        FOREIGN KEY("b_id") REFERENCES "books"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // Session <-- Braucht man nicht, oder?
    db.exec(`
    CREATE TABLE IF NOT EXISTS "session" (
        "cookie_id"	INTEGER,
        "token"	TEXT NOT NULL,
        "expiration_date"	NUMERIC NOT NULL,
        "u_id"	INTEGER NOT NULL,
        PRIMARY KEY("cookie_id" AUTOINCREMENT),
        FOREIGN KEY("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    //Create Admin User
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswd = await argon2.hash(process.env.ADMIN_PASSWORD);

    // insert as admin
    const insert = db.prepare(`INSERT INTO "users" (email, password, role, firstname) VALUES (?, ?, ?, ?)`);
    insert.run(adminEmail, adminPasswd, 'admin', 'Admin');

    return db;
}
