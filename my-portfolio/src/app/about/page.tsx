// app/about/page.tsx
import AboutSection from "@/components/AboutSection";
import BackToTopButton from "@/components/BackToTopButton";
import ThemeClientReady from "@/components/ThemeClientReady";
import PageWrapper from "@/components/PageWrapper";

export default function AboutPage() {
  return (
    <ThemeClientReady>
      <PageWrapper>
        <AboutSection />
      </PageWrapper>
      <BackToTopButton />
    </ThemeClientReady>
  );
}
