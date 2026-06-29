import { NextRequest, NextResponse } from 'next/server';
import { authorized } from '@/app/lib/auth';

/**
 * GET /api/me
 * Returns 200 if the session cookie is valid, 401 if not.
 * Used by the landing page to redirect logged-in users to /dashboard.
 */
export async function GET(request: NextRequest) {
    const userId = await authorized('user', request);
    if (!userId) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ userId }, { status: 200 });
}
