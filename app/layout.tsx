import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EpiLog - Dein digitales Bücherregal",
  description: "Dokumentiere, teile und entdecke neue Bücher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="dark">
      {/* Sauberer Standard-Tailwind-Hintergrund */}
      <body 
        className={`${inter.className} antialiased overflow-y-scroll`}
        style={{ backgroundColor: "#09090b", color: "#fafafa" }}
      >
        <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-7xl mx-auto gap-8">
          <Navbar />
          {children}
        </div>
        
      </body>
    </html>
  );
}