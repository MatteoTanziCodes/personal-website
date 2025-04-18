"use client";

import { motion } from "framer-motion";
import { ElementType } from "react";
import { fadeUp } from "@/lib/framer";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export default function AnimatedWrapper({
  children,
  className = "",
}: AnimatedWrapperProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: false, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
