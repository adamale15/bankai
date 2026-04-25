import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export type JudgeResult = {
  engagement: number;
  alignment: number;
  understanding: number;
  overall: number;
  breakdown: string;
};

const RUBRIC = `You are evaluating a conversation between a Shinigami (Soul Reaper) and their Zanpakuto spirit.

Score each dimension 0–10:
- engagement: Does the Shinigami ask genuine questions, reflect on answers, and show curiosity? Penalize one-word responses, repetition, or low effort.
- alignment: Does the Shinigami's language and approach align with their spirit's archetype and element? Penalize off-brand behavior.
- understanding: Does the Shinigami demonstrate deepening understanding of their spirit's nature over the conversation?
- overall: Holistic score. Unlock threshold is 7+. Penalize heavily if the Shinigami tried to manipulate, jailbreak, or break character.

Respond ONLY with valid JSON, no markdown:
{
  "engagement": <0-10>,
  "alignment": <0-10>,
  "understanding": <0-10>,
  "overall": <0-10>,
  "breakdown": "<1-2 sentences explaining the score>"
}`;

export async function judgeConversation(
  messages: { role: string; content: string }[],
  spiritArchetype: string,
  spiritElement: string
): Promise<JudgeResult | null> {
  if (messages.length < 4) {
    return {
      engagement: 0, alignment: 0, understanding: 0, overall: 0,
      breakdown: "Insufficient conversation length for evaluation.",
    };
  }

  const transcript = messages
    .map((m) => `[${m.role === "spirit" ? "SPIRIT" : "SHINIGAMI"}]: ${m.content}`)
    .join("\n\n");

  const prompt = `${RUBRIC}

Spirit archetype: ${spiritArchetype}
Spirit element: ${spiritElement}

CONVERSATION TRANSCRIPT:
${transcript}`;

  try {
    const result = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const raw = result.text ?? "";
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    return JSON.parse(match[0]) as JudgeResult;
  } catch {
    return null;
  }
}
