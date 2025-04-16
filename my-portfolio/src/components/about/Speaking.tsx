"use client";

import { motion } from "framer-motion";

export default function Speaking() {
  return (
    <section
      id="interviews"
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-8 py-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-4"
      >
        Interviews & Speaking
      </motion.h2>
      <p className="text-[var(--muted)] text-center max-w-xl">
        Talks, guest appearances, or podcast interviews will be listed here (Hopefully Soon!).
      </p>
    </section>
  );
}
