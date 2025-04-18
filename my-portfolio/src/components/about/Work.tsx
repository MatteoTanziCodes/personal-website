// src/components/about/Work.tsx
"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function Work() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const jobs = useMemo(
    () => [
      { title: "Lab Developer @ Robarts Institute", start: 2021, end: 2022 },
      { title: "Software Developer Intern @ LobbyIQ", start: 2022, end: 2023 },
      { title: "DevOps Engineer @ BMO", start: 2022, end: 2023 },
      { title: "Software Engineer @ BMO", start: 2023, end: 2025 },
    ],
    []
  );

  const minYear = 2020;
  const maxYear = 2025;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);

  const isDark = theme === "dark";
  const fg = isDark ? "text-zinc-400" : "text-neutral-500";
  const border = isDark ? "border-white/10" : "border-neutral-300";
  const barBg = isDark ? "bg-zinc-800 text-white" : "bg-neutral-800 text-white";

  const gridCols = `repeat(${years.length}, minmax(160px, 1fr))`;

  if (!mounted) return null;

  return (
    <section
      id="work"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-4 sm:px-6"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">Work</h2>
          <Link
            href="/Matteo_Tanzi_Resume_2025.pdf"
            target="_blank"
            className="self-start mb-6 inline-flex items-center gap-1 px-4 py-2 border border-[color:var(--fg)] text-[color:var(--fg)] rounded hover:bg-primary/10 text-sm transition-colors"
          >
            View Resume
          </Link>

          {/* TIMELINE view (830px and above) */}
          <div className="hidden min-[830px]:block">
            <div
              className={`overflow-x-auto w-full pt-6 pb-6 border-t ${border} custom-scrollbar`}
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div
                className="inline-grid"
                style={{
                  gridTemplateColumns: gridCols,
                  gridAutoRows: "auto",
                  gap: "1rem 1rem",
                  minWidth: `${years.length * 160}px`,
                }}
              >
                {years.map((year) => (
                  <div
                    key={year}
                    className={`text-center py-2 font-medium select-none ${fg} border-b ${border}`}
                  >
                    {year}
                  </div>
                ))}
                {jobs.map((job, idx) => {
                  const startCol = job.start - minYear + 1;
                  const endCol = job.end - minYear + 1;
                  return (
                    <div
                      key={idx}
                      className={`px-4 py-2 rounded shadow-md ${barBg} whitespace-normal`}
                      style={{
                        gridColumn: `${startCol} / ${endCol}`,
                        gridRow: idx + 2,
                      }}
                    >
                      {job.title}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* STACKED card view (<830px) */}
          <div className="block min-[830px]:hidden space-y-4">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="rounded-md border border-[var(--border)] bg-[var(--card)] p-4 text-[var(--fg)] shadow-sm"
              >
                <p className="font-medium">{job.title}</p>
                <p className="text-sm text-[var(--muted)] mt-1">
                  {job.start} – {job.end}
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
