"use client";

import {
  BookOpen,
  Briefcase,
  Globe,
  PlaneTakeoff,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { MatrixTransitionText } from "./MatrixTransitionText";

const roles = [
  "Matteo Tanzi",
  "Full-stack Dev",
  "AWS Builder",
  "AI Researcher",
  "Creative Thinker",
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
    <aside className="fixed left-0 top-0 hidden lg:flex h-screen w-64 flex-col px-6 py-8 border-r border-white/10 bg-[var(--bg)] text-base z-30">
      {/* Animated Header */}
      <div className="mb-6 font-semibold text-[var(--fg)] text-lg min-h-[1.5rem]">
        <MatrixTransitionText text={roles[roleIndex]} onDone={handleDone} />
      </div>

      {/* About Me */}
      <div className="mb-6">
        <h3 className="font-semibold text-[var(--fg)] text-lg mb-2">About Me</h3>
        <p className="text-[var(--muted)] leading-relaxed text-base">
          I enjoy weight lifting, travelling, basketball (playing and coaching),
          and spending time with my partner and friends.
          <br /><br />
          I&apos;m currently improving my reading habits, learning to cook, and
          growing as a developer through{" "}
          <a href="/projects" className="hover:text-primary">projects</a>,{" "}
          <a href="/research" className="hover:text-primary">research</a>, and LeetCode.
          <br /><br />
          In the future, I’d love to become an entrepreneur (check out Ambassador Boost),
          learn another language, and pick up the guitar.
        </p>
      </div>

      {/* Navigation */}
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-[var(--fg)] text-lg mb-3">Navigation</h4>
          <ul className="flex flex-col gap-2 text-[var(--muted)] text-base">
            <li><a href="/about" className="hover:text-primary flex items-center gap-2"><User size={16} /> About</a></li>
            <li><a href="/projects" className="hover:text-primary flex items-center gap-2"><Briefcase size={16} /> Projects</a></li>
            <li><a href="/research" className="hover:text-primary flex items-center gap-2"><BookOpen size={16} /> Research</a></li>
            <li><a href="/trips" className="hover:text-primary flex items-center gap-2"><PlaneTakeoff size={16} /> Trips</a></li>
          </ul>
        </div>

        {/* External Links */}
        <div>
          <h4 className="font-semibold text-[var(--fg)] text-lg mb-3">Links</h4>
          <ul className="flex flex-col gap-2 text-[var(--muted)] text-base">
            <li>
              <Link
                href="https://github.com/MatteoTanziCodes"
                className="hover:text-primary flex items-center gap-2"
                target="_blank"
              >
                <Globe size={16} /> GitHub
              </Link>
            </li>
            <li>
              <Link
                href="/Matteo_Tanzi_Resume_2025.pdf"
                className="hover:text-primary flex items-center gap-2"
                target="_blank"
              >
                <BookOpen size={16} /> Resume
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
