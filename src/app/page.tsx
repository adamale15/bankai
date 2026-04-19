import Link from "next/link";
import { KatanaSilhouette } from "@/components/landing/KatanaSilhouette";

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        <KatanaSilhouette />

        <div className="space-y-3">
          <p className="text-xs tracking-[0.4em] uppercase text-indigo-400/80">
            Soul Society — Classification: Unknown
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
            Every soul carries a blade.
          </h1>
          <p className="text-lg text-zinc-400 max-w-md mx-auto">
            Find yours.
          </p>
        </div>

        <Link
          href="/auth/signup"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-indigo-500/50 bg-indigo-950/60 px-8 py-3 text-sm font-semibold tracking-widest uppercase text-indigo-200 shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-900/60 hover:border-indigo-400 active:scale-95"
        >
          Begin the Trial
        </Link>

        <p className="text-xs text-zinc-600 max-w-xs">
          Answer the soul reading. Your Zanpakuto spirit is waiting.
        </p>
      </div>
    </main>
  );
}
