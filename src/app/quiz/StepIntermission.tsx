// app/quiz/StepIntermission.tsx
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Props {
  title: string;
  step: number;
  total: number;
  onDone: () => void;
}

const messages = (title: string, step: number, total: number) => [
  `Excellent work, soldier! You conquered \u201C${title}\u201D.`,
  step + 1 < total
    ? "But peril still lurks ahead… prepare for the next trial!"
    : "One last breath… the vault awaits!",
  "Press the arrow to continue.",
];

export default function StepIntermission({ title, step, total, onDone }: Props) {
  const msgs = messages(title, step, total);
  const [idx, setIdx] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        key="intermission"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-lavender-night text-white text-center px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* TaoTao General */}
        <Image
          src="/generaltao.png"
          alt="General Tao Tao"
          width={500}
          height={500}
          className="mb-8 drop-shadow-2xl"
          priority
        />

        {/* speech bubble */}
        <div className="relative max-w-lg">
          <p className="bg-white text-lavender-night rounded-lg py-4 px-6 text-xl shadow-lg">
            {msgs[idx]}
          </p>
          <div className="absolute -left-4 top-8 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
        </div>

        {/* next arrow */}
        <button
          className="mt-6 text-4xl hover:scale-110 transition"
          onClick={() => {
            if (idx + 1 < msgs.length) setIdx(idx + 1);
            else onDone();
          }}
        >
          ➡️
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
