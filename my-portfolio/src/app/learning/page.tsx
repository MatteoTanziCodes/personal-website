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
import {
  FOCUS_TOPIC_ID,
  LEARNING_TOPICS,
  type LearningTopic,
  ARTICLES_PER_TOPIC,
  PAPERS_PER_TOPIC,
  PAPER_WINDOW_DAYS,
  TRENDING_AI_PAPERS,
} from "@/data/learning";
import { classicForDay, todayKey, type PaperFeed, type TopicFeed } from "@/lib/learning";
import { useLearningFeed } from "@/lib/useLearningFeed";
import { useReadingLog } from "@/lib/useReadingLog";
import { useNewsletters } from "@/lib/useNewsletters";

const ALL = "all";
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

export default function LearningPage() {
  const { feed, loading } = useLearningFeed();
  const { readTodayCount, streak, activeDays, isRead, setRead } = useReadingLog();
  const { newsletters, loading: newslettersLoading } = useNewsletters(NEWSLETTER_POSTS);
  const [activeTopic, setActiveTopic] = useState<string>(ALL);

  const date = feed?.date ?? todayKey();
  const dateLabel = new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const visibleTopics =
    activeTopic === ALL ? OTHER_TOPICS : OTHER_TOPICS.filter((t) => t.id === activeTopic);
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

          <section aria-labelledby="general-heading">
            <h2 id="general-heading" className="mb-4 text-2xl font-semibold text-[var(--fg)]">
              Today&apos;s general knowledge
            </h2>
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
          </section>

          <section aria-labelledby="papers-heading">
            <h2 id="papers-heading" className="text-2xl font-semibold text-[var(--fg)]">
              Research papers
            </h2>
            <p className="mb-6 text-sm text-[var(--muted)]">
              What the AI community is upvoting today, plus new computer-science papers on arXiv
              from the last {PAPER_WINDOW_DAYS} days.
            </p>

            <div className="space-y-8">
              <PaperGroup
                title="Trending in AI"
                subtitle="Hugging Face Daily Papers"
                loading={loading}
                feed={feed?.papers.trending}
                skeletons={TRENDING_AI_PAPERS}
                isRead={isRead}
                setRead={setRead}
              />
              {PAPER_TOPICS.map((topic) => (
                <PaperGroup
                  key={topic.id}
                  title={topic.label}
                  subtitle={`arXiv · "${topic.paperQuery}"`}
                  loading={loading}
                  feed={feed?.papers.byTopic[topic.id]}
                  skeletons={PAPERS_PER_TOPIC}
                  isRead={isRead}
                  setRead={setRead}
                />
              ))}
            </div>
          </section>

          <section aria-labelledby="topics-heading">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="topics-heading" className="text-2xl font-semibold text-[var(--fg)]">
                More topics
              </h2>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
                {[{ id: ALL, label: "All" }, ...OTHER_TOPICS].map((topic) => {
                  const selected = activeTopic === topic.id;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setActiveTopic(topic.id)}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-[var(--border)] text-[var(--muted)] hover:border-primary hover:text-primary"
                      }`}
                    >
                      {topic.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-10">
              {visibleTopics.map((topic) => {
                return (
                  <section key={topic.id} aria-labelledby={`topic-${topic.id}`}>
                    <h3 id={`topic-${topic.id}`} className="text-xl font-semibold text-[var(--fg)]">
                      {topic.label}
                    </h3>
                    <p className="mb-4 text-sm text-[var(--muted)]">{topic.description}</p>

                    <TopicArticles
                      topic={topic}
                      loading={loading}
                      feed={feed?.topics[topic.id]}
                      hasClassic={false}
                      isRead={isRead}
                      setRead={setRead}
                    />
                  </section>
                );
              })}
            </div>
          </section>

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
