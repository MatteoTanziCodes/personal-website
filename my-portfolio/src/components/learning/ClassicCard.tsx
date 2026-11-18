"use client";

import { BookOpen, Check } from "lucide-react";
import type { ClassicRead } from "@/data/learning";

interface ClassicCardProps {
  classic: ClassicRead;
  read: boolean;
  onReadChange: (read: boolean) => void;
}

/** Today's rotating evergreen read; always available, even when live sources are quiet. */
export default function ClassicCard({ classic, read, onReadChange }: ClassicCardProps) {
  return (
    <article
      className={`flex min-w-0 flex-col gap-2 rounded-lg border-2 p-5 shadow-sm transition-colors bg-[var(--card)] ${
        read ? "border-[var(--border)] opacity-70" : "border-primary/60 hover:border-primary"
      }`}
    >
      <span className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-primary">
        <BookOpen size={14} /> Today&apos;s classic
      </span>
      <a
        href={classic.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onReadChange(true)}
        className="break-words text-xl font-semibold leading-snug text-[var(--fg)] hover:text-primary"
      >
        {classic.title}
      </a>
      <div className="flex items-center justify-between gap-2 text-sm text-[var(--muted)]">
        <span>{classic.author}</span>
        <button
          type="button"
          onClick={() => onReadChange(!read)}
          aria-pressed={read}
          className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs transition-colors ${
            read
              ? "border-primary text-primary"
              : "border-[var(--border)] hover:border-primary hover:text-primary"
          }`}
        >
          <Check size={12} />
          {read ? "Read" : "Mark read"}
        </button>
      </div>
    </article>
  );
}
