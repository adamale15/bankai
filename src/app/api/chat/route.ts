import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSystemPrompt } from "@/lib/llm/system-prompt";
import { computeVector } from "@/lib/forging/vector";
import type { ZanpakutoData } from "@/lib/forging/blade-map";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// ── GET: fetch conversation history ────────────────────────────────
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const conversationId = req.nextUrl.searchParams.get("conversationId");
  if (!conversationId) return NextResponse.json({ error: "Missing conversationId" }, { status: 400 });

  const admin = createAdminClient();

  const { data: conv } = await admin
    .from("conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: messages } = await admin
    .from("messages")
    .select("id, role, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(100);

  return NextResponse.json({ messages: messages ?? [] });
}

// ── POST: send message + stream spirit response ─────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { conversationId, message } = await req.json() as {
    conversationId: string;
    message: string;
  };

  if (!conversationId || !message?.trim()) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Validate conversation ownership
  const { data: conv } = await admin
    .from("conversations")
    .select("id, zanpakuto_id, summary, message_count")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch zanpakuto + soul reading in parallel
  const [zanpakutoRes, readingRes] = await Promise.all([
    admin.from("zanpakuto").select("*").eq("id", conv.zanpakuto_id).single(),
    admin.from("soul_readings").select("vector, answers").eq("user_id", user.id).single(),
  ]);

  const zanpakuto = zanpakutoRes.data as ZanpakutoData | null;
  const reading = readingRes.data;

  if (!zanpakuto || !reading) {
    return NextResponse.json({ error: "Spirit not found" }, { status: 404 });
  }

  const vector = reading.vector
    ? reading.vector as ReturnType<typeof computeVector>
    : computeVector(reading.answers as { questionId: string; optionId: string }[]);

  // Save user message
  await admin.from("messages").insert({
    conversation_id: conversationId,
    role: "user",
    content: message.trim(),
    token_count: 0,
  });

  // Get recent message history for context (last 20 messages)
  const { data: history } = await admin
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(20);

  const recentMessages = (history ?? []).reverse();

  // Build Gemini contents (exclude the message we just saved — we append it below)
  const contents = recentMessages
    .filter((m) => m.content !== message.trim() || m.role !== "user")
    .map((m) => ({
      role: m.role === "spirit" ? "model" : "user",
      parts: [{ text: m.content as string }],
    }));

  // Append current user message
  contents.push({ role: "user", parts: [{ text: message.trim() }] });

  const systemPrompt = buildSystemPrompt(zanpakuto, vector, conv.summary);

  // Stream response
  const encoder = new TextEncoder();
  let fullResponse = "";

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const geminiStream = await genai.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents,
          config: { systemInstruction: systemPrompt, maxOutputTokens: 512 },
        });

        for await (const chunk of geminiStream) {
          const text = chunk.text ?? "";
          if (text) {
            fullResponse += text;
            controller.enqueue(encoder.encode(text));
          }
        }

        // Save spirit response + update message count
        await Promise.all([
          admin.from("messages").insert({
            conversation_id: conversationId,
            role: "spirit",
            content: fullResponse,
            token_count: 0,
          }),
          admin
            .from("conversations")
            .update({ message_count: (conv.message_count ?? 0) + 2 })
            .eq("id", conversationId),
        ]);

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache",
    },
  });
}
