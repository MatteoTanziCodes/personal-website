"use client";

import { useIsClient } from "@/lib/useIsClient";

export default function ThemeClientReady({ children }: { children: React.ReactNode }) {
  const mounted = useIsClient();

  if (!mounted) return null;
  return <>{children}</>;
}
