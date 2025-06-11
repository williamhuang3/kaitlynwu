"use client";
import { motion } from "framer-motion";
import FlippableCard from "@/components/FlippableCard";

export default function LoveReasons() {
  const reasons = [
    "you make me yummy food",
    "you show me interesting, thought provoking yt videos",
    "you show me shows like love death and robots",
    "you look amazing and squishy always",
    "you challenge me to be a better person every day",
    "you always support me in my goals",
    "you got that gorilla GWIP",
    "you love me for all of my imperfections too",
    "you show me what having a healthy relationship with your family means",
    "you welcome me into your family with open arms",
    "you are really good at grilled cheese",
    "you're the funniest bega alive",
    "you are extremely perseverant",
    "you're kind to all your friends",
    "you show me alternate ways of thinking about problems in my life",
    "you love cats like me",
    "you love anime and fiction like me",
    "you love a good MARCHA",
    "you always put so much effort into us",
    "i feel proud showing u to people in my life",
    "i patiently build legos with you",
    "you are beautiful inside and out and even greasy hair pimples cuts scrapes at the end of the day it doesnt matter",
    "you always have my back when im stressed",
    "you flood my world with your love and im so grateful ur in my life",
  ];

  return (
    <section className="min-h-[120vh] bg-lavender-light py-20 px-6 relative overflow-hidden">
      {/* 🐈 Big chaotic cat */}
      <motion.img
        src="/p.png"
        alt="bouncing cat"
        className="w-400 h-400 absolute pointer-events-none"
        animate={{
          x: ["0vw", "80vw", "10vw", "90vw", "0vw"],
          y: ["0vh", "10vh", "80vh", "30vh", "0vh"],
        }}
        transition={{
          duration: 20,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
      />
      {/* 💌 Love letter card grid */}
      <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {reasons.map((reason, i) => (
          <FlippableCard key={i} reason={reason} />
        ))}
      </div>
    </section>
  );
}
