"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { Question } from "@/lib/quiz/questions";

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X"];

const OPTION_ACCENTS = [
  { color: "#a020f0", border: "rgba(160,32,240,0.4)", glow: "rgba(160,32,240,0.1)" },
  { color: "#00fbfb", border: "rgba(0,251,251,0.4)",   glow: "rgba(0,251,251,0.1)"   },
  { color: "#ffb4ab", border: "rgba(255,180,171,0.4)", glow: "rgba(255,180,171,0.1)" },
  { color: "#ffb86e", border: "rgba(255,184,110,0.4)", glow: "rgba(255,184,110,0.1)" },
  { color: "#a020f0", border: "rgba(160,32,240,0.4)", glow: "rgba(160,32,240,0.1)" },
  { color: "#00fbfb", border: "rgba(0,251,251,0.4)",   glow: "rgba(0,251,251,0.1)"   },
  { color: "#ffb4ab", border: "rgba(255,180,171,0.4)", glow: "rgba(255,180,171,0.1)" },
  { color: "#ffb86e", border: "rgba(255,184,110,0.4)", glow: "rgba(255,184,110,0.1)" },
];

const HIGHLIGHT_COLORS: Record<string, string> = {
  error: "#ffb4ab",
  primary: "#a020f0",
  tertiary: "#ffb86e",
  secondary: "#00fbfb",
};

function renderHighlighted(text: string, highlights?: { text: string; color: string }[]) {
  if (!highlights?.length) return <>{text}</>;

  const parts: { text: string; color?: string }[] = [];
  let remaining = text;

  highlights.forEach(({ text: match, color }) => {
    const idx = remaining.indexOf(match);
    if (idx === -1) return;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx) });
    parts.push({ text: match, color: HIGHLIGHT_COLORS[color] ?? color });
    remaining = remaining.slice(idx + match.length);
  });
  if (remaining) parts.push({ text: remaining });

  return (
    <>
      {parts.map((p, i) =>
        p.color ? (
          <span key={i} style={{ color: p.color }}>{p.text}</span>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export function QuestionCard({
  question,
  trialNumber,
  onAnswer,
}: {
  question: Question;
  trialNumber: number;
  onAnswer: (optionId: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleSelect(id: string) {
    if (selected) return;
    setSelected(id);
    setTimeout(() => onAnswer(id), 350);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-7xl h-full items-center overflow-hidden"
    >
      {/* ── Left: Question ─────────────────────────── */}
      <div className="col-span-1 lg:col-span-5 flex flex-col justify-center h-full pr-0 lg:pr-12 relative">

        {/* Vertical accent line */}
        <div
          className="hidden lg:block absolute left-0 top-1/4 w-[2px]"
          style={{
            height: "50%",
            background: "linear-gradient(to bottom, transparent, rgba(227,181,255,0.2), transparent)",
          }}
        />

        {/* Question number label */}
        <div
          className="text-sm tracking-[0.2em] mb-4 flex items-center gap-3"
          style={{ fontFamily: "var(--font-body)", color: "#00fbfb" }}
        >
          <span className="w-8 inline-block h-px" style={{ background: "#00fbfb" }} />
          QUESTION {ROMAN[trialNumber - 1] ?? trialNumber}
        </div>

        {/* Question text with highlights */}
        <h1
          className="text-2xl lg:text-3xl xl:text-4xl leading-tight mb-5"
          style={{
            fontFamily: "var(--font-headline)",
            color: "#e5e2e1",
            letterSpacing: "-0.02em",
          }}
        >
          {renderHighlighted(question.text, question.highlights)}
        </h1>

        {/* Subtext / lore description */}
        {question.subtext && (
          <p
            className="text-sm lg:text-base leading-relaxed max-w-md font-light"
            style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
          >
            {question.subtext}
          </p>
        )}
      </div>

      {/* ── Right: Options ─────────────────────────── */}
      <div className={`col-span-1 lg:col-span-7 grid gap-2 lg:gap-3 ${question.options.length > 4 ? "grid-cols-2" : "grid-cols-1"}`}>
        {question.options.map((option, i) => {
          const isSelected = selected === option.id;
          const accent = OPTION_ACCENTS[i];
          const letter = String.fromCharCode(65 + i);
          const manyOptions = question.options.length > 4;

          return (
            <motion.button
              key={option.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: selected && !isSelected ? 0.35 : 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => handleSelect(option.id)}
              disabled={!!selected}
              className="group relative w-full text-left overflow-hidden p-1 transition-all duration-300"
              style={{
                background: isSelected ? "#201f1f" : "#1c1b1b",
                border: `1px solid ${isSelected ? accent.border : "rgba(78,67,85,0.15)"}`,
              }}
            >
              {/* Inner glow on selected */}
              <div
                className="absolute inset-0 pointer-events-none transition-all duration-300"
                style={{
                  boxShadow: isSelected
                    ? `inset 4px 0 20px 0 ${accent.glow}`
                    : "none",
                }}
              />

              {/* Left accent bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300"
                style={{ background: isSelected ? accent.color : "transparent" }}
              />

              <div className={`relative z-10 flex items-start gap-3 ${manyOptions ? "p-3 lg:p-4" : "p-4 lg:p-5"}`}>
                {/* Letter */}
                <div
                  className="text-xl shrink-0 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-headline)",
                    color: isSelected ? accent.color : "#353534",
                  }}
                >
                  {letter}
                </div>

                <div>
                  <h3
                    className={`tracking-tight transition-colors duration-300 ${manyOptions ? "text-sm lg:text-base mb-1" : "text-base lg:text-lg mb-1"}`}
                    style={{
                      fontFamily: "var(--font-headline)",
                      color: isSelected ? accent.color : "#e5e2e1",
                    }}
                  >
                    {option.text}
                  </h3>
                  {option.subtext && !manyOptions && (
                    <p
                      className="text-xs leading-relaxed transition-colors duration-300"
                      style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                    >
                      {option.subtext}
                    </p>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
