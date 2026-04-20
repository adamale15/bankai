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
        setMessage("Check your email to confirm your account.");
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
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <p className="text-xs tracking-[0.3em] uppercase text-indigo-400/70">Soul Society</p>
          <h1 className="text-2xl font-bold text-white">
            {mode === "signup" ? "Begin the Trial" : "Return to the Inner World"}
          </h1>
        </div>

        {message && (
          <p className="text-sm text-indigo-300 text-center border border-indigo-800 rounded p-3 bg-indigo-950/40">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded border border-indigo-500/50 bg-indigo-950/60 py-2.5 text-sm font-semibold uppercase tracking-widest text-indigo-200 transition hover:bg-indigo-900/60 disabled:opacity-50"
          >
            {loading ? "..." : mode === "signup" ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="relative flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <span className="text-xs text-zinc-600">or</span>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full rounded border border-zinc-700 bg-zinc-950 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-900"
        >
          Continue with Google
        </button>

        <p className="text-center text-xs text-zinc-600">
          {mode === "signup" ? (
            <>Already have an account?{" "}
              <Link href="/auth/login" className="text-indigo-400 hover:underline">Sign in</Link>
            </>
          ) : (
            <>No account?{" "}
              <Link href="/auth/signup" className="text-indigo-400 hover:underline">Begin the trial</Link>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
