import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function openDb() {
    const db = await open({
        filename: './epilog.sqlite', // Wird erstellt, falls nicht vorhanden
        driver: sqlite3.Database
    });

    // Hier erstellen wir die Tabelle automatisch, falls sie fehlt
    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    `);

    return db;
}
