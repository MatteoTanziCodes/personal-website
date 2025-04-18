"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";

interface TripCardProps {
  image: string;
  location: string;
}

export default function TripCard({ image, location }: TripCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = cardRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y / rect.height - 0.5) * 20); // MORE dramatic tilt
      const rotateY = -(x / rect.width - 0.5) * 20;

      setTransform({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
      setTransform({ rotateX: 0, rotateY: 0 });
    };

    const node = cardRef.current;
    if (node) {
      node.addEventListener("mousemove", handleMouseMove);
      node.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (node) {
        node.removeEventListener("mousemove", handleMouseMove);
        node.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: hovered ? "transform 0.1s ease" : "transform 0.4s ease",
      }}
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300 cursor-pointer",
        "aspect-[3/4] bg-zinc-800", // fallback bg if image fails
        !hovered && "shadow-[0_0_30px_rgba(255,255,255,0.30)]" // subtle white glow when not hovered
      )}
    >
      <Image
        src={image}
        alt={location}
        fill
        className={cn(
          "object-cover transition-all duration-500 ease-in-out",
          hovered ? "blur-0 scale-105" : "blur-sm scale-100"
        )}
      />
      {!hovered && (
        <div className="absolute inset-0 bg-black/30 z-10" />
      )}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <span className="text-white font-semibold text-lg drop-shadow-md">{location}</span>
      </div>
    </div>
  );
}
