"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Props {
  mode: "signup" | "login";
}

export function AuthForm({ mode }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage("A confirmation has been sent to your address. Return when ready.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        router.push("/app");
        router.refresh();
      }
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "#050505" }}
    >
      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] paper-grain"
        aria-hidden
      />

      {/* Purple ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%, rgba(160,32,240,0.06) 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <div className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-3"
            style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
          >
            Soul Society / Authentication
          </p>
          <h1
            className="text-4xl font-black text-white"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            {mode === "signup" ? "Begin the Trial" : "Return to the Inner World"}
          </h1>
        </div>

        {/* Confirmation */}
        {message && (
          <div
            className="mb-6 p-4 border-l-2 border-[#a020f0]"
            style={{ background: "rgba(160,32,240,0.08)" }}
          >
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "#d1c1d7" }}
            >
              {message}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label
              className="block text-xs uppercase tracking-[0.15em] mb-2"
              style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
            >
              Soul Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pb-2 pt-1 text-sm text-white placeholder:text-[#4e4355] focus:outline-none transition-colors"
              style={{
                background: "transparent",
                borderBottom: "2px solid #a020f0",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs uppercase tracking-[0.15em] mb-2"
              style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
            >
              Spirit Key
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pb-2 pt-1 text-sm text-white placeholder:text-[#4e4355] focus:outline-none transition-colors"
              style={{
                background: "transparent",
                borderBottom: "2px solid #a020f0",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="border-l-2 border-[#93000a] pl-3">
              <p className="text-sm" style={{ color: "#ffb4ab", fontFamily: "var(--font-body)" }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-sm font-bold uppercase tracking-widest text-[#f9e8ff] transition-all duration-300 disabled:opacity-40"
            style={{
              background: "#a020f0",
              fontFamily: "var(--font-body)",
              boxShadow: loading ? "none" : "0 0 15px rgba(160,32,240,0.3)",
            }}
          >
            {loading ? "Reading your soul…" : mode === "signup" ? "Create Account" : "Enter"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px" style={{ background: "rgba(78,67,85,0.5)" }} />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "#4e4355", fontFamily: "var(--font-body)" }}
          >
            or
          </span>
          <div className="flex-1 h-px" style={{ background: "rgba(78,67,85,0.5)" }} />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full py-3 text-sm tracking-widest uppercase transition-all duration-300"
          style={{
            fontFamily: "var(--font-body)",
            color: "#9a8ca0",
            border: "1px solid rgba(78,67,85,0.4)",
            background: "transparent",
          }}
        >
          Continue with Google
        </button>

        {/* Switch */}
        <p
          className="mt-6 text-center text-xs"
          style={{ color: "#4e4355", fontFamily: "var(--font-body)" }}
        >
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <Link href="/auth/login" className="transition-colors" style={{ color: "#a020f0" }}>
                Sign in
              </Link>
            </>
          ) : (
            <>
              No account?{" "}
              <Link href="/auth/signup" className="transition-colors" style={{ color: "#a020f0" }}>
                Begin the trial
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
