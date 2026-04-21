"use client";

import { motion } from "motion/react";

export function QuizProgress({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / total) * 100;
  const markers = Array.from({ length: total - 1 }, (_, i) => ((i + 1) / total) * 100);

  return (
    <div className="relative h-1" style={{ background: "#0e0e0e" }}>
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{ background: "#a020f0", boxShadow: "0 0 15px rgba(160,32,240,0.5)" }}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
      {markers.map((pos) => (
        <div
          key={pos}
          className="absolute top-0 w-px h-3 -mt-1"
          style={{ left: `${pos}%`, background: "#2a2a2a" }}
        />
      ))}
    </div>
  );
}
