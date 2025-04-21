"use client";

interface PageWrapperProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="w-full flex justify-center pt-[80px] sm:pt-[100px] px-4 sm:px-6 lg:px-8 pb-12">
      <div className="w-full max-w-6xl">{children}</div>
    </main>
  );
}
