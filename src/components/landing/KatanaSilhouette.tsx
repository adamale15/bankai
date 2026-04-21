"use client";

import { motion } from "motion/react";

export function KatanaSilhouette() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="relative flex items-center justify-center"
    >
      {/* Spirit glow behind blade */}
      <div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)" }}
      />

      <svg
        width="36"
        height="260"
        viewBox="0 0 36 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: "drop-shadow(0 0 14px rgba(124,58,237,0.7))" }}
      >
        <defs>
          <linearGradient id="bladeGrad" x1="18" y1="4" x2="18" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="30%" stopColor="#c4b5fd" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
          <linearGradient id="hiltGrad" x1="18" y1="198" x2="18" y2="255" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2e1a4a" />
            <stop offset="100%" stopColor="#130d1e" />
          </linearGradient>
        </defs>

        {/* Blade — slightly curved, tapers to point */}
        <path
          d="M18 4 L21 170 L18 182 L15 170 Z"
          fill="url(#bladeGrad)"
        />

        {/* Blade edge gleam */}
        <motion.line
          x1="19.5" y1="10" x2="20.5" y2="165"
          stroke="white"
          strokeWidth="0.5"
          strokeOpacity="0.4"
          animate={{ strokeOpacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tip gleam */}
        <motion.ellipse
          cx="18" cy="6" rx="1.5" ry="3"
          fill="white"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Tsuba (guard) — octagonal, purple */}
        <path
          d="M6 183 L10 179 L26 179 L30 183 L30 187 L26 191 L10 191 L6 187 Z"
          fill="#7c3aed"
          fillOpacity="0.85"
        />
        <path
          d="M6 183 L10 179 L26 179 L30 183 L30 187 L26 191 L10 191 L6 187 Z"
          stroke="#c4b5fd"
          strokeWidth="0.5"
          strokeOpacity="0.5"
          fill="none"
        />

        {/* Hilt */}
        <rect x="15" y="191" width="6" height="58" rx="1" fill="url(#hiltGrad)" />
        {/* Hilt wrap lines */}
        <line x1="15" y1="202" x2="21" y2="202" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="15" y1="212" x2="21" y2="212" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="15" y1="222" x2="21" y2="222" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="15" y1="232" x2="21" y2="232" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />
        <line x1="15" y1="242" x2="21" y2="242" stroke="#8b5cf6" strokeWidth="0.5" strokeOpacity="0.4" />

        {/* Pommel */}
        <ellipse cx="18" cy="251" rx="4" ry="2.5" fill="#7c3aed" fillOpacity="0.6" />
      </svg>
    </motion.div>
  );
}
