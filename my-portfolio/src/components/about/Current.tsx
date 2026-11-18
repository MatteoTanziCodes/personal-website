// src/components/about/Current.tsx
"use client";

import Link from "next/link";
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
          <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8 text-left text-sm text-[var(--muted)]">
            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Work</h3>
              <p>
                Senior Product Engineer at{" "}
                <a href="https://www.endodeals.com" target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] hover:text-primary">
                  Endo
                </a>{" "}
                (since September 2026), building the software behind modern sports agencies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Personally</h3>
              <p>
                Weightlifting, coaching basketball, and on a mission to shed a few pounds
                (and keep them off).
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Product</h3>
              <p>
                Growing from engineer into product leader: learning discovery, strategy, and
                prioritization on the way to becoming a Head of Product.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Projects</h3>
              <p>
                Nothing in active development right now, but I have a few ideas I may start
                building soon. In the meantime, check out my{" "}
                <Link href="/projects" className="text-[var(--fg)] hover:text-primary underline">
                  past projects
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </AnimatedWrapper>
    </section>
  );
}
