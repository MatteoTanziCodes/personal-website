"use client";

import { useEffect, useState } from "react";
import type { LearningArticle } from "@/lib/learning";

// public/newsletters.json is written at build time by scripts/fetch-newsletters.mjs.
interface NewsletterFile {
  generatedAt: string;
  items: (LearningArticle & { publishedAt: string })[];
}

/**
 * Spread picks across newsletters: each newsletter's newest post first (newest
 * newsletters first), then second-newest posts, and so on until `limit`.
 * Items arrive sorted newest first.
 */
function pickVariety(items: LearningArticle[], limit: number): LearningArticle[] {
  const rounds: LearningArticle[][] = [];
  const seenPerSource = new Map<string, number>();
  for (const item of items) {
    const rank = seenPerSource.get(item.source) ?? 0;
    seenPerSource.set(item.source, rank + 1);
    (rounds[rank] ??= []).push(item);
  }
  return rounds.flat().slice(0, limit);
}

let request: Promise<LearningArticle[]> | null = null;

function loadNewsletters() {
  // no-cache revalidates against the server, so a fresh deploy shows up immediately.
  request ??= fetch("/newsletters.json", { cache: "no-cache" })
    .then((response) => (response.ok ? (response.json() as Promise<NewsletterFile>) : null))
    .then((file) => file?.items ?? [])
    .catch(() => []);
  return request;
}

export function useNewsletters(limit: number) {
  const [items, setItems] = useState<LearningArticle[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadNewsletters().then((all) => {
      if (!cancelled) setItems(pickVariety(all, limit));
    });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { newsletters: items ?? [], loading: items === null };
}
