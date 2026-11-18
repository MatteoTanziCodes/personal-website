// Topics that drive the daily learning feed on /learning, in display order.
// Add, remove, or reorder topics here; the page picks them up automatically.
// The first three topics also supply the picks on the homepage card.
//
// - hnQuery:    search terms for Hacker News stories (https://hn.algolia.com)
// - devtoTags:  DEV.to tags, e.g. https://dev.to/t/aws -> "aws" (one request per tag)
// - paperQuery: search terms for new computer-science papers on arXiv (fetched at build time);
//               topics with a paperQuery also appear under "Research papers"
// - classics:   hand-picked evergreen reads; one rotates in each day and never runs out
// - articleLimit: override ARTICLES_PER_TOPIC for this topic
// Every source is optional, but each topic needs at least one.

export interface ClassicRead {
  title: string;
  author: string;
  url: string;
}

export interface LearningTopic {
  id: string;
  label: string;
  description: string;
  hnQuery?: string;
  devtoTags?: string[];
  paperQuery?: string;
  classics?: ClassicRead[];
  articleLimit?: number;
}

/** The topic featured at the top of /learning and first on the homepage card. */
export const FOCUS_TOPIC_ID = "product";

export const LEARNING_TOPICS: LearningTopic[] = [
  {
    id: "product",
    label: "Product Management",
    description: "Discovery, prioritization, pricing, and shipping what users actually need.",
    devtoTags: ["productmanagement", "product", "ux"],
    paperQuery: "user experience",
    articleLimit: 6,
    classics: [
      { title: "Product vs. Feature Teams", author: "Marty Cagan", url: "https://www.svpg.com/product-vs-feature-teams/" },
      { title: "Empowered Product Teams", author: "Marty Cagan", url: "https://www.svpg.com/empowered-product-teams/" },
      { title: "Product Discovery", author: "Marty Cagan", url: "https://www.svpg.com/product-discovery/" },
      { title: "Good Product Manager/Bad Product Manager", author: "Ben Horowitz", url: "https://a16z.com/good-product-manager-bad-product-manager/" },
      { title: "The only thing that matters", author: "Marc Andreessen", url: "https://pmarchive.com/guide_to_startups_part4.html" },
      { title: "How Superhuman Built an Engine to Find Product/Market Fit", author: "Rahul Vohra", url: "https://review.firstround.com/how-superhuman-built-an-engine-to-find-product-market-fit/" },
      { title: "Shape Up", author: "Ryan Singer", url: "https://basecamp.com/shapeup" },
      { title: "RICE: Simple prioritization for product managers", author: "Sean McBride", url: "https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/" },
      { title: "Know Your Customers' \"Jobs to Be Done\"", author: "Clayton Christensen et al.", url: "https://hbr.org/2016/09/know-your-customers-jobs-to-be-done" },
      { title: "Why the Lean Start-Up Changes Everything", author: "Steve Blank", url: "https://hbr.org/2013/05/why-the-lean-start-up-changes-everything" },
      { title: "Do Things that Don't Scale", author: "Paul Graham", url: "https://paulgraham.com/ds.html" },
      { title: "How to Get Startup Ideas", author: "Paul Graham", url: "https://paulgraham.com/startupideas.html" },
      { title: "Startup = Growth", author: "Paul Graham", url: "https://paulgraham.com/growth.html" },
      { title: "The Law of Shitty Clickthroughs", author: "Andrew Chen", url: "https://andrewchen.com/the-law-of-shitty-clickthroughs/" },
      { title: "What is good retention", author: "Lenny Rachitsky", url: "https://www.lennysnewsletter.com/p/what-is-good-retention-issue-29" },
      { title: "The SaaS business model", author: "Stripe Atlas", url: "https://stripe.com/guides/atlas/business-of-saas" },
      { title: "Leadership Principles", author: "Amazon", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles" },
    ],
  },
  {
    id: "leadership",
    label: "Leadership",
    description: "Leading teams and growing into product leadership.",
    hnQuery: "engineering career",
    devtoTags: ["leadership"],
  },
  {
    id: "startups",
    label: "Startups",
    description: "Building products and companies from zero.",
    hnQuery: "startup",
    devtoTags: ["startup"],
  },
  {
    id: "ai",
    label: "AI",
    description: "How AI is changing the products people build.",
    hnQuery: "LLM",
    devtoTags: ["ai"],
    paperQuery: "large language models",
  },
  {
    id: "cloud",
    label: "Cloud & AWS",
    description: "Serverless, infrastructure, and what's new across AWS.",
    hnQuery: "aws",
    devtoTags: ["aws"],
    paperQuery: "cloud computing",
  },
  {
    id: "architecture",
    label: "Software Architecture",
    description: "System design and the trade-offs behind real systems.",
    hnQuery: "system design",
    devtoTags: ["architecture"],
    paperQuery: "software architecture",
  },
  {
    id: "algorithms",
    label: "Algorithms",
    description: "Data structures, algorithms, and interview-style problem solving.",
    hnQuery: "algorithm",
    devtoTags: ["algorithms"],
  },
];

/** How many articles each topic shows per day. */
export const ARTICLES_PER_TOPIC = 4;

/** Only consider articles published within this many days. */
export const FRESH_WINDOW_DAYS = 3;

/** Minimum Hacker News points for a story to be included. */
export const HN_MIN_POINTS = 10;

/** New papers shown per topic under "Research papers". */
export const PAPERS_PER_TOPIC = 2;

/** Only consider papers published within this many days (papers move slower than articles). */
export const PAPER_WINDOW_DAYS = 14;

/** Trending AI papers from Hugging Face Daily Papers, ranked by community upvotes. */
export const TRENDING_AI_PAPERS = 4;

/** Reads per day that count as hitting the daily learning goal. */
export const DAILY_READ_GOAL = 3;
