import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col m-0 p-0 overflow-hidden"
      style={{ background: "#050505", color: "#e5e2e1" }}
    >
      <main className="grow flex flex-col justify-center items-center relative w-full h-screen">

        {/* Layer 1: Katana silhouette — matches Stitch exactly */}
        <div
          className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
          style={{
            opacity: 0.4,
            mixBlendMode: "screen",
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA9yyc9J4KSHCHpom3pWF22JNPQ3oQmuUaJVcQ0EHKFXhABlwst94DuzHiwIaUQg-AhFpkygyVo-dBeR_EptuONkN4cmYuO_d_mhgUhavfuqbhnHjQDX0kGAGgMj3czWy-Uw6MG7N5_E0ROCpaVs04gafLLmqCoNRe9tOIIKqrztJ04vtHHGE8dLZmBjSp2vRA8kmLIY0IFonA_-qUNojoQZE3m5fswbzEX2J9D5G04bEldAP02n-5fl6bWZZtM2W8nPsKkdWU-dJvx')",
          }}
          aria-hidden
        />

        {/* Layer 2: Ink splatter overlay — matches Stitch exactly */}
        <div
          className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{
            opacity: 0.2,
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeLRUtjwm7_wcZ2N3yirjBVZZ9iyVRe95V8_rabFP1GqP7PDVHkeuzeRcZTj4hMMEUfqFaH0H_mqPXLWrPDyvArcnHJAIXzrqIqLYZsnIeUvJ8JsgCquKPwedeifmGXiqTwZBJdTwoDeZ0UeZg5DT2b0MBSO2PVE0mMl9OjMJKcgMJuRtSx388hvDTFrXMwT4SsJERjSS2nm6ikiIzO51PzmmRg_iXDT7Pzy3Ofjrzs4PwR9g3R1pJNjA-dcg3aFD1Ndy7kieSPFen')",
          }}
          aria-hidden
        />

        {/* Ambient bottom gradient */}
        <div
          className="absolute bottom-0 left-0 w-full h-32 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, #050505, transparent)" }}
        />

        {/* Central content */}
        <div className="z-20 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 relative px-6">

          {/* Left: Ambient atmosphere */}
          <div className="hidden md:flex flex-col items-end gap-4 text-right">
            <p
              className="text-xs uppercase tracking-[0.2em] opacity-50"
              style={{ fontFamily: "var(--font-body)", color: "#ffffff" }}
            >
              Division 13 / Sector 4
            </p>
            <div className="w-12 h-px bg-white opacity-30" />
            <p
              className="text-lg italic opacity-70"
              style={{ fontFamily: "var(--font-headline)", color: "#ffffff" }}
            >
              &ldquo;The void is not empty.&rdquo;
            </p>
          </div>

          {/* Center: Vertical AWAKEN calligraphy */}
          <div className="flex flex-col items-center">
            <h1
              className="font-black text-6xl md:text-9xl tracking-[-0.05em] vertical-rl flex items-center justify-center"
              style={{
                fontFamily: "var(--font-headline)",
                color: "#a020f0",
                height: "512px",
                filter: "drop-shadow(0 0 20px rgba(160,32,240,0.4))",
                textShadow: "2px 2px 0px #050505, -2px -2px 0px #050505",
              }}
            >
              AWAKEN
            </h1>
          </div>

          {/* Right: Glass action card */}
          <div className="flex flex-col items-start gap-8 mt-12 md:mt-0">
            <div
              className="glass-panel p-6 border-l-2 border-[#a020f0] min-w-[280px]"
            >
              <h2
                className="text-xl mb-2 text-white"
                style={{ fontFamily: "var(--font-headline)" }}
              >
                The Spiritual Razor
              </h2>
              <p
                className="text-sm mb-6 leading-relaxed"
                style={{ fontFamily: "var(--font-body)", color: "#d1c1d7" }}
              >
                Cross the threshold. Your Zanpakuto awaits its true name.
              </p>
              <Link
                href="/auth/signup"
                className="w-full relative overflow-hidden flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-widest py-4 px-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(160,32,240,0.6)]"
                style={{
                  fontFamily: "var(--font-body)",
                  background: "#a020f0",
                  color: "#f9e8ff",
                  boxShadow: "0 0 15px rgba(160,32,240,0.3)",
                }}
              >
                Begin the Trial
                <span aria-hidden className="ml-1">→</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 cursor-pointer group">
              <span
                className="text-2xl"
                style={{ color: "#4e4355" }}
                aria-hidden
              >
                ▶
              </span>
              <span
                className="text-xs uppercase tracking-widest transition-all border-b border-transparent group-hover:border-white group-hover:text-white"
                style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
              >
                Watch Prologue
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
