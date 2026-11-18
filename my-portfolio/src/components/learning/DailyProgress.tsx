"use client";

import { Flame, BookOpen, CalendarDays } from "lucide-react";
import { DAILY_READ_GOAL } from "@/data/learning";

interface DailyProgressProps {
  readToday: number;
  streak: number;
  activeDays: number;
}

export default function DailyProgress({ readToday, streak, activeDays }: DailyProgressProps) {
  const pct = Math.min(100, Math.round((readToday / DAILY_READ_GOAL) * 100));
  const goalMet = readToday >= DAILY_READ_GOAL;

  return (
    <section
      aria-label="Your learning progress"
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-[var(--muted)]">Today&apos;s goal</p>
          <p className="text-2xl font-semibold text-[var(--fg)]">
            {Math.min(readToday, DAILY_READ_GOAL)} / {DAILY_READ_GOAL} reads
            {goalMet && <span className="ml-2 text-base text-primary">Done for today</span>}
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <Stat icon={<Flame size={16} />} label="Day streak" value={streak} />
          <Stat icon={<CalendarDays size={16} />} label="Days learning" value={activeDays} />
          <Stat icon={<BookOpen size={16} />} label="Read today" value={readToday} />
        </div>
      </div>
      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={DAILY_READ_GOAL}
        aria-valuenow={Math.min(readToday, DAILY_READ_GOAL)}
        aria-label="Daily reading goal"
      >
        <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-3 text-xs text-[var(--muted)]">
        Progress is saved in this browser only.
      </p>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex flex-col items-start">
      <span className="flex items-center gap-1 text-lg font-semibold text-[var(--fg)]">
        <span className="text-primary">{icon}</span>
        {value}
      </span>
      <span className="text-xs text-[var(--muted)]">{label}</span>
    </div>
  );
}
