// src/components/about/Work.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useMemo } from "react";

export default function Work() {
  const { theme } = useTheme();

  const jobs = useMemo(
    () => [
      { title: "Lab Developer @ Robarts Institute",    start: 2021, end: 2022 },
      { title: "Software Developer Intern @ LobbyIQ",  start: 2022, end: 2023 },
      { title: "DevOps Engineer @ BMO",                start: 2022, end: 2023 },
      { title: "Software Engineer @ BMO",              start: 2023, end: 2025 },
    ],
    []
  );

  const minYear = 2020;
  const maxYear = 2025;
  const years   = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const isDark = theme === "dark";
  const fg     = isDark ? "text-zinc-400"        : "text-neutral-500";
  const border = isDark ? "border-white/10"      : "border-neutral-300";
  const barBg  = isDark ? "bg-zinc-800 text-white" : "bg-neutral-800 text-white";

  // build a CSS grid string for your columns
  const gridCols = `repeat(${years.length}, minmax(160px, 1fr))`;

  return (
    <section
      id="work"
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center px-8 py-12"
    >
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-4"
      >
        Work
      </motion.h2>

      {/* Resume Button */}
      <Link
        href="/Matteo_Tanzi_Resume_2025.pdf"
        target="_blank"
        className="self-start mb-6 inline-flex items-center gap-1 px-4 py-2 border border-[color:var(--fg)] text-[color:var(--fg)] rounded hover:bg-primary/10 text-sm transition-colors"
      >
        View Resume
      </Link>

      {/* Timeline: horizontal scroll + extra bottom padding */}
      <div
        className={`overflow-x-auto overflow-y-hidden w-full pt-6 pb-6 border-t ${border} custom-scrollbar`}
      >
        <div
          className="inline-grid"
          style={{
            gridTemplateColumns: gridCols,
            gridAutoRows: "auto",
            gap: "1rem 1rem",               // ↑ more vertical gap
            minWidth: `${years.length * 160}px`,
          }}
        >
          {/* Year labels */}
          {years.map((year) => (
            <div
              key={year}
              className={`text-center py-2 font-medium select-none ${fg} border-b ${border}`}
            >
              {year}
            </div>
          ))}

          {/* Jobs: each in its own row, spanning correct columns */}
          {jobs.map((job, idx) => {
            const startCol = job.start - minYear + 1;
            const endCol   = job.end   - minYear + 1;
            return (
              <div
                key={idx}
                className={`px-4 py-2 rounded shadow-md ${barBg} whitespace-normal`}
                style={{
                  gridColumn: `${startCol} / ${endCol}`,
                  gridRow:    idx + 2,             // row 1=years, so +2
                }}
              >
                {job.title}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
