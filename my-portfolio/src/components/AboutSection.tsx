"use client";

import { useEffect, useRef, useState } from "react";
import AboutMe from "./about/AboutMe";
import Contact from "./about/Contact";
import Work from "./about/Work";
import Current from "./about/Current";
import Tools from "./about/Tools";
import InterviewsSpeaking from "./about/Speaking";
import ScrollSection from "./ScrollSection";

const sections = [
  { id: "about-me", label: "About" },
  { id: "contact", label: "Contact" },
  { id: "work", label: "Work" },
  { id: "current", label: "Current" },
  { id: "tools", label: "Tools" },
  { id: "interviews", label: "Interviews/Speaking" },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(sections[0].id);

  // Intersection Observer: track active section
  useEffect(() => {
    const targets = document.querySelectorAll(".scroll-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5, // good for mobile and desktop
        // 🔧 Remove root for more consistent behavior
        // root: containerRef.current, ❌
      }
    );
    

    targets.forEach((el) => observer.observe(el));
    return () => targets.forEach((el) => observer.unobserve(el));
  }, []);

  // Smooth wheel scroll with manual logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const scrollToSection = (index: number) => {
      clearTimeout(scrollTimeout); // ✅ cancel previous timeout
      const nextId = sections[index]?.id;
      const el = document.getElementById(nextId);
      if (el && !isScrolling) {
        isScrolling = true;
        setActive(nextId);
        el.scrollIntoView({ behavior: "smooth" });

        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };


    const handleWheel = (e: WheelEvent) => {
      if (isScrolling || Math.abs(e.deltaY) < 10) return;
      e.preventDefault();

      const currentIndex = sections.findIndex((s) => s.id === active);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
      if (nextIndex !== currentIndex) {
        scrollToSection(nextIndex);
      }
    };

    const handleKey = (e: KeyboardEvent) => {
      const currentIndex = sections.findIndex((s) => s.id === active);
      if (e.key === "ArrowDown") {
        const next = Math.min(sections.length - 1, currentIndex + 1);
        scrollToSection(next);
      } else if (e.key === "ArrowUp") {
        const prev = Math.max(0, currentIndex - 1);
        scrollToSection(prev);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKey);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKey);
    };
  }, [active]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dot Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-10">
        <ul className="flex flex-col gap-4 items-center">
          {sections.map((s) => (
            <li key={s.id}>
              <button
                onClick={() => {
                  const section = document.getElementById(s.id);
                  if (section) {
                    setActive(s.id); // Update active state immediately
                    section.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  active === s.id 
                    ? "bg-primary scale-125" 
                    : "bg-zinc-400 hover:bg-primary/50"
                }`}
                aria-label={`Scroll to ${s.label} section`}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Section Scroll Container */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide pt-[64px] sm:pt-0"
      >
        <ScrollSection id="about-me">
          <AboutMe />
        </ScrollSection>
        <ScrollSection id="contact">
          <Contact />
        </ScrollSection>
        <ScrollSection id="work">
          <Work />
        </ScrollSection>
        <ScrollSection id="current">
          <Current />
        </ScrollSection>
        <ScrollSection id="tools">
          <Tools />
        </ScrollSection>
        <ScrollSection id="interviews">
          <InterviewsSpeaking />
        </ScrollSection>
      </div>
    </div>
  );
}
