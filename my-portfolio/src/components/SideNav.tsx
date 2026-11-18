"use client";

import {
  UserIcon,
  BriefcaseIcon,
  BookIcon,
  PlaneIcon,
  GlobeIcon,
} from "@/components/icons";
import Link from "next/link";
import { Lightbulb as LightbulbIcon } from "lucide-react";
import { useState } from "react";
import { MatrixTransitionText } from "./MatrixTransitionText";
import AnimatedSlideInWrapper from "./AnimatedSlideInWrapper";
import { RESUME_PDF_PATH } from "@/lib/site";

const roles = [
  "Tae",
  "Matteo Tanzi",
  "Product Engineer",
  "Future Head of Product",
  "Full-stack Dev",
  "AWS Builder",
  "Creative Thinker"
];

export default function SideNav() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [pendingNext, setPendingNext] = useState(false);

  const handleDone = () => {
    if (!pendingNext) {
      setPendingNext(true);
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % roles.length);
        setPendingNext(false);
      }, 1200);
    }
  };

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 z-40 bg-[var(--bg)] border-r border-[var(--border)] text-base">
      <div className="flex flex-col w-full h-full overflow-y-auto px-6 py-8 custom-scrollbar">
      <AnimatedSlideInWrapper className="flex flex-col">
        {/* Animated Header */}
        <div className="mb-6 font-semibold text-[var(--fg)] text-lg min-h-[1.5rem]">
          
        </div>

        {/* About Me */}
        <div className="mb-6">
          <h3 className="font-semibold text-[var(--fg)] text-lg mb-2">
          <MatrixTransitionText text={roles[roleIndex]} onDone={handleDone} />
          </h3>
          <p className="text-[var(--muted)] leading-relaxed text-base">
            I enjoy weight lifting, travelling, basketball (playing and coaching),
            and spending time with people I care about.
            <br /><br />
            I&apos;m currently improving my health habits, learning to network, completing certifications, and growing as a product engineer through{" "}
            <a href="/projects" className="hover:text-primary">projects</a>, a daily{" "}
            <a href="/learning" className="hover:text-primary">learning</a> habit, and LeetCode.
            <br /><br />
            In the future, I’d love to lead product as a Head of Product and eventually become an entrepreneur (check out my <a href="/projects" className="hover:text-primary">projects</a>),
            learn another language, and pick up the guitar.
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-[var(--fg)] text-lg mb-3">Navigation</h4>
            <ul className="flex flex-col gap-2 text-[var(--muted)] text-base">
              <li><a href="/about" className="hover:text-primary flex items-center gap-2"><UserIcon /> About</a></li>
              <li><a href="/projects" className="hover:text-primary flex items-center gap-2"><BriefcaseIcon /> Projects</a></li>
              <li><a href="/research" className="hover:text-primary flex items-center gap-2"><BookIcon /> Research</a></li>
              <li><a href="/learning" className="hover:text-primary flex items-center gap-2"><LightbulbIcon size={16} /> Learning</a></li>
              <li><a href="/trips"className="hover:text-primary flex items-center gap-2"><PlaneIcon /> Trips</a></li>
            </ul>
          </div>

          {/* External Links */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] text-lg mb-3">Links</h4>
            <ul className="flex flex-col gap-2 text-[var(--muted)] text-base">
              <li>
                <Link href="https://github.com/MatteoTanziCodes" className="hover:text-primary flex items-center gap-2" target="_blank">
                  <GlobeIcon /> GitHub
                </Link>
              </li>
              <li>
                <Link href={RESUME_PDF_PATH} className="hover:text-primary flex items-center gap-2" target="_blank">
                  <BookIcon /> Resume
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </AnimatedSlideInWrapper>
      </div>
    </aside>
  );
}
