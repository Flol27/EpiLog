import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Hilfsfunktion, die GARANTIERT ein gültiges Secret zurückgibt
function getSecret() {
    const key = process.env.JWT_SECRET || "fallback_entwicklungs_secret_32_zeichen_lang!!!";
    return new TextEncoder().encode(key);
}

export async function authorize(user) {
    // Falls user ein String ist (nur die ID), bauen wir das Objekt passend auf
    const payloadUser = typeof user === 'object' ? user : { id: user, role: 'user' };

    const token = await new SignJWT({ userId: payloadUser.id, role: payloadUser.role || 'user' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1d')
    .sign(getSecret()); // Nutzt die sichere Funktion

    return token;
}

export async function authorized(role, request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        if (!token) {
            console.log("Auth-Check: Kein auth_token gefunden!");
            return false;
        }

        const { payload } = await jwtVerify(token, getSecret()); // Nutzt die sichere Funktion
        return payload.role === role || payload.role === 'admin';
    } catch (error) {
        console.error("Auth-Check: JWT-Verifizierung fehlgeschlagen:", error.message);
        return false;
    }
}