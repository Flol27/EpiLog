'use server';

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';          // Zum sicheren Abgleich des Passworts
import { createSession } from './session'; // Siehe Schritt 4
import { openDb } from '@/app/lib/db';

const db = openDb(process.env.DB);

export async function loginAction(formData) {
    const email = formData.get('email');
    const password = formData.get('password');

    // 1. User aus der SQLite-Datenbank holen
    const statement = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = statement.get(email);

    if (!user) {
        return { error: 'Ungültige Anmeldedaten' };
    }

    // 2. Eingegebenes Passwort mit dem Hash aus der DB vergleichen
    const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
        return { error: 'Ungültige Anmeldedaten' };
    }

    // Wenn alles passt: Session erstellen
    await createSession(user.id);
}
