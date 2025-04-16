"use client";

import { motion } from "framer-motion";

export default function AboutMe() {
  return (
    <section
      id="about-me"
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-8 py-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-4 self-start"
      >
        About Me
      </motion.h2>

      <div className="w-full max-w-3xl space-y-8 text-left text-[var(--muted)]">
        {/* Name & Buttons */}
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-[var(--fg)]">Matteo Tanzi</h3>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 bg-zinc-800 text-green-400 text-sm font-medium px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Toronto, ON
            </span>
            <a
              href="/Matteo_Tanzi_Resume_2025.pdf"
              target="_blank"
              className="border border-[color:var(--fg)] text-[color:var(--fg)] hover:bg-[rgba(99,102,241,0.08)] px-4 py-1.5 rounded text-sm"
            >
              Resume
            </a>
          </div>
        </div>

        {/* Education */}
        <div>
          <h4 className="text-lg font-semibold text-[var(--fg)] mb-2">Education</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="font-semibold text-[var(--fg)]">Western University</p>
              <p>H.BSc, Computer Science</p>
              <p className="text-xs text-[var(--muted)]">2018 – 2022</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-zinc-700 my-6" />

        {/* Certificates */}
        <div>
          <h4 className="text-lg font-semibold text-[var(--fg)] mb-2">Certificates</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <p className="font-semibold text-[var(--fg)]">AWS Developer Associate</p>
              <p className="text-xs text-[var(--muted)]">2023</p>
            </div>
            <div>
              <p className="font-semibold text-[var(--fg)]">AWS Solutions Architect</p>
              <p className="text-xs text-[var(--muted)]">2023</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
