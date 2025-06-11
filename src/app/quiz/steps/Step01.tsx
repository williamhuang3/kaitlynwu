"use client";
import { useRef, useState } from "react";
import { useQuiz } from "@/components/QuizContext";

type QuizQ = {
    question: string;
    optionA: string;
    optionB: string;
    correct?: "A" | "B";
};

const questions: QuizQ[] = [
  {
    question: "Who said 'I love you' first?",
    optionA: "Me",
    optionB: "You",
    correct: "A",
  },
  {
    question: "What day did we start dating?",
    optionA: "June 10",
    optionB: "June 11",
    correct: "B",
  },
  {
    question: "Who is more likely to cry at a movie?",
    optionA: "Me",
    optionB: "You",
    correct: "B",
  },
  {
    question: "Which food do I like more?",
    optionA: "Lomo Saltado 🍽️",
    optionB: "Philly Cheesesteak 🥖",
    correct: "B",
  },
  {
    question: "Who is the better cook?",
    optionA: "Me",
    optionB: "You",
    correct: "A",
  },
  {
    question: "What's my favorite movie?",
    optionA: "Jurassic Park",
    optionB: "Good Will Hunting",
    correct: "B",
  },
  {
    question: "What's my chinese zodiac sign?",
    optionA: "Snake 🐍",
    optionB: "Sheep 🐑",
    correct: "B",
  },
  {
    question: "What is the correct term for 🍕?",
    optionA: "Pizza",
    optionB: "PICHA",
    correct: "B",
  },
  {
    question: "What is the correct term for cuddles?",
    optionA: "LE CARDLE",
    optionB: "cado waddles",
    correct: "A",
  },
  
];

export default function Step01() {
    const { addScore, setStep } = useQuiz();
    const [current, setCurrent] = useState(0);
    const [feedback, setFeedback] = useState<null | "correct" | "wrong">(null);

    const q = questions[current];

    const audioRef = useRef<HTMLAudioElement>(null); // add this

    const handlePick = (choice: "A" | "B") => {
        const isCorrect = q.correct && choice === q.correct;
        if (isCorrect) addScore(1);
        else audioRef.current?.play(); // 🔊 play sound if wrong

        setFeedback(isCorrect ? "correct" : "wrong");

        setTimeout(() => {
            setFeedback(null);
            if (current + 1 < questions.length) {
                setCurrent(current + 1);
            } else {
                setStep(1);
            }
        }, 600);
    };

    return (
        <div className="max-w-xl text-center space-y-6 px-4 relative">
            {/* Feedback Overlay */}
            {feedback && (
                <div
                    className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
                        feedback === "correct"
                            ? "bg-green-400/60"
                            : "bg-red-400/60"
                    }`}
                >
                    <span className="text-8xl">
                        {feedback === "correct" ? "✔️" : "❌"}
                    </span>
                </div>
            )}

            <h2 className="text-2xl sm:text-3xl font-bold text-lavender-deep">
                {q.question}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => handlePick("A")} className="btn-choice" disabled={!!feedback}>
                    {q.optionA}
                </button>
                <button onClick={() => handlePick("B")} className="btn-choice" disabled={!!feedback}>
                    {q.optionB}
                </button>
            </div>
            <p className="text-sm text-gray-500">
                {current + 1} / {questions.length}
            </p>
            <audio ref={audioRef} src="/laugh.mp3" preload="auto" />
        </div>
    );
}
