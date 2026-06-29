'use server';

import db from '@/app/lib/db';
import argon2 from 'argon2';          // Zum sicheren Abgleich des Passworts
import { createSession } from './session';

export async function loginAction(formData) {
    const email = formData.get('email');
    const username = formData.get('username');
    const password = formData.get('password');

    // 1. User aus der SQLite-Datenbank holen
    const user = email ? db.prepare('SELECT * FROM users WHERE email = ?').get(email) : db.prepare('SELECT * FROM users WHERE username = ?').get(username);


    if (!user) {
        return { error: 'Ungültige Anmeldedaten' };
    }

    // 2. Eingegebenes Passwort mit dem Hash aus der DB vergleichen
    const isPasswordCorrect = await argon2.compare(password, user.password_hash);

    if (!isPasswordCorrect) {
        return { error: 'Ungültige Anmeldedaten' };
    }

    // Wenn alles passt: Session erstellen
    await createSession(user.id);
}
