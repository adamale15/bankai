"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ZanpakutoData } from "@/lib/forging/blade-map";
import { ForgeReveal } from "./ForgeReveal";

const FORGE_LINES = [
  "Analyzing soul vector…",
  "Binding element to form…",
  "Crystallizing spirit…",
  "Your Zanpakuto takes shape…",
];

function ForgingScreen() {
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setLineIndex((i) => (i < FORGE_LINES.length - 1 ? i + 1 : i));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Pulsing glow orb */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(160,32,240,0.4) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Rotating ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute pointer-events-none"
        style={{
          width: 200,
          height: 200,
          border: "1px solid rgba(160,32,240,0.3)",
          borderTop: "1px solid #a020f0",
        }}
        aria-hidden
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute pointer-events-none"
        style={{
          width: 280,
          height: 280,
          border: "1px solid rgba(160,32,240,0.15)",
          borderBottom: "1px solid rgba(160,32,240,0.4)",
        }}
        aria-hidden
      />

      <div className="relative z-10 text-center space-y-6">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-xs uppercase tracking-[0.3em]"
          style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
        >
          ——&nbsp; Forging in progress &nbsp;——
        </motion.p>

        <h1
          className="text-4xl font-black"
          style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
        >
          The spirit awakens
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="text-base"
            style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
          >
            {FORGE_LINES[lineIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{ background: "#050505" }}
    >
      <div className="text-center space-y-4 max-w-xs px-6">
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ fontFamily: "var(--font-body)", color: "#93000a" }}
        >
          ——&nbsp; The Senkaimon is closed &nbsp;——
        </p>
        <p className="text-sm" style={{ color: "#9a8ca0", fontFamily: "var(--font-body)" }}>
          Something disrupted the manifestation. The spirit retreated.
        </p>
        <button
          onClick={onRetry}
          className="text-xs uppercase tracking-widest transition-colors hover:text-white"
          style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}

type Phase = "forging" | "reveal" | "error";

export function ForgeClient({ initial }: { initial: ZanpakutoData | null }) {
  const [phase, setPhase] = useState<Phase>(initial ? "reveal" : "forging");
  const [zanpakuto, setZanpakuto] = useState<ZanpakutoData | null>(initial);

  async function forge() {
    setPhase("forging");
    try {
      const res = await fetch("/api/forge", { method: "POST" });
      if (!res.ok) throw new Error();
      const json = await res.json() as { zanpakuto: ZanpakutoData };
      setZanpakuto(json.zanpakuto);
      // Brief hold on forging screen so the animation breathes
      setTimeout(() => setPhase("reveal"), 800);
    } catch {
      setPhase("error");
    }
  }

  useEffect(() => {
    if (!initial) forge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "forging" && (
        <motion.div key="forging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ForgingScreen />
        </motion.div>
      )}
      {phase === "reveal" && zanpakuto && (
        <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <ForgeReveal zanpakuto={zanpakuto} />
        </motion.div>
      )}
      {phase === "error" && (
        <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <ErrorScreen onRetry={forge} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
