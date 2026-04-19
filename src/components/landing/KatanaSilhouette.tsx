"use client";

import { motion } from "motion/react";

export function KatanaSilhouette() {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative"
    >
      <svg
        width="48"
        height="220"
        viewBox="0 0 48 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_18px_rgba(99,102,241,0.6)]"
      >
        {/* Blade */}
        <path
          d="M24 8 L28 160 L24 170 L20 160 Z"
          fill="url(#bladeGradient)"
        />
        {/* Guard (tsuba) */}
        <ellipse cx="24" cy="168" rx="14" ry="4" fill="#4f46e5" opacity="0.8" />
        {/* Hilt */}
        <rect x="21" y="172" width="6" height="40" rx="2" fill="#312e81" />
        {/* Tip gleam */}
        <ellipse cx="24" cy="10" rx="2" ry="4" fill="white" opacity="0.6" />
        <defs>
          <linearGradient id="bladeGradient" x1="24" y1="8" x2="24" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="60%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  );
}
