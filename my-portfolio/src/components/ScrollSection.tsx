// components/ScrollSection.tsx
export default function ScrollSection({
    id,
    children,
  }: {
    id: string;
    children: React.ReactNode;
  }) {
    return (
      <section
        id={id}
        className="scroll-section snap-start min-h-[80vh] sm:min-h-[90vh] lg:min-h-screen"
      >
        {children}
      </section>
    );
  }
  