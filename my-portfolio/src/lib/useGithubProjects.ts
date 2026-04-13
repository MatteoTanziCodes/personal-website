"use client";

import { startTransition, useEffect, useState } from "react";
import type { PortfolioProject } from "@/lib/projects";
import { fetchRecentProjects, getRecentProjects } from "@/lib/projects";

const GITHUB_PROJECTS_CACHE_TTL_MS = 1000 * 60 * 60;
const GITHUB_PROJECTS_CACHE_PREFIX = "github-projects-v1";

interface CachedProjects {
  fetchedAt: number;
  projects: PortfolioProject[];
}

function getCacheKey(limit: number) {
  return `${GITHUB_PROJECTS_CACHE_PREFIX}:${limit}`;
}

function readCachedProjects(limit: number) {
  if (typeof window === "undefined") return null;

  try {
    const rawValue = window.localStorage.getItem(getCacheKey(limit));
    if (!rawValue) {
      return null;
    }

    const parsedValue = JSON.parse(rawValue) as CachedProjects;
    if (!Array.isArray(parsedValue.projects) || typeof parsedValue.fetchedAt !== "number") {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

function writeCachedProjects(limit: number, projects: PortfolioProject[]) {
  if (typeof window === "undefined") return;

  try {
    const payload: CachedProjects = {
      fetchedAt: Date.now(),
      projects,
    };

    window.localStorage.setItem(getCacheKey(limit), JSON.stringify(payload));
  } catch {
    // Ignore localStorage failures and keep the in-memory result.
  }
}

export function useGithubProjects(limit: number) {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => getRecentProjects(limit));

  useEffect(() => {
    let cancelled = false;
    const cachedProjects = readCachedProjects(limit);

    if (cachedProjects?.projects.length) {
      startTransition(() => {
        setProjects(cachedProjects.projects.slice(0, limit));
      });
    }

    if (
      cachedProjects &&
      Date.now() - cachedProjects.fetchedAt < GITHUB_PROJECTS_CACHE_TTL_MS
    ) {
      return () => {
        cancelled = true;
      };
    }

    const loadProjects = async () => {
      const recentProjects = await fetchRecentProjects(limit);

      if (cancelled || !recentProjects.length) {
        return;
      }

      writeCachedProjects(limit, recentProjects);
      startTransition(() => {
        setProjects(recentProjects);
      });
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return projects;
}
