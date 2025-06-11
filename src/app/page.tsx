"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function PoliceChaseCutscene({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#23233a] via-[#3e3e5e] to-[#b8c1ec]">
      <div className="absolute bottom-0 left-0 w-full h-40 bg-green-600 z-0" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gray-800 z-10 border-t-8 border-gray-600" />
      <div className="absolute bottom-16 left-0 w-full flex justify-between z-20">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-3 w-24 bg-yellow-300 mx-2 rounded-full"
            style={{ opacity: 0.7 }}
          />
        ))}
      </div>
      <motion.div
        className="absolute"
        style={{ bottom: 64, left: 0, fontSize: "8rem", zIndex: 50, filter: "drop-shadow(0 8px 32px #fff8)" }}
        initial={{ x: -300 }}
        animate={{ x: "60vw" }}
        transition={{ duration: 2.2, delay: 0.2, ease: "easeInOut" }}
      >
        🚗
      </motion.div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ bottom: `${64 + i * 80}px`, left: 0, fontSize: "7rem", zIndex: 20 + i, filter: "drop-shadow(0 4px 16px #0008)" }}
          initial={{ x: -300 }}
          animate={{ x: "110vw" }}
          transition={{ duration: 2.1 + i * 0.3, delay: 1.1 + i * 0.18, ease: "easeInOut" }}
        >
          🚓
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.7, duration: 0.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-4xl font-extrabold text-white drop-shadow-lg z-50"
      >
        You arrive at the secret vault...
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [showCutscene, setShowCutscene] = useState(true);
  const [name, setName] = useState("");
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeTimeout, setChallengeTimeout] = useState(false);

  const unlocked = name.trim().toLowerCase() === "kaitlyn";
  const isSSR = typeof window === "undefined";

  useEffect(() => {
    if (!showCutscene) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showCutscene]);

  useEffect(() => {
    if (unlocked && !showChallenge) {
      const t = setTimeout(() => setShowChallenge(true), 400);
      return () => clearTimeout(t);
    }
  }, [unlocked, showChallenge]);

  useEffect(() => {
    if (showChallenge && !challengeTimeout) {
      const t = setTimeout(() => setChallengeTimeout(true), 2000);
      return () => clearTimeout(t);
    }
  }, [showChallenge, challengeTimeout]);

  if (showCutscene && !isSSR) {
    return <PoliceChaseCutscene onDone={() => setShowCutscene(false)} />;
  }

  if (unlocked && showChallenge && !challengeTimeout) {
    return (
      <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d2d44] via-[#3e3e5e] to-[#b8c1ec]">
        <motion.img
          src="/p.png"
          alt="Buding the guard cat"
          className="w-100 h-100 pointer-events-none absolute"
          animate={{ x: ["0%", "80%", "10%", "90%", "0%"], y: ["0%", "10%", "80%", "30%", "0%"] }}
          transition={{ duration: 25, ease: "easeInOut", repeat: Infinity }}
          style={{ zIndex: 1 }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 text-[20vw] z-0">
          🏦🔒
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="z-20 flex flex-col items-center">
          <p className="text-white text-4xl font-bold text-center">
            Ah, it appears you have been selected for the challenge...
          </p>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2d2d44] via-[#3e3e5e] to-[#b8c1ec]">
      <motion.img
        src="/p.png"
        alt="Buding the guard cat"
        className="w-100 h-100 pointer-events-none absolute"
        animate={{ x: ["0%", "80%", "10%", "90%", "0%"], y: ["0%", "10%", "80%", "30%", "0%"] }}
        transition={{ duration: 25, ease: "easeInOut", repeat: Infinity }}
        style={{ zIndex: 1 }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 text-[20vw] z-0">
        🏦🔒
      </div>
      {unlocked && challengeTimeout ? (
        <div className="letter-wrapper z-10">
          <a href="/quiz">
            <div className="letter-image group">
              <div className="animated-mail">
                <div className="back-fold" />
                <div className="letter">
                  <div className="letter-border" />
                  <div className="letter-title" />
                  <div className="letter-context" />
                  <div className="letter-stamp">
                    <div className="letter-stamp-inner" />
                  </div>
                </div>
                <div className="top-fold group-hover:rotate-x-180" />
                <div className="body" />
                <div className="left-fold" />
              </div>
              <div className="shadow group-hover:w-[250px]" />
            </div>
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-6 z-10">
          <p className="text-white text-5xl text-center">
            🏦 <span className="ml-2">You approach the secret vault.</span>
            <br />
            <span className="text-3xl">🐾 Buding the guard cat stops you at the door.</span>
            <br />
            <span className="text-2xl">🔒 &quot;State your name to enter!&quot;</span>
          </p>
          <input
            className="rounded px-4 py-2 text-black focus:outline-none focus:ring-4 focus:ring-lavender"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type here..."
          />
        </div>
      )}
    </main>
  );
}
