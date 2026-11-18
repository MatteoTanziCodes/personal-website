"use client";

import { Check, FileText } from "lucide-react";
import type { ResearchPaper } from "@/lib/learning";

interface PaperCardProps {
  paper: ResearchPaper;
  read: boolean;
  onReadChange: (read: boolean) => void;
}

export default function PaperCard({ paper, read, onReadChange }: PaperCardProps) {
  const published = new Date(paper.publishedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <article
      className={`flex min-w-0 flex-col gap-2 rounded-lg border p-4 shadow-sm transition-colors bg-[var(--card)] ${
        read ? "border-[var(--border)] opacity-60" : "border-[var(--border)] hover:border-primary"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <span className="rounded border border-[var(--border)] px-2 py-0.5 text-[var(--fg)]">
          {paper.source}
        </span>
        <span className="truncate">
          {paper.meta ? `${paper.meta} · ` : ""}
          {published}
        </span>
      </div>

      <a
        href={paper.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onReadChange(true)}
        className="break-words text-base font-semibold leading-snug text-[var(--fg)] hover:text-primary"
      >
        {paper.title}
      </a>
      <p className="text-xs text-[var(--muted)]">{paper.authors}</p>
      {paper.summary && (
        <p className="line-clamp-3 text-sm text-[var(--muted)]">{paper.summary}</p>
      )}

      <div className="mt-auto flex items-center justify-end gap-1 pt-1 text-xs text-[var(--muted)]">
        {paper.pdfUrl && (
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onReadChange(true)}
            className="inline-flex items-center gap-1 rounded px-2 py-1 hover:text-primary"
          >
            <FileText size={12} /> PDF
          </a>
        )}
        <button
          type="button"
          onClick={() => onReadChange(!read)}
          aria-pressed={read}
          className={`inline-flex items-center gap-1 rounded border px-2 py-1 transition-colors ${
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
