"use client";

import { Check, MessageSquare } from "lucide-react";
import { timeAgo, type LearningArticle } from "@/lib/learning";

interface ArticleCardProps {
  article: LearningArticle;
  read: boolean;
  onReadChange: (read: boolean) => void;
}

export default function ArticleCard({ article, read, onReadChange }: ArticleCardProps) {
  return (
    <article
      className={`group flex min-w-0 flex-col gap-2 rounded-lg border p-4 shadow-sm transition-colors bg-[var(--card)] ${
        read ? "border-[var(--border)] opacity-60" : "border-[var(--border)] hover:border-primary"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
        <span className="rounded border border-[var(--border)] px-2 py-0.5 text-[var(--fg)]">
          {article.source}
        </span>
        <span>{timeAgo(article.publishedAt)}</span>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onReadChange(true)}
        className="break-words text-base font-semibold leading-snug text-[var(--fg)] hover:text-primary"
      >
        {article.title}
      </a>
      {article.summary && (
        <p className="line-clamp-2 text-sm text-[var(--muted)]">{article.summary}</p>
      )}

      <div className="mt-auto flex items-center justify-between gap-2 pt-1 text-xs text-[var(--muted)]">
        <span className="min-w-0 truncate">
          {[article.author, article.meta].filter(Boolean).join(" · ")}
        </span>
        <div className="flex shrink-0 items-center gap-1">
          {article.discussionUrl && article.discussionUrl !== article.url && (
            <a
              href={article.discussionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded p-1.5 hover:text-primary"
              aria-label="Open discussion"
              title="Discussion"
            >
              <MessageSquare size={14} />
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
      </div>
    </article>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="h-36 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)]" />
  );
}
