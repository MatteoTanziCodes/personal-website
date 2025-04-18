// app/about/page.tsx
import AboutSection from "@/components/AboutSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTopButton from "@/components/BackToTopButton"; // 👈 import it
import ThemeClientReady from "@/components/ThemeClientReady";

export default function AboutPage() {
  return (
    <>
    <ThemeClientReady>
      <div className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg)]">
        <Navbar />
      </div>
      <div className="mt-[64px]"> {/* Adjust this value to match your navbar height */}
        <AboutSection />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg)]">
        <Footer />
      </div>
      {/* Back to Top Floating Button */}
      <BackToTopButton /> {/* 👈 this goes *outside* the fixed elements */}
    </ThemeClientReady>
    </>
  );
}
