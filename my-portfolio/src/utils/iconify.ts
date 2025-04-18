"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { createElement } from "react";
import { iconMap, type IconName } from "./icons";

// Import Iconify dynamically to avoid SSR issues
const Iconify = dynamic(() => import("@iconify/react").then((mod) => mod.Icon), {
  ssr: false,
  loading: () => createElement("span", { 
    className: "w-[1em] h-[1em] inline-block" 
  }),
});

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

export type { IconProps };