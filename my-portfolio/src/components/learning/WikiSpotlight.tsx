"use client";

import { Lightbulb, Sparkles, CalendarDays } from "lucide-react";
import type { DailyWiki } from "@/lib/learning";

interface WikiSpotlightProps {
  wiki: DailyWiki;
  onOpen: (id: string) => void;
  date: string;
}

export default function WikiSpotlight({ wiki, onOpen, date }: WikiSpotlightProps) {
  const { featured, onThisDay, didYouKnow } = wiki;
  if (!featured && !onThisDay && !didYouKnow) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {featured && (
        <a
          href={featured.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onOpen(`wiki:tfa:${date}`)}
          className="group flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm transition-colors hover:border-primary md:col-span-2 sm:flex-row"
        >
          {featured.thumbnail && (
            // External Wikimedia image; next/image optimisation is off for static export anyway.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={featured.thumbnail}
              alt=""
              loading="lazy"
              className="h-44 w-full object-cover sm:h-auto sm:w-48"
            />
          )}
          <div className="flex flex-col gap-2 p-4">
            <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
              <Sparkles size={14} className="text-primary" /> Wikipedia · Featured article
            </span>
            <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-primary">
              {featured.title}
            </h3>
            {featured.description && (
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">{featured.description}</p>
            )}
            <p className="line-clamp-4 text-sm text-[var(--muted)]">{featured.extract}</p>
          </div>
        </a>
      )}

      <div className="flex flex-col gap-4">
        {onThisDay && (
          <InfoCard
            icon={<CalendarDays size={14} className="text-primary" />}
            label={`On this day · ${onThisDay.year}`}
            text={onThisDay.text}
            href={onThisDay.url}
          />
        )}
        {didYouKnow && (
          <InfoCard
            icon={<Lightbulb size={14} className="text-primary" />}
            label="Did you know"
            text={didYouKnow}
          />
        )}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  text,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
        {icon} {label}
      </span>
      <p className="mt-2 text-sm text-[var(--fg)]">{text}</p>
    </>
  );
  const className =
    "flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-colors";

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`${className} hover:border-primary`}>
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
