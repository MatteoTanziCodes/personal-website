// src/components/about/Current.tsx
"use client";

import { motion } from "framer-motion";

export default function Current() {
  return (
    <section
      id="current"
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center px-8 py-12"
    >
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-6 self-start"
      >
        What I’m Doing Now
      </motion.h2>

      {/* Content columns */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-sm text-[var(--muted)]">
        {/* Personally */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Personally</h3>
          <p>
            Weightlifting, coaching basketball, and on a mission to shed a few pounds
            (and keep them off).
          </p>
        </div>

        {/* Research */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Research</h3>
          <p>
            Planning to pursue a Master’s with a focus on AI and Computer Vision—
            exploring how machine learning can make real‑world systems smarter.
          </p>
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--fg)] mb-2">Projects</h3>
          <p>
            Currently building Ambassador Boost, an entrepreneurial platform empowering creators to launch and scale ideas.
          </p>
        </div>
      </div>
    </section>
  );
}
