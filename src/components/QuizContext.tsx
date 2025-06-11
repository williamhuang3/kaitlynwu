// src/components/QuizContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type QuizCtx = {
  step: number;
  setStep: (n: number) => void;
  score: number;
  addScore: (n: number) => void;
};

const Ctx = createContext<QuizCtx | null>(null);

export function useQuiz() {
  return useContext(Ctx)!;
}

export default function QuizProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const addScore = (n: number) => setScore((s) => s + n);

  return <Ctx.Provider value={{ step, setStep, score, addScore }}>{children}</Ctx.Provider>;
}
