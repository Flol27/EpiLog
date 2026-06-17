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
      {/* Wir entfernen die Farben aus dem Body, behalten aber den Scroll-Fix */}
      <body className={`${inter.className} antialiased overflow-y-scroll`}>
        
        {/* NEU: Dieser Container zwingt die gesamte Seite absolut zuverlässig in den Dark Mode */}
        <div className="min-h-screen bg-[#09090b] text-zinc-50 w-full">
          
          {/* Dein altes Layout-Grid */}
          <div className="flex flex-col p-4 md:p-8 max-w-7xl mx-auto gap-8">
            <Navbar />
            {children}
          </div>
          
        </div>
        
      </body>
    </html>
  );
}