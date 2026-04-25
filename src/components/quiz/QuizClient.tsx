"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { QUESTIONS } from "@/lib/quiz/questions";
import { QuizProgress } from "./QuizProgress";
import { QuestionCard } from "./QuestionCard";

type Phase = "quiz" | "submitting" | "error";
type Answer = { questionId: string; optionId: string };

const NAV_ITEMS: { label: string; href: string }[] = [
  { label: "Soul",    href: "/app/quiz"    },
  { label: "Forge",   href: "/app/forge"   },
  { label: "Arsenal", href: "/app"         },
  { label: "Sanctum", href: "/app/sanctum" },
];

function SubmittingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#131313" }}>
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="text-center space-y-4"
      >
        <p className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}>
          ——&nbsp; Reading complete &nbsp;——
        </p>
        <p className="text-3xl font-black text-white" style={{ fontFamily: "var(--font-headline)" }}>
          The spirits are gathering…
        </p>
      </motion.div>
    </div>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#131313" }}>
      <div className="text-center space-y-4 max-w-xs">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ fontFamily: "var(--font-body)", color: "#93000a" }}>
          ——&nbsp; The Senkaimon is closed &nbsp;——
        </p>
        <p className="text-sm" style={{ color: "#9a8ca0", fontFamily: "var(--font-body)" }}>
          Something disrupted the reading.
        </p>
        <div className="flex flex-col gap-3 items-center pt-2">
          <button
            onClick={onRetry}
            className="text-xs uppercase tracking-widest transition-colors hover:text-white"
            style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
          >
            Try again
          </button>
          <Link
            href="/app"
            className="text-xs uppercase tracking-widest transition-colors hover:text-white"
            style={{ fontFamily: "var(--font-body)", color: "#4e4355", textDecoration: "none" }}
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function QuizClient() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [phase, setPhase] = useState<Phase>("quiz");

  async function submit(finalAnswers: Answer[]) {
    setPhase("submitting");
    try {
      const res = await fetch("/api/quiz/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      if (!res.ok) throw new Error();
      window.location.href = "/app";
    } catch {
      setPhase("error");
    }
  }

  function handleAnswer(optionId: string) {
    const newAnswers = [...answers, { questionId: QUESTIONS[currentIndex].id, optionId }];
    setAnswers(newAnswers);
    if (currentIndex < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), optionId === "skip" ? 0 : 400);
    } else {
      setTimeout(() => submit(newAnswers), optionId === "skip" ? 0 : 400);
    }
  }

  if (phase === "submitting") return <SubmittingScreen />;
  if (phase === "error") return <ErrorScreen onRetry={() => setPhase("quiz")} />;

  const qNum = String(currentIndex + 1).padStart(2, "0");
  const qTotal = String(QUESTIONS.length).padStart(2, "0");

  return (
    <div className="h-screen overflow-hidden flex flex-col" style={{ background: "#131313" }}>

      {/* ── Top Nav — matches Stitch HTML exactly ── */}
      <header
        className="hidden md:flex justify-between items-center w-full px-12 py-6 z-50 relative"
        style={{ background: "#050505", boxShadow: "0px 20px 40px rgba(255,255,255,0.04)" }}
      >
        <nav className="flex gap-8 items-center">
          {NAV_ITEMS.map((item) => {
            const active = item.label === "Soul";
            return (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm uppercase transition-colors duration-300 hover:text-white"
                style={{
                  fontFamily: "var(--font-headline)",
                  letterSpacing: "-0.02em",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#a020f0" : "rgba(255,255,255,0.5)",
                  borderBottom: active ? "2px solid #a020f0" : "none",
                  paddingBottom: active ? "4px" : "0",
                  textDecoration: "none",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Brand — centered absolutely */}
        <div
          className="absolute left-1/2 -translate-x-1/2 font-black text-2xl"
          style={{ fontFamily: "var(--font-headline)", letterSpacing: "-0.05em", color: "#a020f0" }}
        >
          ZANPAKUTO FORGE
        </div>

        <div className="flex gap-1 items-center" style={{ color: "#a020f0" }}>
          <button className="p-2 transition-colors hover:bg-[#a020f0]/10" aria-label="Account">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
          <button className="p-2 transition-colors hover:bg-[#a020f0]/10" aria-label="Notifications">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </button>
        </div>
      </header>

      {/* ── Progress bar ── */}
      <QuizProgress current={currentIndex + 1} total={QUESTIONS.length} />

      {/* ── Paper grain texture ── */}
      <div
        className="pointer-events-none fixed inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      {/* ── Question area ── */}
      <div className="grow flex items-center justify-center p-6 lg:p-12 z-10 relative">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentIndex}
            question={QUESTIONS[currentIndex]}
            trialNumber={currentIndex + 1}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>
      </div>

      {/* ── Footer nav — matches Stitch HTML exactly ── */}
      <div
        className="w-full flex justify-between items-center p-6 lg:px-12 mt-auto z-10 relative"
        style={{
          background: "#0e0e0e",
          borderTop: "1px solid rgba(78,67,85,0.1)",
        }}
      >
        <button
          className="flex items-center gap-2 text-sm tracking-widest uppercase transition-colors hover:text-[#e5e2e1]"
          style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
          onClick={() => currentIndex > 0 && setCurrentIndex((i) => i - 1)}
          disabled={currentIndex === 0}
        >
          ‹ Previous
        </button>

        <span style={{ fontFamily: "var(--font-headline)", color: "#353534" }}>
          {qNum} / {qTotal}
        </span>

        <button
          className="flex items-center gap-2 text-sm tracking-widest uppercase transition-colors"
          style={{ fontFamily: "var(--font-body)", color: "#e3b5ff" }}
          onClick={() => handleAnswer("skip")}
        >
          Skip ›
        </button>
      </div>
    </div>
  );
}
