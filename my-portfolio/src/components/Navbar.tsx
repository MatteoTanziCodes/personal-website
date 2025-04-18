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
    `link-hover-box transition-colors duration-200 ${
      pathname === href
        ? "text-[#60A5FA] font-semibold"
        : "text-[var(--fg)] hover:text-primary"
    }`;

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
        style={{ gap: "clamp(1rem, 4vw, 2.3rem)" }}
      >
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={getClassName(link.href)}>
            {link.label}
          </Link>
        ))}

        <a
          href="/Matteo_Tanzi_Resume_2025.pdf"
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
      </div>

      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        aria-label="Toggle Theme"
        className="absolute right-4 top-1/2 -translate-y-1/2 link-hover-box hover:text-primary transition-colors"
      >
        {theme === "light" ? <MoonIcon size={18} /> : <SunIcon size={18} />}
      </button>
    </nav>
  );
}
