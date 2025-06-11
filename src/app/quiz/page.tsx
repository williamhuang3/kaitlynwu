// app/quiz/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import QuizProvider, { useQuiz } from "@/components/QuizContext";
import ProgressBar from "./ProgressBar";
import StepIntermission from "./StepIntermission";
import { motion } from "framer-motion";
import Image from "next/image";
import Step01 from "./steps/Step01";
import Step02 from "./steps/Step02";
import Step03 from "./steps/Step03";
import { useRouter } from "next/navigation";
const steps = [
  { title: "This‑or‑That", Component: Step01 },
  { title: "Fart Evacuation", Component: Step02 },
  { title: "Pancake Shooting", Component: Step03 },
  // add more steps here …
];

function VaultUnlock() {
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const [vaultHovered, setVaultHovered] = useState(false);
  const vaultRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-lavender-light to-lavender-night relative">
      <div className="flex flex-row items-end justify-center w-full h-full max-w-4xl mx-auto" style={{ minHeight: 500 }}>
        {/* General Tao and Key */}
        <div className="flex flex-col items-center mr-12 relative" style={{ width: 220 }}>
          {/* Shining key above General Tao */}
          <div
            draggable
            onDragStart={() => setDragging(true)}
            onDragEnd={e => {
              setDragging(false);
              const vault = vaultRef.current;
              if (!vault) return;
              const vaultRect = vault.getBoundingClientRect();
              const x = e.clientX;
              const y = e.clientY;
              if (
                x >= vaultRect.left &&
                x <= vaultRect.right &&
                y >= vaultRect.top &&
                y <= vaultRect.bottom
              ) {
                router.push("/love");
              }
            }}
            style={{
              cursor: dragging ? "grabbing" : "grab",
              position: "absolute",
              left: "50%",
              top: -40,
              transform: "translateX(-50%)",
              zIndex: 10,
              opacity: dragging ? 0.7 : 1,
              fontSize: 64,
              userSelect: "none",
              filter: "drop-shadow(0 0 16px gold) drop-shadow(0 0 32px #fff8) brightness(1.2)",
              transition: "filter 0.2s",
              animation: "shine 1.2s infinite alternate",
            }}
          >
            🗝️
            <style>{`
              @keyframes shine {
                0% { filter: drop-shadow(0 0 8px gold) drop-shadow(0 0 16px #fff8) brightness(1.1);}
                100% { filter: drop-shadow(0 0 24px gold) drop-shadow(0 0 48px #fff8) brightness(1.4);}
              }
            `}</style>
          </div>
          <Image src="/generaltao.png" alt="General Tao" width={180} height={180} className="drop-shadow-2xl mt-16" />
        </div>
        {/* Vault */}
        <div
          ref={vaultRef}
          className={`flex flex-col items-center justify-center rounded-xl border-8 border-gray-700 bg-gradient-to-br from-gray-300 to-gray-400 shadow-2xl`}
          style={{
            width: 260,
            height: 320,
            position: "relative",
            transition: "box-shadow 0.2s",
            boxShadow: vaultHovered ? "0 0 32px 8px #a78bfa" : "0 0 16px 2px #888",
          }}
          onDragOver={e => {
            e.preventDefault();
            setVaultHovered(true);
          }}
          onDragLeave={() => setVaultHovered(false)}
          onDrop={() => {
            setVaultHovered(false);
            router.push("/love");
          }}
        >
          <span style={{ fontSize: 120 }}>🧰</span>
          <div className="mt-4 text-xl font-bold text-gray-700">The Vault</div>
        </div>
      </div>
      {/* Prompt */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center">
        <div className="bg-white/80 rounded-lg px-8 py-4 text-2xl font-semibold text-lavender-night shadow-lg border border-lavender-dark">
          Drag the key from General Tao to the vault to unlock your treasure!
        </div>
      </div>
    </div>
  );
}

function QuizBody() {
  const [started, setStarted] = useState(false);
  const [showIntermission, setShowIntermission] = useState(false);
  const { step } = useQuiz();

  /* show intermission every time we advance (except before first step) */
  useEffect(() => {
    if (step > 0) setShowIntermission(true);
  }, [step]);

  // ----- Intro screen before quiz starts -----
  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lavender-night text-center px-4 text-white space-y-8">
        <Image
          src="/generaltao.png"
          alt="General Tao Tao"
          width={500}
          height={500}
          priority
          className="drop-shadow-2xl"
        />
        <h1 className="text-4xl font-extrabold max-w-lg leading-tight">
          Before we reach the hidden vault…
        </h1>
        <p className="text-lg max-w-md">
          <span className="font-semibold">General Tao&nbsp;Tao</span> demands you survive a series of trials!
          Prove your valor, and the treasure shall be yours.
        </p>
        <button
          className="px-8 py-3 bg-purple-500 rounded-lg text-white text-xl hover:bg-purple-600 transition shadow-lg"
          onClick={() => setStarted(true)}
        >
          Begin the Trials
        </button>
      </div>
    );
  }

  const total = steps.length;

  // Show vault unlock after last step
  if (step >= total) {
    return <VaultUnlock />;
  }

  // Prevent out-of-bounds access
  if (step >= total) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-lavender-light text-center px-4 text-lavender-night space-y-8">
        <h1 className="text-4xl font-extrabold">Quiz Complete!</h1>
        <p className="text-lg">You have finished all the trials.</p>
      </div>
    );
  }

  const currentStep = steps[step];
  const prevStep = steps[step - 1];
  const Component = currentStep.Component;

  return (
    <div className="min-h-screen flex flex-col bg-lavender-light">
      {/* Progress bar */}
      <div className="p-4">
        <ProgressBar current={step} total={total} />
      </div>

      {/* Intermission overlay */}
      {showIntermission && step > 0 && (
        <StepIntermission
          title={prevStep.title}
          step={step}
          total={total}
          onDone={() => setShowIntermission(false)}
        />
      )}


      {/* Current game */}
      <motion.div
        key={step}
        className="flex-1 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Component />
      </motion.div>
    </div>
  );
}

export default function Quiz() {
  return (
    <QuizProvider>
      <QuizBody />
    </QuizProvider>
  );
}