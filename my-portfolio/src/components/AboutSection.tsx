"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

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

  // IntersectionObserver to update active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.intersectionRatio > 0.5);
        if (visible) {
          setActive(visible.target.id);
        }
      },
      { threshold: 0.5 }
    );

    const elems = document.querySelectorAll(".scroll-section");
    elems.forEach((el) => observer.observe(el));
    return () => {
      elems.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Custom wheel handler for snapping
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    let isScrolling = false;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      // Lower threshold to catch smaller scrolls
      if (Math.abs(e.deltaY) < 5) return;

      const currentIndex = sections.findIndex((s) => s.id === active);
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(
        0,
        Math.min(currentIndex + direction, sections.length - 1)
      );

      if (nextIndex !== currentIndex) {
        isScrolling = true;
        const target = scrollContainer.children[nextIndex] as HTMLElement;
        target.scrollIntoView({ behavior: "smooth" });
        setActive(sections[nextIndex].id);
        // Release debounce after animation completes
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    };

    scrollContainer.addEventListener("wheel", handleWheel, { passive: false });
    return () => scrollContainer.removeEventListener("wheel", handleWheel);
  }, [active]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Dot Navigation */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-10">
        <ul className="flex flex-col gap-4">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`block w-3 h-3 rounded-full transition-colors ${
                  active === s.id ? "bg-primary" : "bg-zinc-400"
                }`}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Scrollable Sections */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth scrollbar-hide"
      >
        {sections.map((s) => (
          <Section key={s.id} id={s.id} title={s.label}>
            <p>
              This is the <strong>{s.label}</strong> section. Add your content here!
            </p>
          </Section>
        ))}
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-section snap-start h-[calc(100vh-8rem)] flex flex-col justify-center items-center px-8 py-12"
    >
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-[var(--fg)] mb-4"
      >
        {title}
      </motion.h2>
      <div className="text-[var(--muted)] max-w-2xl text-center">{children}</div>
    </section>
  );
}
