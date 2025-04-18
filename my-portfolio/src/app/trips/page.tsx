"use client";

import TripCard from "@/components/TripCard";
import { tripData } from "@/data/trips";
import BackToTopButton from "@/components/BackToTopButton";
import ThemeClientReady from "@/components/ThemeClientReady";
import AnimatedWrapper from "@/components/AnimatedWrapper";

// Group by year
const groupedByYear =
  Object.groupBy?.(tripData, (t) => t.year) ??
  tripData.reduce((acc, trip) => {
    acc[trip.year] = acc[trip.year] || [];
    acc[trip.year].push(trip);
    return acc;
  }, {} as Record<number, typeof tripData>);

export default function TripsPage() {
  const sortedYears = Object.keys(groupedByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <ThemeClientReady>
      <section className="px-4 sm:px-8 py-12">
        {/* Title */}
        <AnimatedWrapper>
          <h1 className="text-3xl font-bold mb-10 text-center text-[var(--fg)]">
            Travel Archive
          </h1>
        </AnimatedWrapper>

        {/* Year links */}
        <AnimatedWrapper delay={0.1}>
          <div className="flex justify-center gap-6 flex-wrap mb-12 text-lg font-semibold">
            {sortedYears.map((year) => (
              <a
                key={year}
                href={`#year-${year}`}
                className="hover:text-primary transition-colors"
              >
                {year}
              </a>
            ))}
          </div>
        </AnimatedWrapper>

        {/* Per-Year Sections */}
        {sortedYears.map((year) => (
          <div key={year} id={`year-${year}`} className="mb-16 scroll-mt-24">
            <AnimatedWrapper>
              <h2 className="text-2xl font-bold text-center mb-6 text-[var(--fg)]">
                {year}
              </h2>
            </AnimatedWrapper>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedByYear[Number(year)].map((trip, index) => (
                <AnimatedWrapper key={`${year}-${index}`} delay={index * 0.05}>
                  <TripCard image={trip.image} location={trip.location} />
                </AnimatedWrapper>
              ))}
            </div>
          </div>
        ))}

        <BackToTopButton />
      </section>
    </ThemeClientReady>
  );
}
