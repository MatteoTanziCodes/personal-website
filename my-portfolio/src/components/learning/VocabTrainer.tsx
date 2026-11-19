"use client";

import { useMemo, useState } from "react";
import { Check, GraduationCap, RotateCcw, X } from "lucide-react";
import {
  VOCAB_LEVELS,
  VOCABULARY,
  WORDS_PER_LEVEL,
  type VocabLevel,
  type VocabWord,
} from "@/data/vocabulary";

// Per-visitor answers for each day, kept in this browser only.
const STORAGE_KEY = "learning-vocab-log-v1";
const RETAIN_DAYS = 30;
const CHOICES = 4;

type DayAnswers = Record<string, boolean>; // "level:word" -> answered correctly
type VocabLog = Record<string, DayAnswers>; // YYYY-MM-DD -> answers

function dayNumber(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/** Today's words for a level: consecutive days step through the list in order. */
function wordsForDay(level: VocabLevel, date: string): VocabWord[] {
  const list = VOCABULARY[level];
  const start = (dayNumber(date) * WORDS_PER_LEVEL) % list.length;
  return Array.from({ length: Math.min(WORDS_PER_LEVEL, list.length) }, (_, i) => list[(start + i) % list.length]);
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Correct definition plus distractors from the same level, in a stable order for the day. */
function choicesFor(level: VocabLevel, word: VocabWord, date: string): string[] {
  const others = VOCABULARY[level].filter((w) => w.word !== word.word);
  const rank = (w: VocabWord) => hash(`${date}:${word.word}:${w.word}`);
  const distractors = [...others].sort((a, b) => rank(a) - rank(b)).slice(0, CHOICES - 1);
  const options = [word, ...distractors];
  return options
    .sort((a, b) => hash(`${date}:${a.word}`) - hash(`${date}:${b.word}`))
    .map((w) => w.definition);
}

function loadLog(): VocabLog {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as VocabLog) : {};
  } catch {
    return {};
  }
}

function saveLog(log: VocabLog, today: string) {
  const cutoff = dayNumber(today) - RETAIN_DAYS;
  const pruned = Object.fromEntries(Object.entries(log).filter(([day]) => dayNumber(day) >= cutoff));
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(pruned));
  } catch {
    // Keep working in memory if storage is unavailable.
  }
  return pruned;
}

export default function VocabTrainer({ date }: { date: string }) {
  const [level, setLevel] = useState<VocabLevel>("intermediate");
  const [log, setLog] = useState<VocabLog>(() => (typeof window === "undefined" ? {} : loadLog()));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const answers = log[date] ?? {};
  const words = useMemo(() => wordsForDay(level, date), [level, date]);
  const allWords = VOCAB_LEVELS.flatMap((l) => wordsForDay(l.id, date).map((w) => `${l.id}:${w.word}`));
  const practiced = allWords.filter((key) => key in answers).length;

  const finished = index >= words.length;
  const word = finished ? undefined : words[index];
  const key = word ? `${level}:${word.word}` : "";
  const previous = word ? answers[key] : undefined;
  const choices = useMemo(() => (word ? choicesFor(level, word, date) : []), [level, word, date]);
  const revealed = picked !== null;

  const switchLevel = (next: VocabLevel) => {
    setLevel(next);
    setIndex(0);
    setPicked(null);
  };

  /** "" means the visitor gave up and asked for the answer, which counts as a miss. */
  const answer = (choice: string) => {
    if (!word || revealed) return;
    setPicked(choice);
    // Only the first attempt each day counts toward the score.
    if (key in answers) return;
    const next = { ...log, [date]: { ...answers, [key]: choice === word.definition } };
    setLog(saveLog(next, date));
  };

  const goNext = () => {
    setIndex((i) => i + 1);
    setPicked(null);
  };

  const levelWords = words.map((w) => `${level}:${w.word}`);
  const levelCorrect = levelWords.filter((k) => answers[k]).length;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
          <GraduationCap size={14} className="text-primary" /> Daily vocabulary · {practiced}/{allWords.length}{" "}
          practiced
        </span>
        <div className="flex gap-1 rounded-full border border-[var(--border)] p-0.5" role="group" aria-label="Word level">
          {VOCAB_LEVELS.map((l) => {
            const selected = l.id === level;
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={selected}
                onClick={() => switchLevel(l.id)}
                className={`rounded-full px-3 py-0.5 text-xs transition-colors ${
                  selected ? "bg-primary/15 text-primary" : "text-[var(--muted)] hover:text-primary"
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {word ? (
        <div>
          <div className="mb-1 flex items-center gap-1.5" aria-label={`Word ${index + 1} of ${words.length}`}>
            {words.map((w, i) => (
              <span
                key={w.word}
                className={`h-1.5 w-6 rounded-full ${i <= index ? "bg-primary" : "bg-[var(--border)]"}`}
              />
            ))}
          </div>
          <p className="mt-3 text-2xl font-semibold text-[var(--fg)]">
            {word.word} <span className="text-sm font-normal italic text-[var(--muted)]">{word.pos}</span>
          </p>
          <p className="mb-3 text-sm text-[var(--muted)]">Which definition fits?</p>

          <div className="grid gap-2 sm:grid-cols-2">
            {choices.map((choice) => {
              const correct = choice === word.definition;
              const chosen = choice === picked;
              let tone = "border-[var(--border)] hover:border-primary";
              if (revealed && correct) tone = "border-green-600 bg-green-600/10";
              else if (revealed && chosen) tone = "border-red-600 bg-red-600/10";
              else if (revealed) tone = "border-[var(--border)] opacity-60";
              return (
                <button
                  key={choice}
                  type="button"
                  disabled={revealed}
                  onClick={() => answer(choice)}
                  className={`flex items-start gap-2 rounded-md border p-3 text-left text-sm text-[var(--fg)] transition-colors ${tone}`}
                >
                  {revealed && correct && <Check size={16} className="mt-0.5 shrink-0 text-green-600" />}
                  {revealed && chosen && !correct && <X size={16} className="mt-0.5 shrink-0 text-red-600" />}
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>

          {revealed ? (
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <p className="text-sm italic text-[var(--muted)]">&ldquo;{word.example}&rdquo;</p>
              <button
                type="button"
                onClick={goNext}
                className="rounded border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/10"
              >
                {index + 1 < words.length ? "Next word" : "See results"}
              </button>
            </div>
          ) : (
            <div className="mt-3 flex justify-between text-xs text-[var(--muted)]">
              <span>{previous === undefined ? "" : previous ? "You got this one earlier today" : "Missed earlier today"}</span>
              <button type="button" onClick={() => answer("")} className="hover:text-primary">
                Show answer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-[var(--fg)]">
            {levelCorrect}/{words.length} correct
          </p>
          <ul className="mt-3 space-y-2">
            {words.map((w) => {
              const result = answers[`${level}:${w.word}`];
              return (
                <li key={w.word} className="text-sm">
                  <span className="font-semibold text-[var(--fg)]">{w.word}</span>
                  {result === true && <Check size={14} className="ml-1 inline text-green-600" />}
                  {result === false && <X size={14} className="ml-1 inline text-red-600" />}
                  <span className="text-[var(--muted)]"> · {w.definition}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => switchLevel(level)}
              className="inline-flex items-center gap-1 rounded border border-[var(--border)] px-3 py-1 text-sm text-[var(--muted)] hover:border-primary hover:text-primary"
            >
              <RotateCcw size={14} /> Practice again
            </button>
            {VOCAB_LEVELS.filter((l) => l.id !== level).map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => switchLevel(l.id)}
                className="rounded border border-primary px-3 py-1 text-sm text-primary hover:bg-primary/10"
              >
                Try {l.label.toLowerCase()} words
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
