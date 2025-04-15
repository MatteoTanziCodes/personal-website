// src/components/SectionHeader.tsx
export default function SectionHeader({ title }: { title: string }) {
    return (
      <h1 className="text-3xl font-bold border-b-2 border-primary pb-2 mb-6">
        {title}
      </h1>
    );
  }
  