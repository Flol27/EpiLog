import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Hier definieren wir 'inter', damit wir es unten nutzen können
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EpiLog - Dashboard",
  description: "Dein modernes Buchtracking Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      {/* Jetzt kennt Next.js die Variable inter */}
      <body className={`${inter.className} bg-[#09090b] text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}