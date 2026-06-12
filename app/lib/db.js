import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
    const db = await open({
        filename: './epilog.sqlite', // Wird erstellt, falls nicht vorhanden
        driver: sqlite3.Database
    });

    // Users-Table if not exists
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
    )
    `);

    // Books-Table if not exists TODO
    await db.exec(`
    CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isbn INTEGER,
        title TEXT NOT NULL,
        subtitle TEXT,
        verlag TEXT,
        genres TEXT,
        author TEXT,
        picture TEXT,
        pages INTEGER,
        pub_year INTEGER
    )
    `);

    // reads-Table if not exists
    await db.exec(`
    CREATE TABLE IF NOT EXISTS reads (
        uid INTEGER PRIMARY KEY,
        bid INTEGER PRIMARY KEY,
        page INTEGER,
        stars INTEGER,
        text TEXT
    )
    `);

    // Author-Table if not exists TODO
    await db.exec(`
    CREATE TABLE IF NOT EXISTS author (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT NOT NULL,
        lastname TEXT NOT NULL
    )
    `);

    // Session-Table if not exists TODO
    await db.exec(`
    CREATE TABLE IF NOT EXISTS session (
        token INTEGER PRIMARY KEY,
        user TEXT UNIQUE NOT NULL
    )
    `);

    return db;
}
