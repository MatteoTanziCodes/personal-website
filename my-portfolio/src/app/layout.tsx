import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@components/Navbar";
import { Providers } from "@components/Providers"; 

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "Matteo Tanzi | Software Developer",
  description: "Personal site showcasing projects, resume, and research.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-slate-900 text-white antialiased">
        <Providers>
          <Navbar />
          <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
