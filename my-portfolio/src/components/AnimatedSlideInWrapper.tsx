"use client";

import { motion } from "framer-motion";
import { slideInLeft } from "@/lib/framer";

interface AnimatedSlideInWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSlideInWrapper({
  children,
  className = "",
}: AnimatedSlideInWrapperProps) {
  return (
    <motion.div
      variants={slideInLeft}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
}
