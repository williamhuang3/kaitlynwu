"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function FlippableCard({ reason }: { reason: string }) {
  const [flipped, setFlipped] = useState(false);
  const emoji = Math.random() > 0.5 ? "💌" : "🧸";

  return (
    <div className="perspective w-full h-32 sm:h-40" onClick={() => setFlipped(!flipped)}>
      <motion.div
        className="relative w-full h-full transform-style-preserve-3d"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front */}
        <div className="absolute w-full h-full bg-white rounded-xl shadow-lg flex items-center justify-center text-4xl text-lavender-night backface-hidden">
          {emoji}
        </div>

        {/* Back */}
        <div className="absolute w-full h-full bg-lavender text-white rounded-xl shadow-lg flex items-center justify-center text-center text-sm sm:text-base px-2 rotate-y-180 backface-hidden">
          {reason}
        </div>
      </motion.div>
    </div>
  );
}