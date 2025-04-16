import SideNav from "@components/SideNav";

export default function HomePage() {
  return (
    <section className="relative w-full px-4 sm:px-6 lg:px-8 py-20">
      {/* ⬅️ Side Navigation (visible on lg+) */}
      <SideNav />

      <div className="w-full max-w-3xl ml-auto ">

        {/* ========== About Section ========== */}
        <section id="about" className="mb-30">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-right" style={{ color: "var(--fg)" }}>
            Hey, it&apos;s Matteo :)
          </h1>

          <p className="text-lg sm:text-xl leading-relaxed text-right" style={{ color: "var(--muted)" }}>
            I&apos;m a Full-stack Developer focused on cloud-native solutions, real-time monitoring systems, and secure internal platforms using AWS.
            Currently working at BMO and researching AI and Computer Vision for real-world applications.
            
          </p>
        </section>
        {/* ========== Contact Section ========== */}
        <section id="contact" className="mb-10 text-left">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--fg)" }}>Contact</h2>
          <div className="flex justify-start gap-4">
            <a
              href="/about#contact"
              className="border border-[color:var(--fg)] text-[color:var(--fg)] hover:bg-[rgba(99,102,241,0.08)] px-4 py-2 rounded"
            >
              Contact Me
            </a>
            <a
              href="/Matteo_Tanzi_Resume_2025.pdf"
              target="_blank"
              className="link-hover-box hover:text-primary transition-colors"
              style={{ color: "var(--fg)" }}
            >
              View Resume
            </a>
            
          </div>
        </section>

        {/* ========== Projects Section Placeholder ========== */}
        <section id="projects" className="mb-10 text-left">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--fg)" }}>Projects</h2>
          <p className="text-[color:var(--muted)]">Coming soon...</p>
        </section>

        {/* ========== Research Section Placeholder ========== */}
        <section id="research" className="mb-10 text-left">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--fg)" }}>Research</h2>
          <p className="text-[color:var(--muted)]">Coming soon...</p>
        </section>

        {/* ========== Trips Section Placeholder ========== */}
        <section id="trips" className="mb-10 text-left">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: "var(--fg)" }}>Trips</h2>
          <p className="text-[color:var(--muted)]">Coming soon...</p>
        </section>
        
      </div>
    </section>
  );
}
