import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

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
      <body className={`${inter.className} bg-[#09090b] text-zinc-50 antialiased overflow-y-scroll`}>
        {/* Globaler Container für alle Seiten */}
        <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-7xl mx-auto gap-8">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}