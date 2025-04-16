"use client";

import { Icon } from "@iconify/react";

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

const ICON_OVERRIDES: Record<string, string> = {
  rest: "mdi:api",
  filebeat: "mdi:file-chart",
  apachekafka: "simple-icons:apachekafka",
  soapui: "mdi:test-tube",   
  jira: "logos:jira",
  confluence: "logos:confluence",
  java: "logos:java",
  bash: "mdi:bash",
};

export default function Tools() {
  return (
    <section
      id="tools"
      className="scroll-section snap-start min-h-[calc(100vh-8rem)] flex flex-col justify-start pt-24 px-8 pb-10"
    >
      <h2 className="text-3xl font-bold text-[var(--fg)] mb-4">Tools</h2>

      {Object.entries(TOOL_CATEGORIES).map(([category, slugs]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">
            {category}
          </h3>
          <div className="flex flex-wrap gap-4">
            {slugs.map((slug) => {
              const iconKey = ICON_OVERRIDES[slug] || `simple-icons:${slug}`;
              return (
                <div
                  key={slug}
                  className="flex flex-col items-center gap-1 w-14"
                >
                  <Icon
                    icon={iconKey}
                    width={20}
                    height={20}
                    className="text-[var(--fg)]"
                  />
                  <span className="text-center text-xs text-[var(--muted)] break-all">
                    {slug.replace(/[-.]/g, " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
