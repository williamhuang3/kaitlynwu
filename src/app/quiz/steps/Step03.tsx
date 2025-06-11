// src/app/quiz/steps/Step03.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "@/components/QuizContext";
import { FaQuestionCircle } from "react-icons/fa";
import Image from "next/image";

const GAME_TIME = 30;
const SPAWN_INTERVAL = 1200;

/** Pancake type */
type Cake = {
  id: number;
  x: number;
  y: number;
  fires: number;
};

type WaterSpurt = {
  id: number;
  from: { x: number; y: number };
  to: { x: number; y: number };
};

type WaterProjectile = {
  id: number;
  from: { x: number; y: number };
  angle: number; // radians
};

export default function Step03() {
  const { addScore, setStep } = useQuiz();

  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [showHelp, setShowHelp] = useState(true);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [waterSpurts, setWaterSpurts] = useState<WaterSpurt[]>([]);
  const [waterProjectiles, setWaterProjectiles] = useState<WaterProjectile[]>([]);

  const arenaRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);

  const spawnCake = () => {
    const arena = arenaRef.current;
    if (!arena) return;
    const h = arena.clientHeight;
    const w = arena.clientWidth;
    setCakes((c) => [
      ...c,
      {
        id: Date.now(),
        x: Math.random() * (w - 100) + 20,
        y: Math.random() * (h - 200) + 40,
        fires: 3,
      },
    ]);
  };

  useEffect(() => {
    if (!started || countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [started, countdown]);

  useEffect(() => {
    if (!started || countdown > 0) return;
    const t = setInterval(() => {
      setTimeLeft((s) => (s === 1 ? (clearInterval(t), 0) : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [started, countdown]);

  useEffect(() => {
    if (!started || countdown > 0) return;
    const spawner = setInterval(spawnCake, SPAWN_INTERVAL);
    return () => clearInterval(spawner);
  }, [started, countdown]);

  useEffect(() => {
    if (timeLeft === 0) {
      addScore(scoreRef.current);
      // Prevent double-calling by only running when timeLeft transitions to 0
      // and not on every render after timeLeft is 0
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft === 0]); // Only run when timeLeft transitions to 0

  useEffect(() => {
    if (timeLeft === 0) {
      setTimeout(() => setStep(3), 1000);
    }
  }, [timeLeft, setStep]);

  // Helper to get General Tao's center position in arena coordinates
  const getGeneralTaoPos = () => {
    const arena = arenaRef.current;
    if (!arena) return { x: 0, y: 0 };
    // General Tao image is 120x120, centered horizontally, bottom-aligned
    const x = arena.clientWidth / 2;
    const y = arena.clientHeight - 60; // 60px above bottom (center of image)
    return { x, y };
  };

  // Fire 3 projectiles with a slight spread toward the click/cake
  const fireWaterProjectiles = (target: { x: number; y: number }) => {
    const from = getGeneralTaoPos();
    const dx = target.x - from.x;
    const dy = target.y - from.y;
    const baseAngle = Math.atan2(dy, dx);
    const spread = 0.18; // radians, ~10deg
    const angles = [baseAngle - spread, baseAngle, baseAngle + spread];
    setWaterProjectiles((prev) => [
      ...prev,
      ...angles.map((angle) => ({
        id: Date.now() + Math.random(),
        from,
        angle,
      })),
    ]);
  };

  // Remove projectiles that leave the arena
  useEffect(() => {
    if (waterProjectiles.length === 0) return;
    const arena = arenaRef.current;
    if (!arena) return;
    const animation = setInterval(() => {
      setWaterProjectiles((prev) =>
        prev
          .map((p) => {
            // Move projectile forward
            const speed = 32; // px per tick
            return {
              ...p,
              from: {
                x: p.from.x + Math.cos(p.angle) * speed,
                y: p.from.y + Math.sin(p.angle) * speed,
              },
            };
          })
          .filter(
            (p) =>
              p.from.x >= 0 &&
              p.from.x <= arena.clientWidth &&
              p.from.y >= 0 &&
              p.from.y <= arena.clientHeight
          )
      );
    }, 24);
    return () => clearInterval(animation);
  }, [waterProjectiles]);

  useEffect(() => {
    if (waterSpurts.length === 0) return;
    const timeout = setTimeout(() => {
      setWaterSpurts((spurts) => spurts.slice(1));
    }, 400);
    return () => clearTimeout(timeout);
  }, [waterSpurts]);

  useEffect(() => {
    if (timeLeft === 0) {
      addScore(scoreRef.current);
      setTimeout(() => setStep(3), 1000);
    }
  }, [timeLeft, addScore, setStep]);

  const handleArenaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!started || countdown > 0) return;
    const arena = arenaRef.current;
    if (!arena) return;
    const rect = arena.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    fireWaterProjectiles({ x, y });
  };

  const handleClick = (id: number, cake: Cake) => {
    setCakes((prev) => {
      return prev.map((c) => {
        if (c.id === id && c.fires > 0) {
          const updated = { ...c, fires: c.fires - 1 };
          if (updated.fires === 0) scoreRef.current += 1;
          return updated;
        }
        return c;
      }).filter(c => c.fires > 0);
    });
    // Fire projectiles toward the cake
    fireWaterProjectiles({ x: cake.x + 40, y: cake.y + 40 });
  };

  return (
    <>
      {/* Custom cursor style for gun emoji */}
      <style jsx global>{`
        .cursor-gun {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><text y="38" font-size="38">🔫</text></svg>') 24 24, auto;
        }
      `}</style>
      <div
        ref={arenaRef}
        className="relative w-full max-w-3xl h-[480px] bg-lavender-light border-4 border-lavender-dark rounded-xl overflow-hidden select-none cursor-gun"
        onClick={handleArenaClick}
      >
        <button onClick={() => setShowHelp(true)} className="absolute top-3 left-3 text-2xl text-lavender-night">
          <FaQuestionCircle />
        </button>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20">
          <Image src="/generaltao.png" alt="General Tao" width={120} height={120} />
        </div>

        {/* Water projectiles */}
        {waterProjectiles.map((p) => (
          <motion.div
            key={p.id}
            style={{
              position: "absolute",
              left: p.from.x,
              top: p.from.y,
              width: 32,
              height: 6,
              transform: `translate(-50%, -50%) rotate(${(p.angle * 180) / Math.PI}deg)`,
              pointerEvents: "none",
              zIndex: 30,
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* 3 short blue lines for water */}
            <div style={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
              height: "100%",
            }}>
              <div style={{
                width: 8, height: 6, borderRadius: 3,
                background: "linear-gradient(90deg, #38bdf8 60%, #bae6fd 100%)",
                boxShadow: "0 0 4px #38bdf8",
              }} />
              <div style={{
                width: 8, height: 6, borderRadius: 3,
                background: "linear-gradient(90deg, #38bdf8 60%, #bae6fd 100%)",
                boxShadow: "0 0 4px #38bdf8",
              }} />
              <div style={{
                width: 8, height: 6, borderRadius: 3,
                background: "linear-gradient(90deg, #38bdf8 60%, #bae6fd 100%)",
                boxShadow: "0 0 4px #38bdf8",
              }} />
            </div>
          </motion.div>
        ))}

        {cakes.map((cake) => (
          <motion.div
            key={cake.id}
            className="absolute text-5xl cursor-pointer"
            style={{ x: cake.x, y: cake.y }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(cake.id, cake);
            }}
          >
            🥞{"🔥".repeat(cake.fires)}
          </motion.div>
        ))}

        {/* Water spurts */}
        {waterSpurts.map((spurt) => {
          const dx = spurt.to.x - spurt.from.x;
          const dy = spurt.to.y - spurt.from.y;
          const angle = Math.atan2(dy, dx) * 180 / Math.PI;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return (
            <motion.div
              key={spurt.id}
              initial={{ width: 0, opacity: 1 }}
              animate={{ width: dist, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              style={{
                position: "absolute",
                left: spurt.from.x,
                top: spurt.from.y,
                height: 10,
                pointerEvents: "none",
                transform: `rotate(${angle}deg) translateY(-50%)`,
                zIndex: 25,
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 10,
                  background: "linear-gradient(90deg, #7dd3fc 60%, #bae6fd 100%)",
                  borderRadius: 5,
                  boxShadow: "0 0 8px #38bdf8",
                }}
              />
            </motion.div>
          );
        })}

        {started && countdown === 0 && (
          <div className="absolute top-2 inset-x-0 flex justify-center gap-6 font-bold text-lavender-night z-10">
            <span>⏰ {timeLeft}s</span>
            <span>🏆 {scoreRef.current}</span>
          </div>
        )}

        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center text-white space-y-4 z-30 p-6"
          >
            <h2 className="text-3xl font-bold">How to play</h2>
            <p className="max-w-md text-lg">
              Your cursor is now a crosshair.
              Click burning pancakes 🥞🔥🔥🔥 to extinguish them!
              Each click removes one fire. Score points by fully putting them out!
              You have {GAME_TIME}s.
            </p>
            <button onClick={() => setShowHelp(false)} className="btn-choice !px-8 !py-3 text-lg">Let’s Go!</button>
          </motion.div>
        )}

        {!started && !showHelp && (
          <button onClick={() => setStarted(true)} className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-4xl font-bold z-20">
            START
          </button>
        )}

        {started && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-6xl font-extrabold z-20"
          >
            {countdown}
          </motion.div>
        )}

        {timeLeft === 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-5xl font-extrabold z-20"
          >
            Time’s up!
          </motion.div>
        )}
      </div>
    </>
  );
}
