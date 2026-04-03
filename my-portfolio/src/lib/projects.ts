import { PROJECTS } from "@/data/projects";

const DEFAULT_GITHUB_USERNAME = "MatteoTanziCodes";
const DEFAULT_DESCRIPTION = "No repository description provided.";
const GITHUB_API_BASE_URL = "https://api.github.com";
const MAX_PUSH_EVENT_PAGES = 3;
const GITHUB_CACHE_SECONDS = 60 * 60;

export interface PortfolioProject {
  year: number;
  title: string;
  description: string;
  builtWith: string[];
  github: string;
}

interface GitHubPushEvent {
  type: string;
  created_at: string;
  repo?: {
    name?: string;
  };
}

interface GitHubRepository {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  disabled?: boolean;
  pushed_at: string;
}

function getGitHubUsername() {
  return process.env.GITHUB_USERNAME || DEFAULT_GITHUB_USERNAME;
}

function getGitHubHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;

  return {
    Accept: "application/vnd.github+json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGitHubJson<T>(path: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${path}`, {
    headers: getGitHubHeaders(),
    next: { revalidate: GITHUB_CACHE_SECONDS },
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function toProject(repo: GitHubRepository): PortfolioProject {
  const builtWith = Array.from(
    new Set([...(repo.topics ?? []), repo.language].filter(Boolean) as string[])
  ).slice(0, 5);

  return {
    year: new Date(repo.pushed_at).getUTCFullYear(),
    title: repo.name,
    description: repo.description?.trim() || DEFAULT_DESCRIPTION,
    builtWith,
    github: repo.html_url,
  };
}

function getFallbackProjects(limit: number): PortfolioProject[] {
  return PROJECTS.slice(0, limit);
}

async function getRecentPushRepoNames(username: string, limit: number) {
  const repoNames: string[] = [];
  const seenRepos = new Set<string>();

  for (let page = 1; page <= MAX_PUSH_EVENT_PAGES; page += 1) {
    const events = await fetchGitHubJson<GitHubPushEvent[]>(
      `/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`
    );

    if (!events.length) {
      break;
    }

    for (const event of events) {
      if (event.type !== "PushEvent" || !event.repo?.name) {
        continue;
      }

      if (seenRepos.has(event.repo.name)) {
        continue;
      }

      seenRepos.add(event.repo.name);
      repoNames.push(event.repo.name);

      if (repoNames.length >= limit) {
        return repoNames;
      }
    }
  }

  return repoNames;
}

async function getRepositoriesByName(repoNames: string[]) {
  const repos = await Promise.all(
    repoNames.map(async (repoName) => {
      try {
        const [owner, name] = repoName.split("/");

        if (!owner || !name) {
          return null;
        }

        return await fetchGitHubJson<GitHubRepository>(
          `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
        );
      } catch {
        return null;
      }
    })
  );

  return repos.filter((repo): repo is GitHubRepository => {
    if (!repo) {
      return false;
    }

    return !repo.fork && !repo.archived && !repo.disabled;
  });
}

async function getFallbackRepositories(username: string) {
  const repos = await fetchGitHubJson<GitHubRepository[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&direction=desc&type=owner`
  );

  return repos.filter((repo) => !repo.fork && !repo.archived && !repo.disabled);
}

export async function getRecentProjects(limit: number): Promise<PortfolioProject[]> {
  const safeLimit = Math.max(1, Math.min(limit, 10));
  const username = getGitHubUsername();

  try {
    const repoNames = await getRecentPushRepoNames(username, safeLimit);
    const recentRepos = await getRepositoriesByName(repoNames);

    if (recentRepos.length >= safeLimit) {
      return recentRepos.slice(0, safeLimit).map(toProject);
    }

    const fallbackRepos = await getFallbackRepositories(username);
    const includedRepos = new Set(recentRepos.map((repo) => repo.full_name));
    const combinedRepos = [...recentRepos];

    for (const repo of fallbackRepos) {
      if (includedRepos.has(repo.full_name)) {
        continue;
      }

      includedRepos.add(repo.full_name);
      combinedRepos.push(repo);

      if (combinedRepos.length >= safeLimit) {
        break;
      }
    }

    return combinedRepos.slice(0, safeLimit).map(toProject);
  } catch {
    return getFallbackProjects(safeLimit);
  }
}
