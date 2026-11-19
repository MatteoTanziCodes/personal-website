# Matteo Tanzi — Personal Site

Source for [matteo-tanzi.dev](https://www.matteo-tanzi.dev), the personal site of Matteo Tanzi, Senior Product Engineer at [Endo](https://www.endodeals.com) (previously BMO), working toward becoming a Head of Product.

The site covers my projects, research, work history, and a travel archive, plus a **daily learning feed** centred on product management and leadership, with fresh articles, new computer-science papers, and something outside tech every day.

## Stack

| Layer | Tool |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org/) (App Router, static export) |
| UI | [React 19](https://react.dev/), TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) with CSS-variable light/dark theme via [`next-themes`](https://github.com/pacocoursey/next-themes) |
| Animation | [Framer Motion](https://motion.dev/) |
| Icons | [Iconify](https://iconify.design/), [Lucide](https://lucide.dev/) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com/) (project `matteo-tanzi-portfolio`) |

## Pages

| Route | What it shows |
| --- | --- |
| `/` | Intro, contact links, today's learning picks, latest projects, latest research, trip years |
| `/about` | Snap-scrolling sections: about, contact, work timeline, current focus, tools, speaking |
| `/projects` | Most recently pushed public GitHub repos (live from the GitHub API, cached in `localStorage` for 1 hour, falling back to `src/data/projects.ts`) |
| `/research` | Past research projects from `src/data/research.ts` (not linked in the nav) |
| `/learning` | Daily learning feed in one "Today's knowledge" panel with a toggle between the Product Management focus (highlighted and shown by default: a daily classic essay, product newsletter posts, community articles, UX papers), general knowledge (Wikipedia's featured article, "on this day", "did you know", and a daily vocabulary quiz with intermediate and hard words), research papers (trending AI papers, new arXiv papers per topic) and fresh articles for the other topics, with topic filters for papers and articles, with a per-visitor reading goal and streak |
| `/trips` | Photo archive grouped by year, with tilt-on-hover (desktop) and tilt-on-motion (mobile) cards |
| `/resume` | Resume summary and PDF download |

## Daily learning feed

The site is a static export with no backend, so most of `/learning` is fetched in the visitor's browser from public APIs that allow cross-origin requests:

| Source | Used for |
| --- | --- |
| [Hacker News Search (Algolia)](https://hn.algolia.com/api) | Recent stories per topic above a points threshold |
| [DEV.to API](https://developers.forem.com/api) | Top articles per tag, e.g. `product`, `productmanagement`, `leadership` (requests are spaced out to stay under DEV's rate limit) |
| [Hugging Face Daily Papers](https://huggingface.co/papers) | Trending AI/ML papers, ranked by community upvotes |
| [Wikimedia feed API](https://api.wikimedia.org/wiki/Feed_API) | Featured article, "on this day", "did you know" |

**These live sources update themselves every day; nothing needs to be rebuilt or redeployed for them.** Each visitor's browser fetches the feed live and caches it in `localStorage` until their local midnight, then fetches a new one. A feed with a failed source isn't cached, so it retries on the next visit, and editing the topic config invalidates any cached feed. If a DEV.to tag has no top posts that week, its newest posts fill the gap. Reading progress (reads, daily goal, streak) is stored per browser and never leaves the visitor's device. Logic lives in `src/lib/learning.ts`, `src/lib/useLearningFeed.ts`, and `src/lib/useReadingLog.ts`.

### Newsletters and arXiv papers (refreshed by a daily rebuild)

Two sources can't be fetched from the browser, so they're fetched at **build time** instead and served as static JSON:

| Source | Script | Output | Why build time |
| --- | --- | --- | --- |
| Product newsletters (Lenny's Newsletter, SVPG, First Round Review, The Beautiful Mess, The Product Compass, Product Growth, Elena's Growth Scoop, The Looking Glass), listed in `src/data/newsletters.json` | `scripts/fetch-newsletters.mjs` | `public/newsletters.json` | RSS feeds block browser requests |
| [arXiv API](https://info.arxiv.org/help/api/): newest computer-science papers per topic (`paperQuery` in `src/data/learning.ts`) from the last 14 days | `scripts/fetch-papers.mjs` | `public/papers.json` | arXiv blocks browser requests, and OpenAlex (the browser-friendly alternative) rate-limits anonymous searches |

1. Both scripts run automatically before `npm run dev` and `npm run build` (or together with `npm run fetch:content`). Outputs are gitignored. Neither script can fail the build: anything that can't be fetched keeps its previous output.
2. `/learning` and the homepage card load the JSON files from the site itself.
3. `.github/workflows/daily-rebuild.yml` triggers a Cloudflare Pages rebuild every day at 10:00 UTC, so posts and papers stay current.

`fetch-papers.mjs` imports the typed topic config directly, which needs Node 22.18 or later; `my-portfolio/.node-version` pins Cloudflare's build to Node 24.

**One-time setup for the daily rebuild:**

1. In the Cloudflare dashboard, open **Workers & Pages → matteo-tanzi-portfolio → Settings → Builds → Deploy hooks**, and add a hook for the `main` branch. Copy its URL.
2. In GitHub, open the repo → **Settings → Secrets and variables → Actions**, and add the hook URL as a secret named `CLOUDFLARE_DEPLOY_HOOK_URL`.
3. Test it from the repo's **Actions** tab: **Daily rebuild → Run workflow**.

GitHub pauses scheduled workflows after 60 days without repository activity. If posts stop updating, re-enable the workflow from the Actions tab.

To add or remove a newsletter, edit `src/data/newsletters.json`. Any RSS or Atom feed works.

## Project structure

```text
personal-website/
├── .github/workflows/          # daily-rebuild.yml (refreshes newsletter posts)
└── my-portfolio/               # the Next.js app
    ├── scripts/                # fetch-newsletters.mjs, fetch-papers.mjs (run before dev/build)
    ├── public/
    │   ├── assets/             # favicon, OG image
    │   ├── fonts/              # Satoshi
    │   ├── images/trips/       # travel photos
    │   └── Matteo_Tanzi_Resume_2026.pdf
    └── src/
        ├── app/                # routes (one folder per page) + globals.css
        ├── components/         # shared UI; about/ and homepage/ hold page-specific pieces
        ├── data/               # editable content: projects, research, trips, learning topics, newsletters
        ├── lib/                # GitHub fetching, site constants, hooks
        ├── styles/             # theme variables, fonts, scrollbar
        └── utils/              # icon helpers
```

## Editing content

Most content lives in plain TypeScript files, so no code changes are needed to update it:

- **Projects fallback:** `src/data/projects.ts` (shown if the GitHub API is unavailable)
- **Research:** `src/data/research.ts`
- **Learning topics:** `src/data/learning.ts`. Each topic has a label plus any of: a Hacker News search query, one or more DEV.to tags, an arXiv `paperQuery`, and a hand-picked `classics` list (one rotates in each day, so the topic is never empty). `FOCUS_TOPIC_ID` (currently Product Management) picks the topic featured at the top of `/learning` and first on the homepage card. The same file sets articles and papers per topic, the freshness windows, and the daily reading goal.
- **Vocabulary words:** `src/data/vocabulary.ts`. Two lists (intermediate and hard) with a part of speech, definition and example sentence per word. Each day shows `WORDS_PER_LEVEL` words from each list in order, so adding words lengthens the cycle before repeats. Quiz answers are kept per browser in `localStorage`.
- **Trips:** `src/data/trips.ts`, with photos in `public/images/trips/`. Use `.jpg`/`.jpeg`; `.heic` only renders in Safari.
- **Resume PDF:** replace the file in `public/` and update `RESUME_PDF_PATH` in `src/lib/site.ts`
- **Theme colours:** CSS variables in `src/styles/theme.css`, exposed to Tailwind (`text-primary`, `text-muted`, ...) through the `@theme` block in `src/app/globals.css`

## Development

Requires Node.js 22.18 or later (developed on Node 24; `.node-version` pins 24).

```bash
git clone https://github.com/MatteoTanziCodes/personal-website.git
cd personal-website/my-portfolio
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Fetch newsletters and papers, then start the dev server (webpack) |
| `npm run dev:turbopack` | Dev server (Turbopack) |
| `npm run build` | Fetch newsletters and papers, then static export to `out/` |
| `npm run fetch:content` | Refresh `public/newsletters.json` and `public/papers.json` (or one at a time with `fetch:newsletters` / `fetch:papers`) |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |

## Deployment

`next.config.ts` sets `output: "export"`, so the site builds to static HTML in `my-portfolio/out/`. Cloudflare Pages builds and deploys `main` automatically through its GitHub integration (project `matteo-tanzi-portfolio`), and creates preview deployments for other branches.

Cloudflare Pages build settings:

| Setting | Value |
| --- | --- |
| Root directory | `my-portfolio` |
| Build command | `npm run build` (must be the npm script, not `next build`, so the newsletter and paper fetches run first) |
| Build output directory | `out` |

For visitor analytics, turn on Cloudflare Web Analytics for the Pages project (**Metrics → Web Analytics**). It needs no code changes.

## Contact

- Email: [matteotanzibusiness@gmail.com](mailto:matteotanzibusiness@gmail.com)
- LinkedIn: [matteospencertanzi](https://www.linkedin.com/in/matteospencertanzi/)
- GitHub: [MatteoTanziCodes](https://github.com/MatteoTanziCodes)

## License

MIT © Matteo Tanzi
