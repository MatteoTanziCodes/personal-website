"use client";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-6xl">{children}</div>
    </main>
  );
}
