// src/app/quiz/steps/Step02.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useQuiz } from "@/components/QuizContext";
import { FaQuestionCircle } from "react-icons/fa";

const GAME_TIME = 20;
const SPAWN_INTERVAL = 600;

type Fart = { id: number; x: number; y: number; vx: number; vy: number; sound: string };

export default function Step02() {
  const { addScore, setStep } = useQuiz();
  const [started, setStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [farts, setFarts] = useState<Fart[]>([]);
  const [showHelp, setShowHelp] = useState(true);
  const [isDraggingOverWindow, setIsDraggingOverWindow] = useState(false);

  const arenaRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef(0);
  const fartsRef = useRef<Fart[]>([]);

  const isInside = (elem: DOMRect, target: DOMRect) =>
    elem.left + elem.width / 2 > target.left &&
    elem.right - elem.width / 2 < target.right &&
    elem.top + elem.height / 2 > target.top &&
    elem.bottom - elem.height / 2 < target.bottom;

  useEffect(() => {
    if (!started || countdown === 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1_000);
    return () => clearTimeout(t);
  }, [started, countdown]);

  useEffect(() => {
    if (!started || countdown > 0) return;
    const t = setInterval(() => {
      setTimeLeft((s) => (s === 1 ? (clearInterval(t), 0) : s - 1));
    }, 1_000);
    return () => clearInterval(t);
  }, [started, countdown]);

  useEffect(() => {
    if (!started || countdown > 0) return;
    const spawner = setInterval(() => {
      const arenaH = arenaRef.current?.clientHeight ?? 400;
      setFarts((fs) => [
        ...fs,
        {
          id: Date.now(),
          x: 60,
          y: Math.random() * (arenaH - 100) + 20,
          vx: Math.random() * 2 + 1,
          vy: Math.random() * 2 - 1.5,
          sound: `/fart${Math.floor(Math.random() * 3) + 1}.mp3`,
        },
      ]);

    }, SPAWN_INTERVAL);
    return () => clearInterval(spawner);
  }, [started, countdown]);

  useEffect(() => {
    fartsRef.current = farts;
  }, [farts]);

  useEffect(() => {
    if (!started || countdown > 0) return;

    let id: number;
    const arena = arenaRef.current;
    if (!arena) return;

    const loop = () => {
      // Only update if there are farts
      if (fartsRef.current.length > 0) {
        const box = arena.getBoundingClientRect();
        const maxX = box.width - 60;
        const maxY = box.height - 60;
        const updated = fartsRef.current.map((f) => {
          const { x, y, vx, vy } = f; // Use const
          let newVx = vx, newVy = vy;
          if (x + vx < 0 || x + vx > maxX) newVx *= -1;
          if (y + vy < 0 || y + vy > maxY) newVy *= -1;
          return { ...f, x: x + newVx, y: y + newVy, vx: newVx, vy: newVy };
        });
        fartsRef.current = updated;
        setFarts(updated);
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [started, countdown]);

  useEffect(() => {
    if (timeLeft === 0) {
      addScore(scoreRef.current);
      setTimeout(() => setStep(2), 1_200);
    }
  }, [timeLeft, addScore, setStep]);

  const handleDrop = (id: number, elem: HTMLElement) => {
    const fartBox = elem.getBoundingClientRect();
    const winBox = windowRef.current!.getBoundingClientRect();
    const inside = isInside(fartBox, winBox);

    if (inside) {
      setFarts((arr) => arr.filter((f) => f.id !== id));
      scoreRef.current += 1;
    }

    setIsDraggingOverWindow(false);
  };

  return (
    <div
      className="relative w-full max-w-3xl h-[420px] bg-lavender-light border-4 border-lavender-dark rounded-xl overflow-hidden"
      ref={arenaRef}
    >
      {/* Help button */}
      <button
        onClick={() => setShowHelp(true)}
        className="absolute top-3 left-3 text-2xl text-lavender-night"
      >
        <FaQuestionCircle />
      </button>

      {/* Kaitlyn photo */}
      <motion.img
        src="/kaitlyn.png"
        alt="Kaitlyn"
        className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full object-cover"
      />

      {/* Help overlay */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-6 text-center space-y-4 z-20"
        >
          <h2 className="text-3xl font-bold mb-2">How to play</h2>
          <p className="max-w-md">
            Drag Kaitlyn&apos;s <span className="text-4xl">💨</span> farts into the window
            <span className="text-4xl"> 🪟</span> before they gas up the entire room!
            <br />
            You have <b>{GAME_TIME} seconds</b>. Each fart you eject = +1 point.
          </p>
          <button onClick={() => setShowHelp(false)} className="btn-choice !px-8 !py-3 text-lg">
            Got it 💪
          </button>
        </motion.div>
      )}

      {/* Window target */}
      <motion.div
        ref={windowRef}
        id="window-target"
        className={`absolute right-6 top-1/2 -translate-y-1/2 w-36 h-48 border-4 rounded-md flex items-center justify-center text-8xl transition-all duration-300 ${
          isDraggingOverWindow
            ? "bg-purple-300 border-purple-500 scale-125"
            : "bg-blue-200 border-blue-400 scale-100"
        }`}
      >
        🪟
      </motion.div>

      {/* HUD */}
      {started && countdown === 0 && (
        <div className="absolute top-2 inset-x-0 flex justify-center gap-6 font-bold text-lavender-night z-10">
          <span>⏰ {timeLeft}s</span>
          <span>💨 {scoreRef.current}</span>
        </div>
      )}

      {/* Farts */}
      {farts.map((f) => (
        <motion.div
          key={f.id}
          drag
          dragMomentum={false}
          className="absolute text-6xl select-none cursor-grab active:cursor-grabbing"
          style={{ left: f.x, top: f.y }}
          onDrag={(e) => {
            const elem = e.target as HTMLElement;
            const fartBox = elem.getBoundingClientRect();
            const winBox  = windowRef.current!.getBoundingClientRect();
            const inWin   = isInside(fartBox, winBox);

          if (inWin !== isDraggingOverWindow) {
            setIsDraggingOverWindow(inWin);
          }

          }}

          onDragEnd={(e) => handleDrop(f.id, e.target as HTMLElement)}
        >
          💨
          <audio src={f.sound} autoPlay />
        </motion.div>
      ))}
      {/* Start/Countdown overlays */}
      {!started && !showHelp && (
        <button
          onClick={() => setStarted(true)}
          className="absolute inset-0 bg-black/40 text-white flex items-center justify-center text-4xl font-bold z-10"
        >
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
          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-6xl font-extrabold z-10"
        >
          {countdown}
        </motion.div>
      )}
      {timeLeft === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-5xl font-extrabold z-10"
        >
          Time&apos;s up!
        </motion.div>
      )}
    </div>
  );
}