"use client";

import { startTransition, useEffect, useState } from "react";
import { PROJECTS } from "@/data/projects";
import type { PortfolioProject } from "@/lib/projects";

function getInitialProjects(limit: number): PortfolioProject[] {
  return PROJECTS.slice(0, limit);
}

export function useGithubProjects(limit: number) {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => getInitialProjects(limit));

  useEffect(() => {
    let cancelled = false;

    const loadProjects = async () => {
      try {
        const response = await fetch(`/api/projects?limit=${limit}`);

        if (!response.ok) {
          throw new Error(`Project request failed with status ${response.status}`);
        }

        const data = (await response.json()) as { projects?: PortfolioProject[] };

        if (!cancelled && data.projects?.length) {
          startTransition(() => {
            setProjects(data.projects!);
          });
        }
      } catch {
        if (!cancelled) {
          startTransition(() => {
            setProjects(getInitialProjects(limit));
          });
        }
      }
    };

    void loadProjects();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return projects;
}
