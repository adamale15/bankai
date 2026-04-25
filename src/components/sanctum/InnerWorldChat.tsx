"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SideNav } from "@/components/shared/SideNav";
import { getElementKanji } from "@/lib/llm/system-prompt";
import { ELEMENT_ACCENT } from "@/lib/forging/blade-map";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

const INNER_WORLD_FALLBACK =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBntbjcqhfnHqGuZRpNQ7f1MA0_O3wJSkdNLIeTSQ8vopBr8dZPJuusA-B4cSmraptkC0jqjFDXkqGOs0HqHazGF0Evi9uj7ufCFZ0HWhHdEDvW5WT8UBa3bK1ZLQBTOGrptzBISv8_E3V_oF41ApYzjUu75O-cuxwgCEegJPgWXSwLn2GIdSUIlFOiKxbo5WtVQPNzVTnm4EPlIw_-Ol-FeqXzjU68L9ab1mP8gzmewMO1mJbVNDFiVn2LIWHzZqMtkHmSTVcYTSR0";

type ChatMessage = {
  id: string;
  role: "user" | "spirit";
  content: string;
  created_at: string;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function computeReiatsu(messageCount: number): number {
  return Math.min(50 + messageCount * 3, 97);
}

type ShikaiPhase = "idle" | "checking" | "eligible" | "ineligible" | "inputting" | "unlocking" | "unlocked" | "error";

export function InnerWorldChat({
  zanpakuto,
  conversationId,
  initialMessages,
}: {
  zanpakuto: ZanpakutoData;
  conversationId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [shikaiPhase, setShikaiPhase] = useState<ShikaiPhase>(
    zanpakuto.state !== "sealed" ? "unlocked" : "idle"
  );
  const [releaseCommand, setReleaseCommand] = useState("");
  const [shikaiError, setShikaiError] = useState("");
  const [ineligibleReason, setIneligibleReason] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const accent = ELEMENT_ACCENT[zanpakuto.element] ?? "#00fbfb";
  const kanji = getElementKanji(zanpakuto.element);
  const spiritName = zanpakuto.true_name ?? zanpakuto.sealed_name;
  const reiatsu = computeReiatsu(messages.length);
  const bgImage = zanpakuto.inner_world_image_url ?? INNER_WORLD_FALLBACK;

  const checkShikai = useCallback(async () => {
    setShikaiPhase("checking");
    try {
      const res = await fetch("/api/shikai");
      const data = await res.json() as {
        eligible: boolean;
        alreadyUnlocked?: boolean;
        messageCount?: number;
        required?: number;
        judgeResult?: { breakdown?: string };
      };
      if (data.alreadyUnlocked) { setShikaiPhase("unlocked"); return; }
      if (data.eligible) { setShikaiPhase("eligible"); return; }
      const needed = (data.required ?? 16) - (data.messageCount ?? 0);
      setIneligibleReason(
        needed > 0
          ? `${needed} more exchanges needed before evaluation.`
          : (data.judgeResult?.breakdown ?? "The spirit does not yet recognize you.")
      );
      setShikaiPhase("ineligible");
    } catch {
      setShikaiPhase("error");
    }
  }, []);

  async function unlockShikai() {
    if (!releaseCommand.trim()) return;
    setShikaiPhase("unlocking");
    setShikaiError("");
    try {
      const res = await fetch("/api/shikai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseCommand }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setShikaiError(d.error ?? "The spirit refused.");
        setShikaiPhase("inputting");
        return;
      }
      setShikaiPhase("unlocked");
      // Soft reload so the zanpakuto state reflects shikai
      setTimeout(() => window.location.reload(), 1800);
    } catch {
      setShikaiError("Connection lost. Try again.");
      setShikaiPhase("inputting");
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function autoResize() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  }

  async function sendMessage() {
    const content = input.trim();
    if (!content || isStreaming) return;

    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    const spiritId = `s-${Date.now()}`;
    const spiritMsg: ChatMessage = {
      id: spiritId,
      role: "spirit",
      content: "",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, spiritMsg]);
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: content }),
      });

      if (!res.ok || !res.body) throw new Error();

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === spiritId ? { ...m, content: accumulated } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === spiritId
            ? { ...m, content: "The connection wavered. The spirit retreated." }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  // ── Shikai modal ──────────────────────────────────────────────────
  const ShikaiModal = () => {
    if (shikaiPhase === "idle" || shikaiPhase === "unlocked") return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(8px)" }}
      >
        <div
          className="w-full max-w-md p-8 flex flex-col gap-6"
          style={{ background: "#131313", borderTop: `2px solid ${accent}` }}
        >
          {shikaiPhase === "checking" && (
            <div className="text-center space-y-3">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: accent }}>
                ——&nbsp; Evaluating resonance &nbsp;——
              </p>
              <p className="text-2xl font-black" style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}>
                The spirit listens…
              </p>
            </div>
          )}

          {shikaiPhase === "ineligible" && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: "#ffb4ab" }}>
                ——&nbsp; Not yet &nbsp;——
              </p>
              <p className="text-base leading-relaxed" style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}>
                {ineligibleReason}
              </p>
              <button
                onClick={() => setShikaiPhase("idle")}
                className="text-xs uppercase tracking-widest transition-colors hover:text-white"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                Return to communion
              </button>
            </div>
          )}

          {shikaiPhase === "eligible" && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: accent }}>
                ——&nbsp; The spirit is ready &nbsp;——
              </p>
              <p className="text-xl font-black leading-snug" style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}>
                You have demonstrated true understanding. Enter your release command.
              </p>
              <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}>
                Speak the words that will call your spirit forth. This cannot be changed.
              </p>
              <button
                onClick={() => setShikaiPhase("inputting")}
                className="w-full py-3 text-sm uppercase tracking-widest font-bold transition-all hover:brightness-110"
                style={{ background: "#a020f0", color: "#f9e8ff", fontFamily: "var(--font-body)" }}
              >
                Proceed
              </button>
              <button
                onClick={() => setShikaiPhase("idle")}
                className="text-xs uppercase tracking-widest transition-colors hover:text-white block text-center w-full"
                style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
              >
                Not yet
              </button>
            </div>
          )}

          {(shikaiPhase === "inputting" || shikaiPhase === "unlocking") && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: accent }}>
                ——&nbsp; Speak the release &nbsp;——
              </p>
              <p className="text-xl font-black" style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}>
                What words unlock your spirit?
              </p>
              <input
                type="text"
                value={releaseCommand}
                onChange={(e) => setReleaseCommand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && unlockShikai()}
                placeholder="e.g. Dance, Senbonzakura"
                disabled={shikaiPhase === "unlocking"}
                autoFocus
                className="w-full bg-transparent outline-none text-lg py-3 border-b-2 border-[#a020f0] placeholder:text-[#4e4355]"
                style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
              />
              {shikaiError && (
                <p className="text-xs" style={{ fontFamily: "var(--font-body)", color: "#ffb4ab" }}>
                  {shikaiError}
                </p>
              )}
              <button
                onClick={unlockShikai}
                disabled={shikaiPhase === "unlocking" || !releaseCommand.trim()}
                className="w-full py-3 text-sm uppercase tracking-widest font-bold transition-all hover:brightness-110 disabled:opacity-40"
                style={{ background: "#a020f0", color: "#f9e8ff", fontFamily: "var(--font-body)" }}
              >
                {shikaiPhase === "unlocking" ? "Awakening…" : "Release"}
              </button>
            </div>
          )}

          {shikaiPhase === "error" && (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-body)", color: "#ffb4ab" }}>
                ——&nbsp; Connection lost &nbsp;——
              </p>
              <button
                onClick={() => setShikaiPhase("idle")}
                className="text-xs uppercase tracking-widest hover:text-white"
                style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
              >
                Return
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#0e0e0e", color: "#e5e2e1" }}
    >
      <ShikaiModal />
      <SideNav active="Sanctum" />

      {/* ── Main — offset for sidebar ── */}
      <main className="flex-1 md:ml-24 flex flex-col md:flex-row h-full pt-16 md:pt-0 overflow-hidden">

        {/* ── Left: Inner World (60%) ── */}
        <section className="hidden md:block md:w-3/5 h-full relative">

          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${bgImage}')` }}
          />

          {/* Atmospheric overlays */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(14,14,14,0.85) 0%, rgba(14,14,14,0.15) 50%, rgba(14,14,14,0.92) 100%)",
            }}
          />
          <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.03)", mixBlendMode: "overlay" }} />

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">

            {/* Top: sync status */}
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 animate-pulse"
                style={{
                  background: accent,
                  borderRadius: "50%",
                  boxShadow: `0 0 10px ${accent}`,
                }}
              />
              <span
                className="text-xs uppercase tracking-[0.2em] opacity-80"
                style={{ fontFamily: "var(--font-body)", color: "#fff" }}
              >
                Synchronization Stable
              </span>
            </div>

            {/* Bottom: spirit name */}
            <div className="flex flex-col gap-2">
              <h1
                className="font-black leading-none tracking-tight drop-shadow-2xl"
                style={{
                  fontFamily: "var(--font-headline)",
                  fontSize: "clamp(3rem,7vw,5.5rem)",
                  color: "#fff",
                  textTransform: "uppercase",
                }}
              >
                {spiritName}
              </h1>
              <p
                className="text-sm uppercase tracking-widest max-w-md"
                style={{ fontFamily: "var(--font-body)", color: `${accent}cc` }}
              >
                {zanpakuto.spirit_persona.archetype} · {zanpakuto.element} manifestation
              </p>
            </div>
          </div>
        </section>

        {/* ── Right: Chat panel (40%) ── */}
        <section
          className="flex-1 md:w-2/5 flex flex-col h-full relative z-20"
          style={{
            background: "#0e0e0e",
            boxShadow: "-20px 0 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Chat header */}
          <header
            className="flex-none px-6 py-5 flex justify-between items-center"
            style={{
              background: "rgba(14,14,14,0.9)",
              backdropFilter: "blur(12px)",
              borderBottom: "1px solid rgba(78,67,85,0.2)",
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-8 h-8 flex items-center justify-center text-lg"
                style={{
                  background: `${accent}22`,
                  border: `1px solid ${accent}55`,
                  color: accent,
                  fontFamily: "var(--font-headline)",
                }}
              >
                {kanji}
              </div>
              <div>
                <h2
                  className="text-base font-bold uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                >
                  Communion
                </h2>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  Direct Link Active
                </p>
              </div>
            </div>

            <div
              className="w-2 h-2 animate-pulse"
              style={{ background: accent, borderRadius: "50%", boxShadow: `0 0 8px ${accent}` }}
            />
          </header>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-7"
            style={{ scrollbarWidth: "thin", scrollbarColor: "#4e4355 transparent" }}
          >
            {messages.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p
                  className="text-xs uppercase tracking-widest text-center"
                  style={{ fontFamily: "var(--font-body)", color: "#4e4355" }}
                >
                  The spirit awaits your words.
                </p>
              </div>
            )}

            {messages.map((msg) =>
              msg.role === "spirit" ? (
                /* Spirit message */
                <div key={msg.id} className="flex flex-col gap-1.5 items-start max-w-[88%]">
                  <span
                    className="text-xs uppercase tracking-widest ml-1"
                    style={{ fontFamily: "var(--font-body)", color: accent }}
                  >
                    {spiritName}
                  </span>
                  <div
                    className="relative p-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                    style={{
                      background: "rgba(42,42,42,0.4)",
                      backdropFilter: "blur(8px)",
                      borderLeft: `2px solid ${accent}`,
                    }}
                  >
                    {/* Glowing accent tick */}
                    <div
                      className="absolute -left-[2px] top-0 h-4 w-[2px]"
                      style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
                    />
                    <p
                      className="text-lg leading-relaxed tracking-wide"
                      style={{ fontFamily: "var(--font-headline)", color: "#e5e2e1" }}
                    >
                      {msg.content}
                      {isStreaming && msg.id === messages[messages.length - 1]?.id && (
                        <span className="animate-pulse ml-1" style={{ color: accent }}>▌</span>
                      )}
                    </p>
                    {/* Decorative kanji watermark */}
                    <span
                      className="absolute right-2 bottom-2 text-6xl select-none pointer-events-none"
                      style={{ fontFamily: "var(--font-headline)", color: "rgba(255,255,255,0.04)" }}
                    >
                      {kanji}
                    </span>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider ml-1"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(154,140,160,0.5)" }}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              ) : (
                /* User message */
                <div key={msg.id} className="flex flex-col gap-1.5 items-end self-end max-w-[80%]">
                  <span
                    className="text-xs uppercase tracking-widest mr-1"
                    style={{ fontFamily: "var(--font-body)", color: "#e3b5ff" }}
                  >
                    Shinigami
                  </span>
                  <div
                    className="p-4"
                    style={{
                      background: "#a020f0",
                      boxShadow: "0 10px 30px rgba(160,32,240,0.2)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: "var(--font-body)", color: "#f9e8ff" }}
                    >
                      {msg.content}
                    </p>
                  </div>
                  <span
                    className="text-[10px] uppercase tracking-wider mr-1"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(154,140,160,0.5)" }}
                  >
                    {formatTime(msg.created_at)}
                  </span>
                </div>
              )
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Bottom: meter + input */}
          <div
            className="flex-none p-5 flex flex-col gap-4"
            style={{ borderTop: "1px solid rgba(32,31,31,0.8)", background: "#0e0e0e" }}
          >
            {/* Release Shikai button — shown when sealed */}
            {zanpakuto.state === "sealed" && (
              <button
                onClick={checkShikai}
                disabled={shikaiPhase === "checking"}
                className="w-full py-2.5 text-xs uppercase tracking-[0.2em] transition-all hover:brightness-110 disabled:opacity-40"
                style={{
                  fontFamily: "var(--font-body)",
                  border: `1px solid ${accent}44`,
                  color: accent,
                  background: `${accent}0a`,
                }}
              >
                {shikaiPhase === "checking" ? "Evaluating…" : "Attempt Release — Shikai"}
              </button>
            )}

            {/* Shikai unlocked banner */}
            {zanpakuto.state !== "sealed" && (
              <div
                className="w-full py-2 text-center text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  color: accent,
                  background: `${accent}12`,
                  borderBottom: `1px solid ${accent}44`,
                }}
              >
                Shikai achieved — {zanpakuto.true_name}
              </div>
            )}

            {/* Reiatsu meter */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center px-0.5">
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-body)", color: "#9a8ca0" }}
                >
                  Reiatsu Connection
                </span>
                <span
                  className="text-[10px] uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-body)", color: "#a020f0" }}
                >
                  {reiatsu}%
                </span>
              </div>
              <div className="h-px w-full relative overflow-hidden" style={{ background: "#2a2a2a" }}>
                <div
                  className="absolute top-0 left-0 h-full transition-all duration-1000"
                  style={{
                    width: `${reiatsu}%`,
                    background: `linear-gradient(to right, #a020f0, ${accent})`,
                  }}
                />
                <div
                  className="absolute top-0 right-0 h-full w-4 animate-pulse"
                  style={{ background: "rgba(255,255,255,0.4)", filter: "blur(2px)" }}
                />
              </div>
            </div>

            {/* Input */}
            <div
              className="flex gap-3 items-end p-2 transition-colors duration-300"
              style={{
                background: "#1c1b1b",
                borderBottom: `2px solid ${isStreaming ? accent : "#a020f0"}`,
              }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Channel your intent..."
                rows={1}
                disabled={isStreaming}
                className="flex-1 bg-transparent border-none outline-none resize-none py-2 text-sm"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "#e5e2e1",
                  maxHeight: "120px",
                }}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                className="p-2 flex items-center justify-center transition-all duration-200"
                style={{
                  background: isStreaming || !input.trim() ? "#2a2a2a" : "#a020f0",
                  color: isStreaming || !input.trim() ? "#4e4355" : "#f9e8ff",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
