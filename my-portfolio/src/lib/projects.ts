import { PROJECTS } from "@/data/projects";

export interface PortfolioProject {
  year: number;
  title: string;
  description: string;
  builtWith: string[];
  github: string;
}

export function getRecentProjects(limit: number): PortfolioProject[] {
  const safeLimit = Math.max(1, Math.min(limit, 10));
  return PROJECTS.slice(0, safeLimit);
}
