import { QUESTIONS, type ElementType, type VectorDelta } from "@/lib/quiz/questions";

export type PersonalityVector = {
  conviction: number;
  mercy: number;
  ambition: number;
  introspection: number;
  aggression: number;
  loyalty: number;
  curiosity: number;
  element: ElementType;
  elementScores: Record<ElementType, number>;
};

type TraitKey = Exclude<keyof VectorDelta, "elements">;
const TRAITS: TraitKey[] = [
  "conviction",
  "mercy",
  "ambition",
  "introspection",
  "aggression",
  "loyalty",
  "curiosity",
];

const ELEMENTS: ElementType[] = [
  "fire", "water", "ice", "wind", "earth", "lightning", "void", "light",
];

function theoreticalMax(trait: TraitKey): number {
  return QUESTIONS.reduce((sum, q) => {
    const best = Math.max(...q.options.map((o) => o.delta[trait] ?? 0));
    return sum + best;
  }, 0);
}

export function computeVector(
  answers: { questionId: string; optionId: string }[]
): PersonalityVector {
  const raw = Object.fromEntries(TRAITS.map((t) => [t, 0])) as Record<TraitKey, number>;
  const elementScores = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<ElementType, number>;

  for (const { questionId, optionId } of answers) {
    if (optionId === "skip") continue;
    const question = QUESTIONS.find((q) => q.id === questionId);
    if (!question) continue;
    const option = question.options.find((o) => o.id === optionId);
    if (!option) continue;

    for (const trait of TRAITS) {
      raw[trait] += option.delta[trait] ?? 0;
    }

    if (option.delta.elements) {
      for (const [elem, val] of Object.entries(option.delta.elements)) {
        elementScores[elem as ElementType] += val ?? 0;
      }
    }
  }

  const normalized = Object.fromEntries(
    TRAITS.map((trait) => {
      const max = theoreticalMax(trait);
      return [trait, max > 0 ? Math.min(raw[trait] / max, 1) : 0];
    })
  ) as Record<TraitKey, number>;

  const dominantElement = (
    Object.entries(elementScores).sort((a, b) => b[1] - a[1])[0][0]
  ) as ElementType;

  return { ...normalized, element: dominantElement, elementScores };
}
