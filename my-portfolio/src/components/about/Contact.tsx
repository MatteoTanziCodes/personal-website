"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-8 py-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-10 self-start"
      >
        Contact
      </motion.h2>

      <div className="w-full max-w-3xl space-y-6 text-left text-[var(--fg)] text-2xl leading-relaxed">
        {/* Email */}
        <div className="flex items-center gap-4">
          <Mail size={20} />
          <span>matteotanzibusiness@gmail.com</span>
        </div>

        {/* GitHub */}
        <div className="flex items-center gap-4">
          <Github size={20} />
          <a
            href="https://github.com/MatteoTanziCodes"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            github.com/MatteoTanziCodes
          </a>
        </div>

        {/* LinkedIn */}
        <div className="flex items-center gap-4">
          <Linkedin size={20} />
          <a
            href="https://www.linkedin.com/in/matteospencertanzi/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            linkedin.com/in/matteospencertanzi/
          </a>
        </div>
      </div>
    </section>
  );
}
