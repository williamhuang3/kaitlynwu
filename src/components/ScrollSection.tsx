"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
export default function ScrollSection({
  title,
  children,
  titleEffect = "scaleUpRotate",
  contentWidth = "full", // full | md | lg | xl
}: {
  title: string;
  children: React.ReactNode;
  titleEffect?: "scaleUpRotate" | "slideInLeft" | "tilt";
  contentWidth?: "full" | "md" | "lg" | "xl";
})

 {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Define animated title styles based on effect type
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const x = useTransform(
    scrollYProgress,
    [0, 0.3, 1],
    titleEffect === "slideInLeft" ? ["-100%", "0%", "100%"] : ["0%", "0%", "0%"]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    titleEffect === "scaleUpRotate" ? [0.7, 1, 1.2] : [1, 1, 1]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    titleEffect === "scaleUpRotate" ? ["-10deg", "0deg", "10deg"] : ["0deg", "0deg", "0deg"]
  );

  return (
    <section
      ref={ref}
      className="min-h-[150vh] w-full flex flex-col justify-start px-0 py-32"
    >
      <motion.h2
        style={{ opacity, x, scale, rotate }}
        className="text-8xl font-bold text-lavender-deep mb-32 text-center"
      >
        {title}
      </motion.h2>

      <div
        className={`
          w-full
          ${
            contentWidth === "md"
              ? "max-w-2xl mx-auto px-4"
              : contentWidth === "lg"
              ? "max-w-4xl mx-auto px-4"
              : contentWidth === "xl"
              ? "max-w-6xl mx-auto px-4"
              : ""
          }
        `}
      >
        {children}
      </div>
    </section>
  );
}