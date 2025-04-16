import TripCard from "@/components/TripCard";

const tripData: { year: number; image: string; location: string }[] = [
  // 2024
  { year: 2024, image: "/images/trips/IMG_8380.JPG", location: "London" },
  { year: 2024, image: "/images/trips/IMG_8381.JPG", location: "London" },
  { year: 2024, image: "/images/trips/IMG_8382.JPG", location: "London" },
  { year: 2024, image: "/images/trips/IMG_5341.JPG", location: "Curacao" },
  { year: 2024, image: "/images/trips/IMG_5326.JPG", location: "Curacao" },
  { year: 2024, image: "/images/trips/IMG_5367.JPG", location: "Curacao" },
  { year: 2024, image: "/images/trips/IMG_5375.JPG", location: "Curacao" },
  { year: 2024, image: "/images/trips/IMG_8383.JPG", location: "Curacao" },

  // 2023
  { year: 2023, image: "/images/trips/IMG_8390.JPG", location: "Banff" },
  { year: 2023, image: "/images/trips/IMG_8391.JPG", location: "Banff" },
  { year: 2023, image: "/images/trips/IMG_8392.JPG", location: "Portugal" },
  { year: 2023, image: "/images/trips/IMG_8393.JPG", location: "Portugal" },
  { year: 2023, image: "/images/trips/IMG_8394.JPG", location: "Portugal" },
  { year: 2023, image: "/images/trips/IMG_8395.JPG", location: "Portugal" },
  { year: 2023, image: "/images/trips/IMG_8396.JPG", location: "Portugal" },
  { year: 2023, image: "/images/trips/IMG_8397.JPG", location: "Denmark" },
  { year: 2023, image: "/images/trips/IMG_8398.JPG", location: "Sweden" },
  { year: 2023, image: "/images/trips/IMG_8399.JPG", location: "Sweden" },
  { year: 2023, image: "/images/trips/IMG_8400.JPG", location: "Sweden" },
  { year: 2023, image: "/images/trips/IMG_8401.JPG", location: "Sweden" },
  { year: 2023, image: "/images/trips/IMG_8402.JPG", location: "Sweden" },
  { year: 2023, image: "/images/trips/IMG_8403.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8404.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8405.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8406.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8407.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8408.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8410.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8411.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8412.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8413.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8414.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8415.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8416.JPG", location: "Greece" },
  { year: 2023, image: "/images/trips/IMG_8417.JPG", location: "Mont Tremblant" },
  { year: 2023, image: "/images/trips/IMG_8419.JPG", location: "Cancun" },
  { year: 2023, image: "/images/trips/IMG_8420.JPG", location: "Cancun" },

  // 2022
  { year: 2022, image: "/images/trips/IMG_8421.JPG", location: "Vegas" },
  { year: 2022, image: "/images/trips/IMG_8422.JPG", location: "Vegas" },
  { year: 2022, image: "/images/trips/IMG_8423.JPG", location: "Vegas" },
  { year: 2022, image: "/images/trips/IMG_8424.JPG", location: "Montreal" },
  { year: 2022, image: "/images/trips/IMG_8425.JPG", location: "Montreal" },

  // 2009
  { year: 2009, image:"/images/trips/IMG_8385.JPG", location:"Memories" },
  { year: 2009, image:"/images/trips/IMG_8386.JPG", location:"Memories" },
  { year: 2009, image:"/images/trips/IMG_8387.JPG", location:"Memories" },
  { year: 2009, image:"/images/trips/IMG_8388.JPG", location:"Memories" },
  { year: 2009, image:"/images/trips/IMG_8389.JPG", location:"Memories" },
];

// Optional fallback for grouping if Object.groupBy isn’t supported
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
    <section className="px-4 sm:px-8 py-12">
      <h1 className="text-3xl font-bold mb-10 text-center text-[var(--fg)]">Travel Archive</h1>

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

      {sortedYears.map((year) => (
        <div key={year} id={`year-${year}`} className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-center mb-6 text-[var(--fg)]">{year}</h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {groupedByYear[Number(year)].map((trip, index) => (
              <TripCard key={`${year}-${index}`} image={trip.image} location={trip.location} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
