"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Flame, Mail, Sparkles } from "lucide-react";
import { FOCUS_TOPIC_ID, LEARNING_TOPICS } from "@/data/learning";
import { classicForDay, todayKey, type LearningArticle } from "@/lib/learning";
import { useLearningFeed } from "@/lib/useLearningFeed";
import { useReadingLog } from "@/lib/useReadingLog";
import { useNewsletters } from "@/lib/useNewsletters";

const PICKS = 2;
const FOCUS_TOPIC = LEARNING_TOPICS.find((topic) => topic.id === FOCUS_TOPIC_ID);

export default function TodayLearningCard() {
  const { feed, loading } = useLearningFeed();
  const { streak, setRead } = useReadingLog();
  const { newsletters } = useNewsletters(1);
  const newsletter = newsletters[0];

  // Top article from each topic, in topic order, so the picks span different subjects.
  const picks: { topic: string; article: LearningArticle }[] = [];
  for (const topic of LEARNING_TOPICS) {
    const article = feed?.topics[topic.id]?.articles[0];
    if (article) picks.push({ topic: topic.label, article });
    if (picks.length >= PICKS) break;
  }
  const featured = feed?.wiki?.featured;
  const paper = feed?.papers?.trending.papers[0];
  const classic = FOCUS_TOPIC && classicForDay(FOCUS_TOPIC, feed?.date ?? todayKey());

  return (
    <div className="rounded-lg border border-[var(--border)] p-4 shadow-sm">
      {loading ? (
        <div className="space-y-3" aria-hidden>
          {Array.from({ length: PICKS + 1 }, (_, i) => (
            <div key={i} className="h-5 w-full animate-pulse rounded bg-[var(--card)]" />
          ))}
        </div>
      ) : (
        <ul className="space-y-3">
          {classic && (
            <li>
              <a
                href={classic.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRead(`classic:${classic.url}`, true)}
                className="group block"
              >
                <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                  <BookOpen size={12} className="text-primary" /> {FOCUS_TOPIC?.label} classic · {classic.author}
                </span>
                <span className="font-medium text-[var(--fg)] group-hover:text-primary">{classic.title}</span>
              </a>
            </li>
          )}
          {newsletter && (
            <li>
              <a
                href={newsletter.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRead(newsletter.id, true)}
                className="group block"
              >
                <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                  <Mail size={12} className="text-primary" /> {newsletter.source}
                </span>
                <span className="font-medium text-[var(--fg)] group-hover:text-primary">{newsletter.title}</span>
              </a>
            </li>
          )}
          {featured && (
            <li>
              <a
                href={featured.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRead(`wiki:tfa:${feed?.date}`, true)}
                className="group block"
              >
                <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                  <Sparkles size={12} className="text-primary" /> Wikipedia featured
                </span>
                <span className="font-medium text-[var(--fg)] group-hover:text-primary">{featured.title}</span>
              </a>
            </li>
          )}
          {paper && (
            <li>
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRead(paper.id, true)}
                className="group block"
              >
                <span className="flex items-center gap-1 text-xs text-[var(--muted)]">
                  <FileText size={12} className="text-primary" /> Trending paper · {paper.meta}
                </span>
                <span className="font-medium text-[var(--fg)] group-hover:text-primary">{paper.title}</span>
              </a>
            </li>
          )}
          {picks.map(({ topic, article }) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setRead(article.id, true)}
                className="group block"
              >
                <span className="text-xs text-[var(--muted)]">
                  {topic} · {article.source}
                </span>
                <span className="block font-medium text-[var(--fg)] group-hover:text-primary">
                  {article.title}
                </span>
              </a>
            </li>
          ))}
          {!classic && !newsletter && !featured && !paper && !picks.length && (
            <li className="text-sm text-[var(--muted)]">Today&apos;s feed couldn&apos;t load. Try the full page.</li>
          )}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-sm">
        <Link href="/learning" className="inline-flex items-center gap-1 text-primary hover:underline">
          Open today&apos;s feed <ArrowRight size={14} />
        </Link>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 text-[var(--muted)]">
            <Flame size={14} className="text-primary" /> {streak}-day streak
          </span>
        )}
      </div>
    </div>
  );
}
