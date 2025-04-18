"use client";

import { motion } from "framer-motion";
import { ElementType } from "react";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}

export default function AnimatedWrapper({ 
  children, 
  className = ""
}: AnimatedWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ 
        once: false,  // Changed to false to allow re-animation on scroll
        amount: 0.3   // Trigger when 30% of element is visible
      }}
      transition={{ 
        duration: 0.8,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
