import { NextResponse } from "next/server";

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
