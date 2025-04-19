"use client";

import { useEffect, useState } from "react";
import { Icon, iconMap } from "@/utils/icons";
import AnimatedWrapper from "@/components/AnimatedWrapper";

const TOOL_CATEGORIES: Record<string, string[]> = {
  "Languages": [
    "python", "javascript", "typescript", "html5", "perl",
    "yaml", "mysql", "bash", "java",
  ],
  "Frameworks": ["angular", "nextdotjs"],
  "Backend / Database / API": [
    "springboot", "nodedotjs", "express", "mysql", "rest",
  ],
  "Developer Tools": [
    "visualstudiocode", "git", "github", "jira", "confluence",
    "ansible", "soapui",
  ],
  "Cloud & Micro‑services": [
    "amazonaws", "elastic", "kibana", "filebeat",
    "apachekafka", "docker", "ansible",
  ],
};

export default function Tools() {
  const [windowWidth, setWindowWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 1024);
  const isCompact = windowWidth <= 735;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Trigger on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="tools"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-4"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">Tools</h2>
          {Object.entries(TOOL_CATEGORIES).map(([category, slugs]) => (
            <div key={category} className={isCompact ? "mb-2" : "mb-6"}>
              <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">{category}</h3>
              <div
                className={`flex flex-wrap ${isCompact ? "gap-2" : "gap-4"} justify-start`}
              >
                {slugs.map((slug) => (
                  <div
                    key={slug}
                    className={`flex flex-col items-center ${
                      isCompact ? "gap-0.5 w-12" : "gap-1 w-16 sm:w-20"
                    }`}
                  >
                    <Icon
                      name={slug as keyof typeof iconMap}
                      size={isCompact ? 16 : 20}
                    />
                    <span
                      className={`text-center text-[var(--muted)] ${
                        isCompact ? "text-[10px]" : "text-xs"
                      } leading-tight break-words`}
                    >
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
