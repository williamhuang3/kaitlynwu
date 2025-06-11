// src/app/quiz/ProgressBar.tsx
"use client";
import { motion } from "framer-motion";

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const percent = (current / total) * 100;
  return (
    <div className="w-full bg-gray-200 h-4 relative overflow-hidden rounded">
      <motion.div
        className="h-full bg-lavender-dark origin-left"
        style={{ width: `${percent}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
      />
      <span className="absolute right-0 -top-7 text-2xl">🗝️ → 💰</span>
    </div>
  );
}
