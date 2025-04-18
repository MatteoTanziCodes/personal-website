"use client";

import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function Speaking() {
  return (
    <section
      id="interviews"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-8"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8 text-center">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">
            Interviews & Speaking
          </h2>
          <p className="text-[var(--muted)] text-center max-w-xl mx-auto">
            Talks, guest appearances, or podcast interviews will be listed here (Hopefully Soon!).
          </p>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
