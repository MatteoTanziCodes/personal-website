"use client";

import { ThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const themeProps: ThemeProviderProps = {
    attribute: "class",
    defaultTheme: "system",
    enableSystem: true,
  };

  return <ThemeProvider {...themeProps}>{children}</ThemeProvider>;
}
