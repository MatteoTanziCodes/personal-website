"use client";

import { GitHubIcon, MailIcon, LinkedInIcon } from "@/components/icons";
import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-8"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">Contact</h2>
          <div className="w-full max-w-3xl space-y-6 text-left text-[var(--fg)] text-2xl leading-relaxed">
            {/* Email */}
            <div className="flex items-center gap-4">
              <MailIcon size={20} />
              <span>matteotanzibusiness@gmail.com</span>
            </div>

            {/* GitHub */}
            <div className="flex items-center gap-4">
              <GitHubIcon size={20} />
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
              <LinkedInIcon size={20} />
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
        </div>
      </AnimatedWrapper>
    </section>
  );
}
