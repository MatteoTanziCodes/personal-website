"use client";

import { Icon } from "@/utils/icons";
import AnimatedWrapper from "@/components/AnimatedWrapper";

const TOOL_CATEGORIES: Record<string, string[]> = {
  "Languages": [
    "python",
    "javascript",
    "typescript",
    "html5",
    "perl",
    "yaml",
    "mysql",
    "bash",
    "java",
  ],
  "Frameworks": ["angular", "nextdotjs"],
  "Backend / Database / API": [
    "springboot",
    "nodedotjs",
    "express",
    "mysql",
    "rest",
  ],
  "Developer Tools": [
    "visualstudiocode",
    "git",
    "github",
    "jira",
    "confluence",
    "ansible",
    "soapui",
  ],
  "Cloud & Micro‑services": [
    "amazonaws",
    "elastic",
    "kibana",
    "filebeat",
    "apachekafka",
    "docker",
    "ansible",
  ],
};

export default function Tools() {
  return (
    <section id="tools" className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-8">
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">Tools</h2>
          {Object.entries(TOOL_CATEGORIES).map(([category, slugs]) => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">
                {category}
              </h3>
              <div className="flex flex-wrap gap-4">
                {slugs.map((slug) => (
                  <div
                    key={slug}
                    className="flex flex-col items-center gap-1 w-14"
                  >
                    <Icon
                      name={slug as any} // TODO: Add proper typing for all tool icons
                      size={20}
                    />
                    <span className="text-center text-xs text-[var(--muted)] break-all">
                      {slug.replace(/[-.]/g, " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimatedWrapper>
    </section>
  );
}
