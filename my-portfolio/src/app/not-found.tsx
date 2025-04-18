"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <AnimatedWrapper>
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-6xl font-bold text-[var(--fg)] mb-6"
        >
          404
        </motion.h1>
        <p className="text-[var(--muted)] text-lg mb-8">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="border border-[var(--fg)] px-6 py-2 rounded hover:bg-primary/10 transition-colors text-[var(--fg)]"
        >
          Go Home
        </Link>
      </AnimatedWrapper>
    </section>
  );
}
