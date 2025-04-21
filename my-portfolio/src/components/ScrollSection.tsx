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
        className="scroll-section snap-start min-h-screen pt-header px-6 pb-16 flex flex-col justify-center items-center"
      >
        {children}
      </section>
    );
  }
  