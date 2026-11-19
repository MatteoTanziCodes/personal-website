"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ThemeClientReady from "@/components/ThemeClientReady";
import PageWrapper from "@/components/PageWrapper";
import BackToTopButton from "@/components/BackToTopButton";
import ArticleCard, { ArticleCardSkeleton } from "@/components/learning/ArticleCard";
import DailyProgress from "@/components/learning/DailyProgress";
import WikiSpotlight from "@/components/learning/WikiSpotlight";
import PaperCard from "@/components/learning/PaperCard";
import ClassicCard from "@/components/learning/ClassicCard";
import VocabTrainer from "@/components/learning/VocabTrainer";
import {
  FOCUS_TOPIC_ID,
  LEARNING_TOPICS,
  type LearningTopic,
  ARTICLES_PER_TOPIC,
  PAPERS_PER_TOPIC,
  PAPER_WINDOW_DAYS,
  TRENDING_AI_PAPERS,
} from "@/data/learning";
import {
  classicForDay,
  todayKey,
  type DailyLearningFeed,
  type PaperFeed,
  type TopicFeed,
} from "@/lib/learning";
import { useLearningFeed } from "@/lib/useLearningFeed";
import { useReadingLog } from "@/lib/useReadingLog";
import { useNewsletters } from "@/lib/useNewsletters";

const NEWSLETTER_POSTS = 6;
const FOCUS_TOPIC = LEARNING_TOPICS.find((topic) => topic.id === FOCUS_TOPIC_ID);
const OTHER_TOPICS = LEARNING_TOPICS.filter((topic) => topic !== FOCUS_TOPIC);
const PAPER_TOPICS = OTHER_TOPICS.filter((topic) => topic.paperQuery);

interface TopicArticlesProps {
  topic: LearningTopic;
  loading: boolean;
  feed?: TopicFeed;
  hasClassic: boolean;
  isRead: (id: string) => boolean;
  setRead: (id: string, read: boolean) => void;
}

function TopicArticles({ topic, loading, feed, hasClassic, isRead, setRead }: TopicArticlesProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: Math.min(topic.articleLimit ?? ARTICLES_PER_TOPIC, 4) }, (_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (feed?.articles.length) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {feed.articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            read={isRead(article.id)}
            onReadChange={(read) => setRead(article.id, read)}
          />
        ))}
      </div>
    );
  }
  return (
    <p className="text-sm text-[var(--muted)]">
      {feed?.failed
        ? "Couldn't reach the sources for this topic. Try again later."
        : hasClassic
          ? "No fresh articles today, so start with the classic above."
          : "Nothing new in the last few days. Check back tomorrow."}
    </p>
  );
}

interface PaperGroupProps {
  title: string;
  subtitle: string;
  loading: boolean;
  feed?: PaperFeed;
  skeletons: number;
  isRead: (id: string) => boolean;
  setRead: (id: string, read: boolean) => void;
}

function PaperGroup({ title, subtitle, loading, feed, skeletons, isRead, setRead }: PaperGroupProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-[var(--fg)]">{title}</h3>
      <p className="mb-3 text-xs text-[var(--muted)]">{subtitle}</p>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: skeletons }, (_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </div>
      ) : feed?.papers.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {feed.papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              read={isRead(paper.id)}
              onReadChange={(read) => setRead(paper.id, read)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--muted)]">
          {feed?.failed ? "Couldn't reach the paper index. Try again later." : "No new papers this week."}
        </p>
      )}
    </div>
  );
}

type ContentType = "knowledge" | "papers" | "articles";

const ALL_TOPICS = "all";
const TRENDING = "trending";
const VIEW_STORAGE_KEY = "learning-explore-view-v1";

const CONTENT_TYPES: { id: ContentType; label: string; blurb: string }[] = [
  {
    id: "knowledge",
    label: "General knowledge",
    blurb: "Wikipedia's picks for today and a daily vocabulary drill.",
  },
  {
    id: "papers",
    label: "Research papers",
    blurb: `What the AI community is upvoting today, plus new arXiv papers from the last ${PAPER_WINDOW_DAYS} days.`,
  },
  {
    id: "articles",
    label: "Articles",
    blurb: "Fresh articles from Hacker News and DEV across the other topics I follow.",
  },
];

/** Topic filters for each content type; general knowledge has none. */
const TOPIC_FILTERS: Record<ContentType, { id: string; label: string }[]> = {
  knowledge: [],
  papers: [
    { id: ALL_TOPICS, label: "All" },
    { id: TRENDING, label: "Trending in AI" },
    ...PAPER_TOPICS.map(({ id, label }) => ({ id, label })),
  ],
  articles: [{ id: ALL_TOPICS, label: "All" }, ...OTHER_TOPICS.map(({ id, label }) => ({ id, label }))],
};

interface ExploreView {
  type: ContentType;
  topic: Record<ContentType, string>;
}

const DEFAULT_VIEW: ExploreView = {
  type: "knowledge",
  topic: { knowledge: ALL_TOPICS, papers: TRENDING, articles: ALL_TOPICS },
};

function loadView(): ExploreView {
  try {
    const saved = JSON.parse(window.localStorage.getItem(VIEW_STORAGE_KEY) ?? "null") as ExploreView | null;
    if (!saved || !CONTENT_TYPES.some((t) => t.id === saved.type)) return DEFAULT_VIEW;
    const topic = { ...DEFAULT_VIEW.topic };
    for (const type of ["papers", "articles"] as const) {
      const id = saved.topic?.[type];
      if (TOPIC_FILTERS[type].some((f) => f.id === id)) topic[type] = id;
    }
    return { type: saved.type, topic };
  } catch {
    return DEFAULT_VIEW;
  }
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-[var(--border)] text-[var(--muted)] hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

interface ExploreSectionProps {
  date: string;
  loading: boolean;
  feed?: DailyLearningFeed | null;
  isRead: (id: string) => boolean;
  setRead: (id: string, read: boolean) => void;
}

/**
 * General knowledge, research papers, and the other topics' articles share one panel:
 * a content-type toggle on top, then topic filters for papers and articles.
 */
function ExploreSection({ date, loading, feed, isRead, setRead }: ExploreSectionProps) {
  const [view, setView] = useState<ExploreView>(() =>
    typeof window === "undefined" ? DEFAULT_VIEW : loadView()
  );

  const update = (next: ExploreView) => {
    setView(next);
    try {
      window.localStorage.setItem(VIEW_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Remembering the view is a convenience only.
    }
  };
  const chooseType = (type: ContentType) => update({ ...view, type });
  const chooseTopic = (topic: string) => update({ ...view, topic: { ...view.topic, [view.type]: topic } });

  const type = CONTENT_TYPES.find((t) => t.id === view.type) ?? CONTENT_TYPES[0];
  const topic = view.topic[view.type];
  const filters = TOPIC_FILTERS[view.type];

  const trendingPapers = (
    <PaperGroup
      key={TRENDING}
      title="Trending in AI"
      subtitle="Hugging Face Daily Papers"
      loading={loading}
      feed={feed?.papers.trending}
      skeletons={TRENDING_AI_PAPERS}
      isRead={isRead}
      setRead={setRead}
    />
  );
  const topicPapers = (t: LearningTopic) => (
    <PaperGroup
      key={t.id}
      title={t.label}
      subtitle={`arXiv · "${t.paperQuery}"`}
      loading={loading}
      feed={feed?.papers.byTopic[t.id]}
      skeletons={PAPERS_PER_TOPIC}
      isRead={isRead}
      setRead={setRead}
    />
  );
  const topicArticles = (t: LearningTopic) => (
    <div key={t.id}>
      <h3 className="text-lg font-semibold text-[var(--fg)]">{t.label}</h3>
      <p className="mb-3 text-xs text-[var(--muted)]">{t.description}</p>
      <TopicArticles
        topic={t}
        loading={loading}
        feed={feed?.topics[t.id]}
        hasClassic={false}
        isRead={isRead}
        setRead={setRead}
      />
    </div>
  );

  let content: React.ReactNode;
  if (view.type === "knowledge") {
    content = (
      <div className="space-y-4">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-44 animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)] md:col-span-2" />
            <ArticleCardSkeleton />
          </div>
        ) : feed?.wiki ? (
          <WikiSpotlight wiki={feed.wiki} date={date} onOpen={(id) => setRead(id, true)} />
        ) : (
          <p className="text-sm text-[var(--muted)]">Wikipedia&apos;s daily feed is unavailable right now.</p>
        )}
        <VocabTrainer date={date} />
      </div>
    );
  } else if (view.type === "papers") {
    const groups =
      topic === ALL_TOPICS
        ? [trendingPapers, ...PAPER_TOPICS.map(topicPapers)]
        : topic === TRENDING
          ? [trendingPapers]
          : PAPER_TOPICS.filter((t) => t.id === topic).map(topicPapers);
    content = <div className="space-y-8">{groups}</div>;
  } else {
    const topics = topic === ALL_TOPICS ? OTHER_TOPICS : OTHER_TOPICS.filter((t) => t.id === topic);
    content = <div className="space-y-8">{topics.map(topicArticles)}</div>;
  }

  return (
    <section aria-labelledby="explore-heading">
      <h2 id="explore-heading" className="text-2xl font-semibold text-[var(--fg)]">
        Today&apos;s knowledge
      </h2>
      <p className="mb-4 text-sm text-[var(--muted)]">{type.blurb}</p>

      <div className="mb-6 space-y-3">
        <div
          className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1"
          role="group"
          aria-label="What to show"
        >
          {CONTENT_TYPES.map((t) => {
            const selected = t.id === view.type;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={selected}
                onClick={() => chooseType(t.id)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  selected ? "bg-primary/15 text-primary" : "text-[var(--muted)] hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {filters.length > 0 && (
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            {filters.map((f) => (
              <Chip key={f.id} selected={f.id === topic} onClick={() => chooseTopic(f.id)}>
                {f.label}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {content}
    </section>
  );
}

export default function LearningPage() {
  const { feed, loading } = useLearningFeed();
  const { readTodayCount, streak, activeDays, isRead, setRead } = useReadingLog();
  const { newsletters, loading: newslettersLoading } = useNewsletters(NEWSLETTER_POSTS);

  const date = feed?.date ?? todayKey();
  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const focusClassic = FOCUS_TOPIC && classicForDay(FOCUS_TOPIC, date);

  return (
    <ThemeClientReady>
      <PageWrapper>
        <header className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-[var(--fg)]"
          >
            Learning
          </motion.h1>
          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            A fresh daily feed across the topics I&apos;m learning about: articles, new research
            papers, and something outside tech. It refreshes every day.
          </p>
          <p className="mt-2 text-sm font-medium text-primary">{dateLabel}</p>
        </header>

        <div className="space-y-10">
          <DailyProgress readToday={readTodayCount} streak={streak} activeDays={activeDays} />

          {FOCUS_TOPIC && (
            <section
              aria-labelledby="focus-heading"
              className="space-y-6 rounded-xl border border-primary/40 bg-primary/5 p-4 sm:p-6"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-primary">Today&apos;s focus</p>
                <h2 id="focus-heading" className="text-2xl font-semibold text-[var(--fg)]">
                  {FOCUS_TOPIC.label}
                </h2>
                <p className="text-sm text-[var(--muted)]">{FOCUS_TOPIC.description}</p>
              </div>

              {focusClassic && (
                <ClassicCard
                  classic={focusClassic}
                  read={isRead(`classic:${focusClassic.url}`)}
                  onReadChange={(read) => setRead(`classic:${focusClassic.url}`, read)}
                />
              )}

              {(newslettersLoading || newsletters.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--fg)]">From product newsletters</h3>
                  <p className="mb-3 text-xs text-[var(--muted)]">
                    Latest from Lenny&apos;s Newsletter, SVPG, First Round Review, and more
                  </p>
                  {newslettersLoading ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {Array.from({ length: 4 }, (_, i) => (
                        <ArticleCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {newsletters.map((post) => (
                        <ArticleCard
                          key={post.id}
                          article={post}
                          read={isRead(post.id)}
                          onReadChange={(read) => setRead(post.id, read)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <h3 className="mb-3 text-lg font-semibold text-[var(--fg)]">From the community</h3>
                <TopicArticles
                  topic={FOCUS_TOPIC}
                  loading={loading}
                  feed={feed?.topics[FOCUS_TOPIC.id]}
                  hasClassic={Boolean(focusClassic)}
                  isRead={isRead}
                  setRead={setRead}
                />
              </div>

              {FOCUS_TOPIC.paperQuery && (
                <PaperGroup
                  title="Research"
                  subtitle={`New arXiv papers · "${FOCUS_TOPIC.paperQuery}"`}
                  loading={loading}
                  feed={feed?.papers.byTopic[FOCUS_TOPIC.id]}
                  skeletons={PAPERS_PER_TOPIC}
                  isRead={isRead}
                  setRead={setRead}
                />
              )}
            </section>
          )}

          <ExploreSection
            date={date}
            loading={loading}
            feed={feed}
            isRead={isRead}
            setRead={setRead}
          />

          <p className="text-xs text-[var(--muted)]">
            Sources:{" "}
            <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer" className="underline">
              Hacker News
            </a>
            ,{" "}
            <a href="https://dev.to" target="_blank" rel="noopener noreferrer" className="underline">
              DEV
            </a>
            , and{" "}
            <a href="https://en.wikipedia.org" target="_blank" rel="noopener noreferrer" className="underline">
              Wikipedia
            </a>
            .
          </p>
        </div>

        <BackToTopButton />
      </PageWrapper>
    </ThemeClientReady>
  );
}
