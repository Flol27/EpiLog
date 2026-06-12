import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import bcrypt from 'bcrypt';


export async function openDb(path) {
    const exists = fs.existsSync(path);
    const db = await open({filename: path, driver: sqlite3.Database});

    // AI said ...
    await db.exec('PRAGMA foreign_keys = ON;');

    if(!exists){await initDb(db);} //Init DB
    return db;
}
export async function initDb(db) {

    // Authors
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "authors" (
        "author_id"	INTEGER,
        "name"	TEXT,
        PRIMARY KEY("author_id" AUTOINCREMENT)
    );
    `);

    // Books
    await db.exec(`
    CREATE TABLE "books" (
        "book_id"	INTEGER NOT NULL,
        "isbn"	TEXT UNIQUE,
        "title"	TEXT NOT NULL,
        "subtitle"	TEXT,
        "publisher_id"	INTEGER,
        "picture"	TEXT,
        "pages"	INTEGER,
        "pub_year"	INTEGER,
        PRIMARY KEY("book_id" AUTOINCREMENT),
        FOREIGN KEY("publisher_id") REFERENCES "publisher"("publisher_id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // Genres
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "genres" (
        "genre_id"	INTEGER NOT NULL,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("genre_id" AUTOINCREMENT)
    );
    `);

    // Publisher
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "publisher" (
        "publisher_id"	INTEGER NOT NULL,
        "name"	INTEGER,
        PRIMARY KEY("publisher_id" AUTOINCREMENT)
    );
    `);

    // Users
    await db.exec(`
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
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "book_author" (
        "b_id"	INTEGER NOT NULL,
        "a_id"	INTEGER NOT NULL,
        PRIMARY KEY("a_id","b_id"),
        FOREIGN KEY("a_id") REFERENCES "authors"("author_id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("b_id") REFERENCES ""
    );
    `);

    // book-genre
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "book_genres" (
        "b_id"	INTEGER NOT NULL,
        "g_id"	INTEGER NOT NULL,
        PRIMARY KEY("b_id","g_id"),
        FOREIGN KEY("b_id") REFERENCES "",
        FOREIGN KEY("g_id") REFERENCES "genres"("genre_id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // reads (book-user)
    await db.exec(`
    CREATE TABLE IF NOT EXISTS "reads" (
        "u_id"	INTEGER NOT NULL,
        "b_id"	INTEGER NOT NULL,
        "paged_read"	INTEGER,
        "start_date"	NUMERIC,
        "read_date"	NUMERIC,
        "rating"	INTEGER,
        "rating_text"	TEXT,
        PRIMARY KEY("u_id","b_id"),
        FOREIGN KEY("b_id") REFERENCES "books"("book_id") ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY("u_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
    );
    `);

    // Session
    await db.exec(`
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
    const adminPasswd = process.env.ADMIN_PASSWORD;

    // hash password
    const saltRounds = 10;
    const hash = bcrypt.hash(adminPasswd, saltRounds);

    // insert as admin
    const result = await db.run(`
    INSERT INTO "users" (email, password, role, firstname) VALUES (?, ?, ?, 'Admin')`,
                                [adminEmail, hash, 'admin']
    );
    console.log(result);



}
