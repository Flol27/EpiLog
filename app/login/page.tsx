// app/login/page.js
import { loginAction } from './actions';

export default function LoginPage() {
    return (
        <main>
        <h1>Login</h1>
        <form action={loginAction}>
        <input type="email" name="email" required placeholder="E-Mail" />
        <input type="password" name="password" required placeholder="Passwort" />
        <button type="submit">Einloggen</button>
        </form>
        </main>
    );
}
