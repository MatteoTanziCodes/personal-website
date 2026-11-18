import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning | Matteo Tanzi",
  description:
    "A daily learning feed: fresh articles on product management, leadership, startups, AI, cloud, and architecture, new computer-science research papers, plus Wikipedia's featured article.",
};

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  return children;
}
