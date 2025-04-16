"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Github, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // 🚨 key part: don't render *anything* until client matches theme

  return (
    <nav
      className="relative w-full border-b py-4 px-4 sm:px-6 lg:px-8"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "rgba(255,255,255,0.1)",
        color: "var(--fg)",
      }}
    >
      <div
        className="w-full max-w-3xl mx-auto flex justify-end items-center font-medium pr-6 transition-[gap] duration-300"
        style={{ gap: "clamp(1rem, 4vw, 3rem)" }}
      >
        <Link href="/" className="link-hover-box hover:text-primary transition-colors">:)</Link>
        <Link href="/about" className="link-hover-box hover:text-primary transition-colors">About</Link>
        <Link href="/projects" className="link-hover-box hover:text-primary transition-colors">Projects</Link>
        <Link href="/research" className="link-hover-box hover:text-primary transition-colors">Research</Link>
        <Link href="/trips" className="link-hover-box hover:text-primary transition-colors">Trips</Link>
        <a href="/Matteo_Tanzi_Resume_2025.pdf" target="_blank" className="link-hover-box hover:text-primary transition-colors">Resume</a>

        <a
          href="https://github.com/MatteoTanziCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover-box hover:text-primary transition-colors"
          aria-label="View GitHub"
        >
          <Github size={20} strokeWidth={1.5} />
        </a>
      </div>

      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle Theme"
        className="absolute right-4 top-1/2 -translate-y-1/2 link-hover-box hover:text-primary transition-colors"
      >
        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
      </button>
    </nav>
  );
}
