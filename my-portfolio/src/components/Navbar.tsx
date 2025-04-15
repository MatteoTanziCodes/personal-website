"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Github, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="w-full border-b border-white/10 bg-slate-900 px-6 py-4 text-white flex justify-between items-center">
      {/* Left: Navigation Links */}
      <div className="flex gap-6 text-sm font-medium">
        <Link href="/about" className="hover:text-primary transition-colors">About</Link>
        <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
        <Link href="/trips" className="hover:text-primary transition-colors">Trips</Link>
        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        <a href="/Matteo_Tanzi_Resume_2025.pdf" target="_blank" className="hover:text-primary transition-colors">
          Resume
        </a>
      </div>

      {/* Right: GitHub + Theme Toggle */}
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/MatteoTanziCodes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          <Github size={20} />
        </a>

        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            aria-label="Toggle Theme"
            className="hover:text-primary transition-colors"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        )}
      </div>
    </nav>
  );
}
