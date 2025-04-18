// src/components/about/Current.tsx
"use client";

import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function Current() {
  return (
    <section
      id="current"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-8"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">What I&apos;m Currently Doing</h2>
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-sm text-[var(--muted)]">
            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Personally</h3>
              <p>
                Weightlifting, coaching basketball, and on a mission to shed a few pounds
                (and keep them off).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Research</h3>
              <p>
                Planning to pursue a Master’s with a focus on AI and Computer Vision—
                exploring how machine learning can make real‑world systems smarter.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Projects</h3>
              <p>
                Currently building Ambassador Boost, an entrepreneurial platform empowering creators to launch and scale ideas.
              </p>
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
