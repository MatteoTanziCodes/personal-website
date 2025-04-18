import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import { Providers } from "@components/Providers"; 
import Footer from "@components/Footer";

export const metadata: Metadata = {
  title: "Matteo Tanzi | Software Developer",
  description: "Personal site showcasing projects, resume, and research.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="bg-slate-900 text-white antialiased">
        <Providers>
          <Navbar />
          <main className="w-full flex justify-center pt-[64px] px-4 sm:px-6 lg:px-8 py-12">
            <div className="w-full max-w-3xl">{children}</div>
          </main>
          <Footer />
        </Providers>
      </body>    
    </html>
  );
}
