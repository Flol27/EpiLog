//@/app/api/logout
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Nutzer abmelden
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Erfolgreich abgemeldet
 */
export async function POST() {
  const response = NextResponse.json({ message: "Erfolgreich abgemeldet." }, { status: 200 });
  // Delete the session cookie by setting maxAge to 0
  response.cookies.set("session", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });
  return response;
}
