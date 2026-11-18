"use client";

import { startTransition, useEffect, useState } from "react";
import { LEARNING_TOPICS } from "@/data/learning";
import { fetchDailyLearningFeed, todayKey, type DailyLearningFeed } from "@/lib/learning";

const CACHE_PREFIX = "learning-feed-v3:";

/**
 * Fingerprint of the fetch-related topic config. Editing topics in data/learning.ts
 * changes it, so a feed cached under the old config is ignored instead of showing
 * empty sections for topics it never fetched.
 */
const CONFIG_SIGNATURE = (() => {
  const text = JSON.stringify(
    LEARNING_TOPICS.map(({ id, hnQuery, devtoTags, paperQuery, articleLimit }) => [
      id,
      hnQuery,
      devtoTags,
      paperQuery,
      articleLimit,
    ])
  );
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 33) ^ text.charCodeAt(i);
  return (hash >>> 0).toString(36);
})();

const cacheKey = (date: string) => `${CACHE_PREFIX}${date}:${CONFIG_SIGNATURE}`;

function readCache(date: string): DailyLearningFeed | null {
  try {
    const raw = window.localStorage.getItem(cacheKey(date));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyLearningFeed;
    const hasEveryTopic = LEARNING_TOPICS.every((topic) => parsed.topics?.[topic.id]);
    return parsed.date === date && hasEveryTopic && isWorthCaching(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(feed: DailyLearningFeed) {
  try {
    // Keep only today's feed so storage doesn't grow day over day.
    for (let i = window.localStorage.length - 1; i >= 0; i -= 1) {
      const key = window.localStorage.key(i);
      // Also clears feeds cached under older versions of the prefix.
      if (key?.startsWith("learning-feed-") && key !== cacheKey(feed.date)) {
        window.localStorage.removeItem(key);
      }
    }
    window.localStorage.setItem(cacheKey(feed.date), JSON.stringify(feed));
  } catch {
    // Storage full or blocked: the in-memory feed still renders.
  }
}

/** Cache for the day only if every source answered; otherwise retry on the next visit. */
function isWorthCaching(feed: DailyLearningFeed) {
  return (
    feed.wiki !== null &&
    Object.values(feed.topics).every((topic) => topic.complete) &&
    Boolean(feed.papers) &&
    !feed.papers.trending.failed &&
    Object.values(feed.papers.byTopic).every((topic) => !topic.failed)
  );
}

// Shared across components on the same page so the feed is fetched once.
let inflight: { date: string; promise: Promise<DailyLearningFeed> } | null = null;

function loadFeed(date: string) {
  if (inflight?.date !== date) {
    const promise = fetchDailyLearningFeed(date).then((feed) => {
      if (isWorthCaching(feed)) writeCache(feed);
      else inflight = null;
      return feed;
    });
    inflight = { date, promise };
  }
  return inflight.promise;
}

export function useLearningFeed() {
  const [feed, setFeed] = useState<DailyLearningFeed | null>(null);

  useEffect(() => {
    let cancelled = false;
    const date = todayKey();
    const cached = readCache(date);

    if (cached) {
      startTransition(() => setFeed(cached));
      return;
    }

    loadFeed(date).then((fresh) => {
      if (!cancelled) setFeed(fresh);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { feed, loading: feed === null };
}
