"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import cn from "classnames";

interface TripCardProps {
  image: string;
  location: string;
}

const MOBILE_MEDIA_QUERY = "(hover: none) and (pointer: coarse)";
const IN_VIEW_THRESHOLD = 0.6;
const MAX_MOBILE_TILT = 12;
const DEFAULT_TILT = { rotateX: 0, rotateY: 0 };

type MotionPermissionState = "unknown" | "granted" | "denied";

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

let motionPermissionState: MotionPermissionState = "unknown";
let motionPermissionRequest: Promise<boolean> | null = null;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

async function ensureMotionPermission() {
  if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
    motionPermissionState = "denied";
    return false;
  }

  if (motionPermissionState === "granted") {
    return true;
  }

  if (motionPermissionState === "denied") {
    return false;
  }

  const deviceOrientation = DeviceOrientationEvent as IOSDeviceOrientationEvent;

  if (typeof deviceOrientation.requestPermission !== "function") {
    motionPermissionState = "granted";
    return true;
  }

  if (!motionPermissionRequest) {
    motionPermissionRequest = deviceOrientation
      .requestPermission()
      .then((result) => {
        motionPermissionState = result === "granted" ? "granted" : "denied";
        return motionPermissionState === "granted";
      })
      .catch(() => {
        motionPermissionState = "denied";
        return false;
      })
      .finally(() => {
        motionPermissionRequest = null;
      });
  }

  return motionPermissionRequest;
}

export default function TripCard({ image, location }: TripCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mobileNeutralTiltRef = useRef<{ beta: number; gamma: number } | null>(null);
  const mobileTiltFrameRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMotionEnabled, setIsMotionEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [transform, setTransform] = useState(DEFAULT_TILT);
  const isActive = isMobile ? isInView : hovered;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateIsMobile();
    mediaQuery.addEventListener("change", updateIsMobile);

    return () => {
      mediaQuery.removeEventListener("change", updateIsMobile);
    };
  }, []);

  useEffect(() => {
    const node = cardRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= IN_VIEW_THRESHOLD);
      },
      {
        threshold: [IN_VIEW_THRESHOLD],
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isMobile || typeof window === "undefined") return;

    let cancelled = false;

    const activateMotion = async () => {
      const granted = await ensureMotionPermission();
      if (!cancelled) {
        setIsMotionEnabled(granted);
      }
    };

    void activateMotion();

    // iOS Safari requires a user gesture before motion data is available.
    const handleFirstGesture = () => {
      void activateMotion();
    };

    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });

    return () => {
      cancelled = true;
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
    };
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return;

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
      setTransform(DEFAULT_TILT);
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
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !isInView) {
      mobileNeutralTiltRef.current = null;
    }
  }, [isInView, isMobile]);

  useEffect(() => {
    if (!isMobile || !isInView || !isMotionEnabled || typeof window === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;

      const neutralTilt =
        mobileNeutralTiltRef.current ??
        (() => {
          const initialTilt = { beta: event.beta ?? 0, gamma: event.gamma ?? 0 };
          mobileNeutralTiltRef.current = initialTilt;
          return initialTilt;
        })();

      const rotateX = clamp(-(event.beta - neutralTilt.beta) * 0.6, -MAX_MOBILE_TILT, MAX_MOBILE_TILT);
      const rotateY = clamp((event.gamma - neutralTilt.gamma) * 0.9, -MAX_MOBILE_TILT, MAX_MOBILE_TILT);

      if (mobileTiltFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileTiltFrameRef.current);
      }

      mobileTiltFrameRef.current = window.requestAnimationFrame(() => {
        setTransform({ rotateX, rotateY });
      });
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      if (mobileTiltFrameRef.current !== null) {
        window.cancelAnimationFrame(mobileTiltFrameRef.current);
        mobileTiltFrameRef.current = null;
      }
      window.removeEventListener("deviceorientation", handleOrientation, true);
      mobileNeutralTiltRef.current = null;
      setTransform(DEFAULT_TILT);
    };
  }, [isInView, isMobile, isMotionEnabled]);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => {
        if (!isMobile) {
          setHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!isMobile) {
          setHovered(false);
        }
      }}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
        transition: isMobile ? "transform 0.08s linear" : hovered ? "transform 0.1s ease" : "transform 0.4s ease",
        willChange: "transform",
      }}
      className={cn(
        "relative overflow-hidden rounded-xl transition-all duration-300",
        "aspect-[3/4] bg-zinc-800", // fallback bg if image fails
        !isMobile && "cursor-pointer",
        !isActive && "shadow-[0_0_30px_rgba(255,255,255,0.30)]" // subtle white glow when inactive
      )}
    >
      <Image
        src={image}
        alt={location}
        fill
        className={cn(
          "object-cover transition-all duration-500 ease-in-out",
          isActive ? "blur-0 scale-105" : "blur-sm scale-100"
        )}
      />
      {!isActive && (
        <div className="absolute inset-0 bg-black/30 z-10" />
      )}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <span className="text-white font-semibold text-lg drop-shadow-md">{location}</span>
      </div>
    </div>
  );
}
