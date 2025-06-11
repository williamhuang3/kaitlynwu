"use client";
import { motion } from "framer-motion";

export default function AnimatedItem({
  children,
  direction = "left",
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
}) {
  const xVal = direction === "left" ? -100 : 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: xVal, rotate: -4 }}
      whileInView={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{
        type: "spring",
        bounce: 0.3,
        duration: 0.8,
      }}
      viewport={{ once: true, amount: 0.5 }}
      className="bg-lavender-light rounded-xl px-6 py-4 shadow-lg mb-6"
    >
      {children}
    </motion.div>
  );
}
