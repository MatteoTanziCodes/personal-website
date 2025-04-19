"use client";

import SideNav from "@components/SideNav";
import ProjectCard from "@components/homepage/ProjectCard";
import ResearchCard from "@components/homepage/ResearchCard";
import { PROJECTS } from "@/data/projects";
import { RESEARCH } from "@/data/research";
import AnimatedText from "@/components/AnimatedText";
import AnimatedWrapper from "@/components/AnimatedWrapper";
import ThemeClientReady from "@/components/ThemeClientReady";
import PageWrapper from "@/components/PageWrapper";

export default function HomePage() {
  const latestProjects = PROJECTS.slice(0, 2);
  const latestResearch = RESEARCH.slice(0, 2);

  return (
    <ThemeClientReady>
      <PageWrapper>
      <section className="relative w-full lg:pl-64 px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
        <SideNav />

        <div className="w-full max-w-3xl ml-auto">
          <section id="about" className="mb-20">
            <AnimatedText text="Hey, it's Matteo :)" />
            <p className="text-lg sm:text-xl leading-relaxed text-right text-[var(--muted)]">
              I&apos;m a Full-stack Developer focused on cloud-native solutions, real-time monitoring systems, and secure internal platforms using AWS.
              Currently working at BMO and researching AI and Computer Vision for real-world applications.
            </p>
          </section>

          <section id="contact" className="mb-10 text-left">
            <AnimatedWrapper>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]">Contact</h2>
              <div className="flex justify-start gap-4 flex-wrap">
                <a href="/about#contact" className="border border-[color:var(--fg)] text-[color:var(--fg)] hover:bg-[rgba(99,102,241,0.08)] px-4 py-2 rounded">Contact Me</a>
                <a href="/Matteo_Tanzi_Resume_2025.pdf" target="_blank" className="link-hover-box hover:text-primary transition-colors text-[color:var(--fg)]">View Resume</a>
              </div>
            </AnimatedWrapper>
          </section>

          <section id="projects" className="mb-10 text-left">
            <AnimatedWrapper>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]">
              <a
                href="/projects"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Projects
              </a>
            </h2>




              <div className="flex flex-col gap-6">
                {latestProjects.map((project, i) => (
                  <div key={i}>
                    <ProjectCard
                      {...project}
                      onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                    />
                  </div>
                ))}
              </div>
            </AnimatedWrapper>
          </section>

          <section id="research" className="mb-10 text-left">
            <AnimatedWrapper>
            <h2 className="text-2xl font-semibold mb-4 text-[var(--fg)]">
              <a
                href="/research"
                className="hover:text-primary transition-colors cursor-pointer"
              >
                Research
              </a>
            </h2>

              <div className="flex flex-col gap-6">
                {latestResearch.map((research, i) => (
                  <div key={i}>
                    <ResearchCard
                      {...research}
                      onClick={() => window.open(research.github, "_blank", "noopener,noreferrer")}
                    />
                  </div>
                ))}
              </div>
            </AnimatedWrapper>
          </section>

          <section id="trips" className="mb-10 text-left">
            <AnimatedWrapper>
              <h2 className="text-2xl font-semibold mb-6 text-[var(--fg)]">Trips</h2>
              <div className="flex flex-wrap gap-6 text-lg font-semibold">
                {["2024", "2023", "2022", "2009"].map((year) => (
                  <a
                    key={year}
                    href={`/trips#year-${year}`}
                    className="link-hover-box text-[var(--fg)] hover:text-primary transition-colors"
                  >
                    {year}
                  </a>
                ))}
              </div>
            </AnimatedWrapper>
          </section>
        </div>
      </section>
      </PageWrapper>
    </ThemeClientReady>
  );
}
