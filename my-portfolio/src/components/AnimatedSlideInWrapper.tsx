"use client";

import { motion } from "framer-motion";
import { ElementType } from "react";

interface AnimatedSlideInWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export default function AnimatedSlideInWrapper({
  children,
  className = "",
}: AnimatedSlideInWrapperProps) {
  return (
    <motion.div
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
