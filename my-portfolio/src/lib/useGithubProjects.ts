"use client";

import type { PortfolioProject } from "@/lib/projects";
import { getRecentProjects } from "@/lib/projects";

export function useGithubProjects(limit: number) {
  return getRecentProjects(limit) as PortfolioProject[];
}
