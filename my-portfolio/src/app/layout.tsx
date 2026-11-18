import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import { Providers } from "@components/Providers"; 
import Footer from "@components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.matteo-tanzi.dev"),
  title: "Matteo Tanzi | Senior Product Engineer",
  description: "Senior Product Engineer working toward Head of Product. Projects, resume, and a daily learning feed.",
  icons: {
    icon: "/assets/favicon.ico",
    apple: "/assets/apple-touch-icon.png",
  },
  openGraph: {
    title: "Matteo Tanzi | Senior Product Engineer",
    description: "Senior Product Engineer at Endo, working toward Head of Product. Projects, resume, and a daily learning feed.",
    url: "https://www.matteo-tanzi.dev",
    siteName: "Matteo Tanzi",
    images: [
      {
        url: "/assets/og-image.png", // stored in /public/assets/
        width: 1200,
        height: 630,
        alt: "Matteo Tanzi Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matteo Tanzi | Senior Product Engineer",
    description: "Senior Product Engineer at Endo, working toward Head of Product. Projects, resume, and a daily learning feed.",
    images: ["/assets/og-image.png"],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className="bg-slate-900 text-white antialiased">
        <Providers>
          <Navbar />
          <main className="w-full flex justify-center pt-[64px] px-4 sm:px-6 lg:px-8 py-12">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>    
    </html>
  );
}
