"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerLetter } from "@/lib/framer";

export default function AnimatedText({ text }: { text: string }) {
  return (
    <motion.h1
      className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-right text-[var(--fg)]"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {text.split("").map((char, index) => (
        <motion.span key={index} variants={staggerLetter}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
