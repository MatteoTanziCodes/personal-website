// Navbar.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GitHubIcon, MoonIcon, SunIcon } from "@/components/icons";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const links = [
    { label: ":)", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Research", href: "/research" },
    { label: "Trips", href: "/trips" },
  ];

  const getClassName = (href: string) =>
    `whitespace-nowrap link-hover-box transition-colors duration-200 ${
      pathname === href
        ? "text-[#60A5FA] font-semibold"
        : "text-[var(--fg)] hover:text-primary"
    }`;

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)] border-b border-[var(--border)] text-[var(--fg)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-y-4">
          <div className="overflow-x-auto scrollbar-hide w-full sm:w-auto">
            <div className="flex gap-4 min-w-max [@media(max-width:379px)]:gap-0">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={getClassName(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <a
              href="/Matteo_Tanzi_Resume_2026.pdf"
              target="_blank"
              className="link-hover-box text-[var(--fg)] hover:text-primary transition-colors"
            >
              Resume
            </a>
            <a
              href="https://github.com/MatteoTanziCodes"
              target="_blank"
              rel="noopener noreferrer"
              className="link-hover-box text-[var(--fg)] hover:text-primary transition-colors"
              aria-label="View GitHub"
            >
              <GitHubIcon size={20} />
            </a>
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label="Toggle Theme"
              className="link-hover-box hover:text-primary transition-colors"
            >
              {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
            </button>
          </div>
        </div>
      </nav>
  );
}
