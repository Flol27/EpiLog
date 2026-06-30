//@/app/lib/tools.js
/**
 * Prüft die einzelnden Einträge nach ihrer Richtigkeit
 */

export function checkDate(date) {
    if (date === undefined) return false;
    if (date === null) return false;
    return !isNaN(new Date(date).getTime());
}

export function checkEmail(email) {
    if (email === undefined) return false;
    if (email === null) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function checkUsername(username) {
    if (username === undefined) return false;
    if (username === null) return false;
    return /^[a-zA-Z0-9_.]{3,20}$/.test(username);
}

export function checkPassword(password) {
    if (password === undefined) return false;
    if (password === null) return false; // Passwort darf nie null sein
    return typeof password === 'string' && password.length >= 8;
}

export function checkName(name) {
    if (name === undefined) return false;
    if (name === null) return true;
    return typeof name === 'string' && name.trim().length > 0 && name.length <= 50;
}

export function checkRole(role) {
    if (role === undefined) return false;
    if (role === null) return false;
    return ['user', 'admin'].includes(role);
}

export function checkISBN(isbn) {
    if (isbn === undefined) return false;
    if (isbn === null) return false;
    const cleaned = String(isbn).replace(/-/g, '');
    return /^(\d{10}|\d{13})$/.test(cleaned);
}

export function checkNum(num) {
    if (num === undefined) return false;
    if (num === null) return false;
    return typeof num === 'number' && !isNaN(num);
}

export function checkText(text) {
    if (text === undefined) return false;
    if (text === null) return false;
    return typeof text === 'string';
}
