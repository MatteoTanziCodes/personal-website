// Fetches the newest arXiv computer-science papers for each topic with a `paperQuery`
// in src/data/learning.ts and writes them to public/papers.json, which /learning
// loads at runtime.
//
// Runs before `npm run dev` and `npm run build`; the daily rebuild
// (.github/workflows/daily-rebuild.yml) keeps it fresh. arXiv's API doesn't allow
// browser requests, and OpenAlex rate-limits anonymous browser searches, so this
// happens at build time instead.
//
// It never fails the build: a topic that can't be fetched keeps its papers from the
// previous output, and if nothing can be fetched the previous file is kept.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_PATH = join(root, "public", "papers.json");
const ARXIV_API = "https://export.arxiv.org/api/query";
const TIMEOUT_MS = 20_000;
// arXiv asks API clients to wait 3 seconds between requests.
const REQUEST_GAP_MS = 3_100;
// Fetch extra so filtering to CS primary categories and the date window still fills the quota.
const CANDIDATES_PER_TOPIC = 15;

const CATEGORY_NAMES = {
  "cs.AI": "Artificial Intelligence",
  "cs.AR": "Hardware Architecture",
  "cs.CL": "Computation and Language",
  "cs.CR": "Cryptography and Security",
  "cs.CV": "Computer Vision",
  "cs.CY": "Computers and Society",
  "cs.DB": "Databases",
  "cs.DC": "Distributed Computing",
  "cs.DS": "Data Structures and Algorithms",
  "cs.HC": "Human-Computer Interaction",
  "cs.ET": "Emerging Technologies",
  "cs.GT": "Game Theory",
  "cs.IR": "Information Retrieval",
  "cs.IT": "Information Theory",
  "cs.LG": "Machine Learning",
  "cs.MA": "Multiagent Systems",
  "cs.MM": "Multimedia",
  "cs.NE": "Neural and Evolutionary Computing",
  "cs.NI": "Networking",
  "cs.OS": "Operating Systems",
  "cs.PF": "Performance",
  "cs.PL": "Programming Languages",
  "cs.RO": "Robotics",
  "cs.SE": "Software Engineering",
  "cs.SI": "Social and Information Networks",
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function clean(text) {
  return String(text ?? "").replace(/\s+/g, " ").trim();
}

function clip(text, max = 280) {
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}

function formatAuthors(names) {
  if (names.length <= 2) return names.join(" & ");
  return `${names[0]} et al.`;
}

function toPaper(entry) {
  // <id> looks like http://arxiv.org/abs/2611.20858v1; drop the version suffix.
  const arxivId = clean(entry.id).match(/abs\/(.+?)(v\d+)?$/)?.[1];
  const category = entry["arxiv:primary_category"]?.["@_term"] ?? "";
  const authors = [].concat(entry.author ?? []).map((a) => clean(a.name));
  if (!arxivId) return null;
  return {
    id: `arxiv:${arxivId}`,
    title: clean(entry.title),
    authors: formatAuthors(authors),
    summary: clip(clean(entry.summary)),
    url: `https://arxiv.org/abs/${arxivId}`,
    pdfUrl: `https://arxiv.org/pdf/${arxivId}`,
    publishedAt: clean(entry.published).slice(0, 10),
    source: "arXiv",
    meta: CATEGORY_NAMES[category] ?? category,
    category,
  };
}

async function fetchTopicPapers(query, { perTopic, cutoff }) {
  const params = new URLSearchParams({
    search_query: `cat:cs.* AND abs:"${query}"`,
    sortBy: "submittedDate",
    sortOrder: "descending",
    max_results: String(CANDIDATES_PER_TOPIC),
  });
  const response = await fetch(`${ARXIV_API}?${params}`, {
    headers: { "User-Agent": "matteo-tanzi.dev learning feed (build script)" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const doc = parser.parse(await response.text());
  return [].concat(doc.feed?.entry ?? [])
    .map(toPaper)
    .filter((paper) => paper?.title && paper.category.startsWith("cs."))
    .filter((paper) => new Date(paper.publishedAt).getTime() >= cutoff)
    .slice(0, perTopic)
    .map((paper) => {
      delete paper.category;
      return paper;
    });
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(OUTPUT_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  const { LEARNING_TOPICS, PAPERS_PER_TOPIC, PAPER_WINDOW_DAYS } = await import(
    "../src/data/learning.ts"
  );
  const topics = LEARNING_TOPICS.filter((topic) => topic.paperQuery);
  const options = {
    perTopic: PAPERS_PER_TOPIC,
    cutoff: Date.now() - PAPER_WINDOW_DAYS * 86_400_000,
  };
  const previous = await readPrevious();

  const byTopic = {};
  let fetched = 0;
  for (const [i, topic] of topics.entries()) {
    if (i > 0) await sleep(REQUEST_GAP_MS);
    let papers = null;
    for (let attempt = 1; attempt <= 2 && !papers; attempt++) {
      try {
        papers = await fetchTopicPapers(topic.paperQuery, options);
      } catch (error) {
        console.warn(`[papers] ${topic.label} (attempt ${attempt}): ${error.message}`);
        if (attempt === 1) await sleep(REQUEST_GAP_MS * 2);
      }
    }
    if (papers) {
      fetched++;
      byTopic[topic.id] = papers;
      console.log(`[papers] ${topic.label}: ${papers.length} paper(s)`);
    } else if (previous?.byTopic?.[topic.id]) {
      byTopic[topic.id] = previous.byTopic[topic.id];
      console.warn(`[papers] ${topic.label}: keeping previous papers`);
    }
  }

  if (!fetched && previous) {
    console.warn("[papers] Nothing fetched; keeping the previous public/papers.json");
    return;
  }

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), byTopic }, null, 2) + "\n"
  );
  console.log(`[papers] Wrote ${fetched}/${topics.length} topic(s) to public/papers.json`);
}

main().catch((error) => {
  console.warn(`[papers] Skipped: ${error.message}`);
});
