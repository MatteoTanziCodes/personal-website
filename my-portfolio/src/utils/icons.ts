// src/utils/icons.ts
"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { createElement } from "react";

// Import Iconify dynamically to avoid SSR issues
const Iconify = dynamic(() => import("@iconify/react").then((mod) => mod.Icon), {
  ssr: false,
  loading: () => createElement("span", { 
    className: "w-[1em] h-[1em] inline-block" 
  }),
});

export const iconMap = {
  // Existing icons
  rest: "mdi:api",
  filebeat: "mdi:file-chart",
  apachekafka: "simple-icons:apachekafka",
  soapui: "mdi:test-tube",
  jira: "logos:jira",
  confluence: "logos:confluence",
  java: "logos:java",
  bash: "mdi:bash",
  github: "simple-icons:github",
  moon: "lucide:moon",
  sun: "lucide:sun",
  user: "lucide:user",
  briefcase: "lucide:briefcase",
  book: "lucide:book-open",
  plane: "lucide:plane-takeoff",
  globe: "lucide:globe",

  // Add all tool icons
  python: "simple-icons:python",
  javascript: "simple-icons:javascript",
  typescript: "simple-icons:typescript",
  html5: "simple-icons:html5",
  perl: "simple-icons:perl",
  yaml: "simple-icons:yaml",
  mysql: "simple-icons:mysql",
  angular: "simple-icons:angular",
  nextdotjs: "simple-icons:nextdotjs",
  springboot: "simple-icons:springboot",
  nodedotjs: "simple-icons:nodedotjs",
  express: "simple-icons:express",
  visualstudiocode: "simple-icons:visualstudiocode",
  git: "simple-icons:git",
  ansible: "simple-icons:ansible",
  amazonaws: "simple-icons:amazonaws",
  elastic: "simple-icons:elastic",
  kibana: "simple-icons:kibana",
  docker: "simple-icons:docker",

  linkedin: "simple-icons:linkedin",
  mail: "lucide:mail",
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<ComponentProps<typeof Iconify>, 'icon'> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, className = "text-[var(--fg)]", ...props }: IconProps) {
  return createElement(Iconify, {
    icon: iconMap[name],
    width: size,
    height: size,
    className,
    ...props
  });
}
