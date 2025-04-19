"use client";

import { GitHubIcon } from "@/components/icons";
import { RESEARCH } from "@/data/research";
import ThemeClientReady from "@/components/ThemeClientReady";
import StaggerReveal from "@/components/StaggerReveal";
import { motion } from "framer-motion";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";

export default function ResearchPage() {
  return (
    <ThemeClientReady>
      <PageWrapper>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-10 text-[var(--fg)]"
        >
          Research
        </motion.h1>

        <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RESEARCH.map((proj, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="border border-[var(--border)] rounded-lg p-4 shadow-sm bg-[var(--card)]"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[var(--muted)]">{proj.year}</span>
                <Link
                  href={proj.github}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-sm text-primary"
                >
                  <GitHubIcon size={14} />
                  Source
                </Link>
              </div>

              <h3 className="text-lg font-semibold text-[var(--fg)] mb-1">{proj.title}</h3>
              <p className="text-sm text-[var(--muted)]">{proj.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {proj.builtWith.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-md text-[var(--fg)] bg-[var(--card)] border border-[var(--border)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </StaggerReveal>
      </PageWrapper>
    </ThemeClientReady>
  );
}
