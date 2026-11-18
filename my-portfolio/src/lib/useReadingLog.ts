"use client";

import { useSyncExternalStore } from "react";
import { todayKey } from "@/lib/learning";

// Per-visitor log of what was read each day, kept in this browser only.
const STORAGE_KEY = "learning-read-log-v1";
const RETAIN_DAYS = 400;

type ReadLog = Record<string, string[]>; // YYYY-MM-DD -> article ids

const EMPTY: ReadLog = {};
const EMPTY_LIST: string[] = [];
const listeners = new Set<() => void>();
let snapshot: ReadLog | null = null;

function load(): ReadLog {
  if (snapshot) return snapshot;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    snapshot = parsed && typeof parsed === "object" ? (parsed as ReadLog) : {};
  } catch {
    snapshot = {};
  }
  return snapshot;
}

function save(next: ReadLog) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep working in memory if storage is unavailable.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = null; // another tab changed it; re-read on next snapshot
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function shiftDay(date: string, delta: number) {
  const [y, m, d] = date.split("-").map(Number);
  return todayKey(new Date(y, m - 1, d + delta));
}

function prune(log: ReadLog, today: string): ReadLog {
  const cutoff = shiftDay(today, -RETAIN_DAYS);
  return Object.fromEntries(Object.entries(log).filter(([day]) => day >= cutoff));
}

/** Consecutive days with at least one read, ending today (or yesterday if today has none yet). */
export function computeStreak(log: ReadLog, today: string): number {
  let day = log[today]?.length ? today : shiftDay(today, -1);
  let streak = 0;
  while (log[day]?.length) {
    streak += 1;
    day = shiftDay(day, -1);
  }
  return streak;
}

/** Mark an article read (logged under today) or unread (removed from whichever day it was logged). */
export function setRead(id: string, read: boolean) {
  const current = load();
  const date = todayKey();
  const alreadyRead = Object.values(current).some((ids) => ids.includes(id));
  if (read === alreadyRead) return;

  let next: ReadLog;
  if (read) {
    next = { ...current, [date]: [...(current[date] ?? []), id] };
  } else {
    next = {};
    for (const [day, ids] of Object.entries(current)) {
      const kept = ids.filter((x) => x !== id);
      if (kept.length) next[day] = kept;
    }
  }
  save(prune(next, date));
}

export function useReadingLog() {
  const log = useSyncExternalStore(subscribe, load, () => EMPTY);
  const today = todayKey();
  const readIds = new Set(Object.values(log).flat());

  return {
    readTodayCount: (log[today] ?? EMPTY_LIST).length,
    streak: computeStreak(log, today),
    activeDays: Object.keys(log).length,
    isRead: (id: string) => readIds.has(id),
    setRead,
  };
}
