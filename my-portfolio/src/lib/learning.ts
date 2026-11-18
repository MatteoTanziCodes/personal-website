import {
  ARTICLES_PER_TOPIC,
  FRESH_WINDOW_DAYS,
  HN_MIN_POINTS,
  LEARNING_TOPICS,
  PAPERS_PER_TOPIC,
  PAPER_WINDOW_DAYS,
  TRENDING_AI_PAPERS,
  type ClassicRead,
  type LearningTopic,
} from "@/data/learning";

/** "Hacker News", "DEV", or a newsletter name. */
export type ArticleSource = string;

export interface LearningArticle {
  id: string;
  title: string;
  url: string;
  source: ArticleSource;
  author?: string;
  publishedAt: string;
  /** Short stat line, e.g. "120 points · 45 comments" or "6 min read". */
  meta?: string;
  /** Optional one- or two-line teaser. */
  summary?: string;
  discussionUrl?: string;
}

export interface TopicFeed {
  articles: LearningArticle[];
  /** Every source for this topic failed. */
  failed: boolean;
  /** Every source for this topic responded. */
  complete: boolean;
}

export interface WikiFeatured {
  title: string;
  description?: string;
  extract: string;
  url: string;
  thumbnail?: string;
}

export interface WikiOnThisDay {
  year: number;
  text: string;
  url?: string;
}

export interface DailyWiki {
  featured?: WikiFeatured;
  onThisDay?: WikiOnThisDay;
  didYouKnow?: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  authors: string;
  summary: string;
  url: string;
  pdfUrl?: string;
  publishedAt: string;
  source: "Hugging Face" | "arXiv";
  /** Extra context, e.g. "84 upvotes" or the arXiv subfield. */
  meta?: string;
}

export interface PaperFeed {
  papers: ResearchPaper[];
  failed: boolean;
}

export interface DailyLearningFeed {
  date: string;
  topics: Record<string, TopicFeed>;
  papers: {
    trending: PaperFeed;
    byTopic: Record<string, PaperFeed>;
  };
  wiki: DailyWiki | null;
}

/** Local calendar date as YYYY-MM-DD; the feed rolls over at the viewer's midnight. */
export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

async function getJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request to ${new URL(url).host} failed with ${response.status}`);
  }
  return (await response.json()) as T;
}

interface HnHit {
  objectID: string;
  title: string | null;
  url: string | null;
  author: string;
  points: number | null;
  num_comments: number | null;
  created_at: string;
}

async function fetchHackerNews(query: string, limit: number): Promise<LearningArticle[]> {
  const since = Math.floor(Date.now() / 1000) - FRESH_WINDOW_DAYS * 86_400;
  const params = new URLSearchParams({
    query,
    tags: "story",
    numericFilters: `created_at_i>${since},points>=${HN_MIN_POINTS}`,
    hitsPerPage: String(limit),
  });
  const data = await getJson<{ hits: HnHit[] }>(
    `https://hn.algolia.com/api/v1/search?${params}`
  );

  return data.hits
    .filter((hit) => hit.title)
    .map((hit) => {
      const discussionUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;
      return {
        id: `hn:${hit.objectID}`,
        title: hit.title as string,
        url: hit.url || discussionUrl,
        source: "Hacker News" as const,
        author: hit.author,
        publishedAt: hit.created_at,
        meta: `${hit.points ?? 0} points · ${hit.num_comments ?? 0} comments`,
        discussionUrl,
      };
    });
}

interface DevArticle {
  id: number;
  title: string;
  url: string;
  published_at: string;
  reading_time_minutes: number;
  user?: { name?: string };
}

// DEV.to rate-limits bursts from one IP, so its requests go out one at a time.
const DEV_SPACING_MS = 300;
const DEV_RETRY_MS = 1500;
let devQueue: Promise<unknown> = Promise.resolve();

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function queueDevRequest<T>(url: string): Promise<T> {
  const run = async () => {
    try {
      return await getJson<T>(url);
    } catch {
      await wait(DEV_RETRY_MS);
      return getJson<T>(url);
    } finally {
      await wait(DEV_SPACING_MS);
    }
  };
  const result = devQueue.then(run, run);
  devQueue = result.catch(() => undefined);
  return result;
}

async function fetchDevTo(tag: string, limit: number): Promise<LearningArticle[]> {
  const params = new URLSearchParams({
    tag,
    top: String(FRESH_WINDOW_DAYS),
    per_page: String(limit),
  });
  const top = await queueDevRequest<DevArticle[]>(`https://dev.to/api/articles?${params}`);
  let data = top;

  // Quiet tag this week? Top up with the newest posts so the topic isn't left empty.
  if (top.length < limit) {
    const latestParams = new URLSearchParams({ tag, per_page: String(limit) });
    const latest = await queueDevRequest<DevArticle[]>(
      `https://dev.to/api/articles/latest?${latestParams}`
    ).catch(() => []);
    const seen = new Set(top.map((a) => a.id));
    data = [...top, ...latest.filter((a) => !seen.has(a.id))].slice(0, limit);
  }

  return data.map((article) => ({
    id: `dev:${article.id}`,
    title: article.title,
    url: article.url,
    source: "DEV" as const,
    author: article.user?.name,
    publishedAt: article.published_at,
    meta: `${article.reading_time_minutes} min read`,
  }));
}

/** Alternate sources so each topic gets a mix, dropping duplicate links. */
function interleave(lists: LearningArticle[][], limit: number): LearningArticle[] {
  const seen = new Set<string>();
  const result: LearningArticle[] = [];
  const longest = Math.max(0, ...lists.map((list) => list.length));

  for (let i = 0; i < longest && result.length < limit; i += 1) {
    for (const list of lists) {
      const article = list[i];
      if (!article || seen.has(article.url)) continue;
      seen.add(article.url);
      result.push(article);
      if (result.length >= limit) break;
    }
  }

  return result;
}

async function fetchTopic(topic: LearningTopic): Promise<TopicFeed> {
  const limit = topic.articleLimit ?? ARTICLES_PER_TOPIC;
  const requests: Promise<LearningArticle[]>[] = [];
  if (topic.hnQuery) requests.push(fetchHackerNews(topic.hnQuery, limit));
  for (const tag of topic.devtoTags ?? []) requests.push(fetchDevTo(tag, limit));

  const results = await Promise.allSettled(requests);
  const lists = results
    .filter((r): r is PromiseFulfilledResult<LearningArticle[]> => r.status === "fulfilled")
    .map((r) => r.value);

  return {
    articles: interleave(lists, limit),
    failed: lists.length === 0,
    complete: lists.length === results.length,
  };
}

interface WikiPageSummary {
  titles: { normalized: string };
  description?: string;
  extract?: string;
  thumbnail?: { source: string };
  content_urls?: { desktop?: { page?: string } };
}

interface WikiFeedResponse {
  tfa?: WikiPageSummary;
  onthisday?: { year: number; text: string; pages?: WikiPageSummary[] }[];
  dyk?: { text: string }[];
}

/** Picks the same item for everyone on a given day, but a different one each day. */
export function pickForDay<T>(items: T[], date: string): T | undefined {
  if (!items.length) return undefined;
  const seed = Number(date.replaceAll("-", ""));
  return items[seed % items.length];
}

async function fetchWikipedia(date: string): Promise<DailyWiki> {
  const path = date.replaceAll("-", "/");
  const data = await getJson<WikiFeedResponse>(
    `https://en.wikipedia.org/api/rest_v1/feed/featured/${path}`,
    { headers: { "Api-User-Agent": "matteo-tanzi.dev learning feed" } }
  );

  const tfa = data.tfa;
  const event = pickForDay(data.onthisday ?? [], date);
  const fact = pickForDay(data.dyk ?? [], date);

  return {
    featured:
      tfa && tfa.extract
        ? {
            title: tfa.titles.normalized,
            description: tfa.description,
            extract: tfa.extract,
            url:
              tfa.content_urls?.desktop?.page ??
              `https://en.wikipedia.org/wiki/${encodeURIComponent(tfa.titles.normalized)}`,
            thumbnail: tfa.thumbnail?.source,
          }
        : undefined,
    onThisDay: event
      ? {
          year: event.year,
          text: event.text,
          url: event.pages?.[0]?.content_urls?.desktop?.page,
        }
      : undefined,
    didYouKnow: fact?.text,
  };
}

// ---------- Research papers ----------

function formatAuthors(names: string[]): string {
  if (names.length <= 2) return names.join(" & ");
  return `${names[0]} et al.`;
}

function clip(text: string, max = 280): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max).replace(/\s+\S*$/, "")}…` : clean;
}

interface HfDailyPaper {
  title: string;
  publishedAt: string;
  paper: {
    id: string;
    upvotes: number;
    summary: string;
    ai_summary?: string;
    authors: { name: string }[];
  };
}

/** Today's community-upvoted AI papers (all arXiv), from Hugging Face Daily Papers. */
async function fetchTrendingAiPapers(): Promise<ResearchPaper[]> {
  const data = await getJson<HfDailyPaper[]>("https://huggingface.co/api/daily_papers?limit=50");

  return [...data]
    .sort((a, b) => b.paper.upvotes - a.paper.upvotes)
    .slice(0, TRENDING_AI_PAPERS)
    .map(({ title, publishedAt, paper }) => ({
      id: `arxiv:${paper.id}`,
      title,
      authors: formatAuthors(paper.authors.map((a) => a.name)),
      summary: clip(paper.ai_summary || paper.summary),
      url: `https://huggingface.co/papers/${paper.id}`,
      pdfUrl: `https://arxiv.org/pdf/${paper.id}`,
      publishedAt,
      source: "Hugging Face",
      meta: `${paper.upvotes} upvotes`,
    }));
}

// OpenAlex source id for arXiv; restricting to it keeps results to CS preprints.
const OPENALEX_ARXIV_SOURCE = "S4306400194";
const OPENALEX_COMPUTER_SCIENCE_FIELD = "17";

interface OpenAlexWork {
  title: string | null;
  doi: string | null;
  publication_date: string;
  authorships: { author: { display_name: string } }[];
  abstract_inverted_index: Record<string, number[]> | null;
  primary_topic?: { subfield?: { display_name?: string } };
}

/** OpenAlex stores abstracts as word -> positions; rebuild the text. */
function rebuildAbstract(index: Record<string, number[]> | null): string {
  if (!index) return "";
  const words: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) words[pos] = word;
  }
  return words.filter(Boolean).join(" ");
}

async function fetchArxivPapers(query: string): Promise<ResearchPaper[]> {
  const since = new Date(Date.now() - PAPER_WINDOW_DAYS * 86_400_000).toISOString().slice(0, 10);
  const params = new URLSearchParams({
    search: query,
    filter: [
      `primary_topic.field.id:${OPENALEX_COMPUTER_SCIENCE_FIELD}`,
      `primary_location.source.id:${OPENALEX_ARXIV_SOURCE}`,
      `from_publication_date:${since}`,
      "has_abstract:true",
    ].join(","),
    per_page: String(PAPERS_PER_TOPIC),
    select: "title,doi,publication_date,authorships,abstract_inverted_index,primary_topic",
  });
  const data = await getJson<{ results: OpenAlexWork[] }>(`https://api.openalex.org/works?${params}`);

  return data.results.flatMap((work) => {
    const arxivId = work.doi?.match(/arxiv\.(.+)$/i)?.[1];
    if (!work.title || !arxivId) return [];
    return [
      {
        id: `arxiv:${arxivId}`,
        title: work.title,
        authors: formatAuthors(work.authorships.map((a) => a.author.display_name)),
        summary: clip(rebuildAbstract(work.abstract_inverted_index)),
        url: `https://arxiv.org/abs/${arxivId}`,
        pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
        publishedAt: work.publication_date,
        source: "arXiv" as const,
        meta: work.primary_topic?.subfield?.display_name,
      },
    ];
  });
}

async function toPaperFeed(request: Promise<ResearchPaper[]>): Promise<PaperFeed> {
  try {
    return { papers: await request, failed: false };
  } catch {
    return { papers: [], failed: true };
  }
}

// ---------- Daily feed ----------

export async function fetchDailyLearningFeed(date = todayKey()): Promise<DailyLearningFeed> {
  const paperTopics = LEARNING_TOPICS.filter((topic) => topic.paperQuery);

  const [topicFeeds, trending, topicPapers, wiki] = await Promise.all([
    Promise.all(LEARNING_TOPICS.map(fetchTopic)),
    toPaperFeed(fetchTrendingAiPapers()),
    Promise.all(paperTopics.map((topic) => toPaperFeed(fetchArxivPapers(topic.paperQuery!)))),
    fetchWikipedia(date).catch(() => null),
  ]);

  const topics: Record<string, TopicFeed> = {};
  LEARNING_TOPICS.forEach((topic, i) => {
    topics[topic.id] = topicFeeds[i];
  });

  const byTopic: Record<string, PaperFeed> = {};
  paperTopics.forEach((topic, i) => {
    byTopic[topic.id] = topicPapers[i];
  });

  return { date, topics, papers: { trending, byTopic }, wiki };
}

/** Today's rotating evergreen read for a topic, if it has any classics configured. */
export function classicForDay(topic: LearningTopic, date: string): ClassicRead | undefined {
  // Days since epoch, so consecutive days step through the list in order.
  const [y, m, d] = date.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  const list = topic.classics ?? [];
  return list.length ? list[day % list.length] : undefined;
}

export function timeAgo(iso: string, now = Date.now()): string {
  const minutes = Math.max(1, Math.round((now - new Date(iso).getTime()) / 60_000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}
