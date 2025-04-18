"use client";

import { GitHubIcon, MailIcon, LinkedInIcon } from "@/components/icons";
import AnimatedWrapper from "@/components/AnimatedWrapper";

export default function Contact() {
  return (
    <section
      id="contact"
      className="scroll-section snap-start min-h-screen flex flex-col justify-center items-center px-4 sm:px-6"
    >
      <AnimatedWrapper>
        <div className="w-full max-w-3xl space-y-8">
          <h2 className="text-4xl font-bold text-[var(--fg)] mb-4">Contact</h2>
          <div className="w-full space-y-6 text-left text-[var(--fg)] text-xl sm:text-2xl leading-relaxed break-words">
            {/* Email */}
            <div className="flex items-start gap-4 break-all">
              <MailIcon size={20} className="mt-1" />
              <span className="break-all">matteotanzibusiness@gmail.com</span>
            </div>

            {/* GitHub */}
            <div className="flex items-start gap-4 break-all">
              <GitHubIcon size={20} className="mt-1" />
              <a
                href="https://github.com/MatteoTanziCodes"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors break-all"
              >
                github.com/MatteoTanziCodes
              </a>
            </div>

            {/* LinkedIn */}
            <div className="flex items-start gap-4 break-all">
              <LinkedInIcon size={20} className="mt-1" />
              <a
                href="https://www.linkedin.com/in/matteospencertanzi/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors break-all"
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
