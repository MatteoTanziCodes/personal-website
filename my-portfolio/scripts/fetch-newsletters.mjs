// Fetches the product newsletter RSS feeds listed in src/data/newsletters.json and
// writes the latest posts to public/newsletters.json, which /learning loads at runtime.
//
// Runs before `npm run dev` and `npm run build`. Newsletter sites block browser
// (cross-origin) requests, so this has to happen at build time; a daily rebuild
// (see .github/workflows/daily-rebuild.yml) keeps it fresh.
//
// It never fails the build: if every feed is unreachable it keeps the previous
// output, or writes an empty list.

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG_PATH = join(root, "src", "data", "newsletters.json");
const OUTPUT_PATH = join(root, "public", "newsletters.json");
const TIMEOUT_MS = 15_000;
// Some feeds (e.g. SVPG) reject requests without a browser-like user agent.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => ENTITIES[name.toLowerCase()] ?? match);
}

function toText(value) {
  if (value == null) return "";
  if (typeof value === "object") return toText(value["#text"] ?? "");
  return decodeEntities(String(value).replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function clip(text, max = 220) {
  return text.length > max ? `${text.slice(0, max).replace(/\s+\S*$/, "")}…` : text;
}

function linkOf(entry) {
  const link = entry.link;
  if (typeof link === "string") return link;
  const links = [].concat(link ?? []);
  const alternate = links.find((l) => !l["@_rel"] || l["@_rel"] === "alternate");
  return alternate?.["@_href"] ?? links[0]?.["@_href"] ?? "";
}

function parseFeed(xml, feed) {
  const doc = parser.parse(xml);
  const rssItems = doc.rss?.channel?.item;
  const atomEntries = doc.feed?.entry;
  const entries = [].concat(rssItems ?? atomEntries ?? []);

  return entries
    .map((entry) => {
      const url = linkOf(entry);
      const published = entry.pubDate ?? entry.published ?? entry.updated ?? entry["dc:date"];
      const author = entry["dc:creator"] ?? entry.author?.name ?? entry.author;
      return {
        id: `nl:${url}`,
        title: toText(entry.title),
        url,
        source: feed.name,
        author: toText(author) || undefined,
        publishedAt: published ? new Date(published).toISOString() : undefined,
        summary: clip(toText(entry.description ?? entry.summary ?? entry["content:encoded"] ?? "")),
      };
    })
    .filter((item) => item.title && item.url.startsWith("http") && item.publishedAt);
}

async function fetchFeed(feed) {
  const response = await fetch(feed.url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return parseFeed(await response.text(), feed);
}

async function main() {
  const config = JSON.parse(await readFile(CONFIG_PATH, "utf8"));
  const cutoff = Date.now() - config.maxAgeDays * 86_400_000;

  const results = await Promise.allSettled(config.feeds.map(fetchFeed));
  const items = [];
  results.forEach((result, i) => {
    const feed = config.feeds[i];
    if (result.status === "rejected") {
      console.warn(`[newsletters] ${feed.name}: ${result.reason?.message ?? result.reason}`);
      return;
    }
    const recent = result.value
      .filter((item) => new Date(item.publishedAt).getTime() >= cutoff)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, config.maxPerFeed);
    console.log(`[newsletters] ${feed.name}: ${recent.length} recent post(s)`);
    items.push(...recent);
  });

  if (!items.length) {
    try {
      await readFile(OUTPUT_PATH);
      console.warn("[newsletters] No posts fetched; keeping the previous public/newsletters.json");
      return;
    } catch {
      // No previous output either; fall through and write an empty list.
    }
  }

  items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(
    OUTPUT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), items }, null, 2) + "\n"
  );
  console.log(`[newsletters] Wrote ${items.length} posts to public/newsletters.json`);
}

main().catch((error) => {
  console.warn(`[newsletters] Skipped: ${error.message}`);
});
