export type ElementType =
  | "fire"
  | "water"
  | "ice"
  | "wind"
  | "earth"
  | "lightning"
  | "void"
  | "light";

export type VectorDelta = {
  conviction?: number;
  mercy?: number;
  ambition?: number;
  introspection?: number;
  aggression?: number;
  loyalty?: number;
  curiosity?: number;
  elements?: Partial<Record<ElementType, number>>;
};

export type Highlight = {
  text: string;
  color: "error" | "primary" | "tertiary" | "secondary";
};

export type QuestionOption = {
  id: string;
  text: string;
  subtext?: string;
  delta: VectorDelta;
};

export type Question = {
  id: string;
  text: string;
  subtext?: string;
  highlights?: Highlight[];
  options: QuestionOption[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "A hollow breaches the barriers and threatens a village. You are alone and far outmatched.",
    subtext: "What do you do?",
    highlights: [
      { text: "far outmatched", color: "error" },
      { text: "village", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "Charge in — buy time for the villagers to escape",
        subtext: "A cornered beast bites hardest. You will bleed, but the innocent will live. The blade earns its purpose.",
        delta: { aggression: 4, mercy: 3, conviction: 2 },
      },
      {
        id: "b",
        text: "Get the civilians out first. The fight is secondary",
        subtext: "Every second spent fighting is a second they are not safe. The hollow can wait. People cannot.",
        delta: { mercy: 5, loyalty: 3 },
      },
      {
        id: "c",
        text: "Assess the hollow's weaknesses before engaging",
        subtext: "Recklessness is a weapon turned on yourself. One precise strike wins where a thousand blind ones fail.",
        delta: { introspection: 3, curiosity: 3, conviction: 2 },
      },
      {
        id: "d",
        text: "Fall back — return when you have allies",
        subtext: "A dead hero protects no one. You live to fight with those who can actually turn this tide.",
        delta: { loyalty: 3, conviction: 2 },
      },
    ],
  },
  {
    id: "q2",
    text: "Your captain orders you to abandon the mission. A comrade is still inside.",
    subtext: "What do you do?",
    highlights: [
      { text: "abandon the mission", color: "error" },
      { text: "comrade", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "Obey. The mission serves the greater good",
        subtext: "One life against many is the hardest arithmetic a Soul Reaper ever learns. You do not look away from it.",
        delta: { conviction: 4, loyalty: 3 },
      },
      {
        id: "b",
        text: "Disobey. No order outweighs a life",
        subtext: "There is no mission worth completing if you return and cannot face the mirror. You go back in.",
        delta: { mercy: 4, aggression: 2, loyalty: 2 },
      },
      {
        id: "c",
        text: "Argue your case before deciding",
        subtext: "Orders are not above question. You force a conversation your captain does not want to have.",
        delta: { conviction: 3, introspection: 2, curiosity: 2 },
      },
      {
        id: "d",
        text: "Find a way to complete both — refuse to accept the choice",
        subtext: "Impossible options exist to break small minds. You are not small. You find the third path.",
        delta: { ambition: 4, conviction: 3 },
      },
    ],
  },
  {
    id: "q3",
    text: "You discover a sealed, forbidden technique that would make you far stronger — but unstable.",
    subtext: "What do you do?",
    highlights: [
      { text: "forbidden technique", color: "error" },
      { text: "far stronger", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "Seize it. Power is what separates the living from the fallen",
        subtext: "Every sealed door was sealed by someone weaker than what stands beyond it. You are not them.",
        delta: { ambition: 5, aggression: 3, elements: { void: 3 } },
      },
      {
        id: "b",
        text: "Refuse it. Strength at that price is not worth having",
        subtext: "The road to ruin is paved with justified exceptions. You seal the door and walk away.",
        delta: { conviction: 4, mercy: 2 },
      },
      {
        id: "c",
        text: "Study it thoroughly before making any decision",
        subtext: "Understanding a thing is not the same as using it. You read every word before you touch what is inside.",
        delta: { curiosity: 5, introspection: 3 },
      },
      {
        id: "d",
        text: "Seek your captain's counsel first",
        subtext: "Wisdom that cost others everything should not be carried alone. You bring it to those who can judge it.",
        delta: { loyalty: 3, introspection: 3, curiosity: 2 },
      },
    ],
  },
  {
    id: "q4",
    text: "A wounded enemy you've defeated begs for their life.",
    subtext: "What do you do?",
    highlights: [
      { text: "wounded enemy", color: "error" },
      { text: "begs for their life", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "Spare them. The fight is over",
        subtext: "The blade ends the battle. It does not decide what comes after. You sheathe it.",
        delta: { mercy: 5, conviction: 2 },
      },
      {
        id: "b",
        text: "End it cleanly. Mercy to enemies is a wound left open",
        subtext: "Sentiment today becomes a sword at your back tomorrow. You have seen this before.",
        delta: { aggression: 3, conviction: 3 },
      },
      {
        id: "c",
        text: "Spare them, but take them captive",
        subtext: "Neither soft nor cruel — measured. The living provide answers the dead never will.",
        delta: { conviction: 3, mercy: 3 },
      },
      {
        id: "d",
        text: "Ask why they fight before deciding",
        subtext: "Every enemy was someone's comrade once. You want to know what drove them to this ground.",
        delta: { curiosity: 4, mercy: 3 },
      },
    ],
  },
  {
    id: "q5",
    text: "You sink into deep meditation and reach your inner world for the first time.",
    subtext: "What do you sense first?",
    highlights: [
      { text: "inner world", color: "primary" },
      { text: "for the first time", color: "secondary" },
    ],
    options: [
      {
        id: "a",
        text: "A fire burning somewhere deep — it has been waiting",
        subtext: "Not new. Ancient. It recognized you before you recognized it.",
        delta: { aggression: 2, conviction: 1, elements: { fire: 10 } },
      },
      {
        id: "b",
        text: "A vast, patient ocean — deep and boundless",
        subtext: "No horizon. No bottom. Only the pressure of something immense pressing back.",
        delta: { introspection: 2, mercy: 1, elements: { water: 10 } },
      },
      {
        id: "c",
        text: "Wind through open space — no walls, no limits",
        subtext: "Movement without direction. Freedom without weight. It could go anywhere.",
        delta: { curiosity: 2, ambition: 2, elements: { wind: 10 } },
      },
      {
        id: "d",
        text: "Cold silence, like ice before dawn",
        subtext: "Everything held perfectly still. Waiting for the right moment that only it can feel.",
        delta: { introspection: 3, conviction: 1, elements: { ice: 10 } },
      },
      {
        id: "e",
        text: "The crackle of lightning — too fast to hold",
        subtext: "It was already ahead of you before you finished the thought.",
        delta: { aggression: 2, curiosity: 2, elements: { lightning: 10 } },
      },
      {
        id: "f",
        text: "Ancient earth, immovable and deep-rooted",
        subtext: "Nothing shakes it. Nothing rushes it. It has been here longer than memory.",
        delta: { loyalty: 2, conviction: 2, elements: { earth: 10 } },
      },
      {
        id: "g",
        text: "A void between stars — endless, formless",
        subtext: "Not empty. Full of everything that hasn't happened yet.",
        delta: { introspection: 3, ambition: 2, elements: { void: 10 } },
      },
      {
        id: "h",
        text: "A faint light in darkness — steady, warm",
        subtext: "Not loud. Not demanding. Simply there, as it always has been.",
        delta: { mercy: 2, loyalty: 2, elements: { light: 10 } },
      },
    ],
  },
  {
    id: "q6",
    text: "A fellow Soul Reaper commits a serious violation of law to protect someone they love. You witnessed it.",
    subtext: "What do you do?",
    highlights: [
      { text: "serious violation of law", color: "error" },
      { text: "someone they love", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "Report it. Law is law — sentiment cannot override it",
        subtext: "The system holds only as long as people choose it even when it costs them. You choose it.",
        delta: { conviction: 5, loyalty: 3 },
      },
      {
        id: "b",
        text: "Stay silent. Love justifies it",
        subtext: "There are things more real than the rules written to contain them. You were never there.",
        delta: { mercy: 4, loyalty: 4 },
      },
      {
        id: "c",
        text: "Confront them privately first",
        subtext: "They deserve to know what you saw and what you intend. You owe them that much.",
        delta: { introspection: 3, conviction: 3, mercy: 2 },
      },
      {
        id: "d",
        text: "Help cover it — and carry that weight with them",
        subtext: "You do not abandon someone mid-fall. If they go down, you go down beside them.",
        delta: { loyalty: 5, mercy: 3 },
      },
    ],
  },
  {
    id: "q7",
    text: "Someone asks why you train as hard as you do.",
    subtext: "What is the honest answer?",
    highlights: [
      { text: "honest answer", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "To never lose someone again",
        subtext: "There is a face you cannot let yourself forget. Every rep is a promise to that face.",
        delta: { loyalty: 5, conviction: 3 },
      },
      {
        id: "b",
        text: "To reach the limits of what is possible",
        subtext: "You do not know where the ceiling is. You intend to find out by hitting it.",
        delta: { ambition: 5, curiosity: 3 },
      },
      {
        id: "c",
        text: "To understand the true nature of power",
        subtext: "Strength is a language. You are still learning what it is trying to say.",
        delta: { introspection: 4, curiosity: 4 },
      },
      {
        id: "d",
        text: "To become something no threat can reach",
        subtext: "Not invincible. Unreachable. There is a difference, and you have felt it.",
        delta: { aggression: 3, loyalty: 3, conviction: 3 },
      },
    ],
  },
  {
    id: "q8",
    text: "A dying enemy tells you the war you have been fighting is built on a lie.",
    subtext: "How do you respond?",
    highlights: [
      { text: "built on a lie", color: "error" },
      { text: "duty", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "It changes nothing. My duty is clear",
        subtext: "Truth is complicated. Duty is simple. You finish what you started and investigate after.",
        delta: { conviction: 5, loyalty: 3 },
      },
      {
        id: "b",
        text: "Believe them. Truth changes everything",
        subtext: "A dying person has nothing left to gain from lies. You listen, and the ground shifts.",
        delta: { curiosity: 4, introspection: 3, mercy: 2 },
      },
      {
        id: "c",
        text: "Demand evidence before acting on it",
        subtext: "Words in a last breath are not proof. But they are a thread. You pull it carefully.",
        delta: { introspection: 4, conviction: 3, curiosity: 3 },
      },
      {
        id: "d",
        text: "Rage — you have been used",
        subtext: "Every scar. Every loss. All of it for a cause that was never real. You let that ignite you.",
        delta: { aggression: 4, conviction: 2 },
      },
    ],
  },
  {
    id: "q9",
    text: "Your zanpakuto has been silent for weeks — refusing to respond no matter how hard you try.",
    subtext: "What do you do?",
    highlights: [
      { text: "silent for weeks", color: "error" },
      { text: "refusing to respond", color: "tertiary" },
    ],
    options: [
      {
        id: "a",
        text: "Force it awake through sheer will and relentless pressure",
        subtext: "Silence is not absence. You hammer at the wall until something on the other side cracks.",
        delta: { conviction: 4, aggression: 3 },
      },
      {
        id: "b",
        text: "Wait. It will speak when it is ready",
        subtext: "A spirit that does not wish to be rushed will not be. You make yourself still and available.",
        delta: { introspection: 5, mercy: 2 },
      },
      {
        id: "c",
        text: "Go deeper into meditation — seek it out yourself",
        subtext: "If it will not come to you, you go to it. You dive into your own inner world uninvited.",
        delta: { introspection: 4, curiosity: 3 },
      },
      {
        id: "d",
        text: "Ask a trusted ally — this is not a burden to carry alone",
        subtext: "Pride is a smaller thing than the silence between you and your spirit. You reach out.",
        delta: { loyalty: 3, mercy: 3, curiosity: 2 },
      },
    ],
  },
  {
    id: "q10",
    text: "You stand at the edge of your most dangerous fight yet.",
    subtext: "What do you carry into battle?",
    highlights: [
      { text: "most dangerous fight", color: "error" },
      { text: "carry into battle", color: "primary" },
    ],
    options: [
      {
        id: "a",
        text: "The name of someone you protect",
        subtext: "Not a philosophy. A person. Real and breathing and waiting for you to come back.",
        delta: { loyalty: 5, mercy: 2 },
      },
      {
        id: "b",
        text: "Your vow to become the strongest",
        subtext: "Every opponent so far has only proven the vow was right. This one will too.",
        delta: { ambition: 5, conviction: 3 },
      },
      {
        id: "c",
        text: "Nothing — you need no anchor",
        subtext: "Weight slows you down. You enter the fight clean, empty, and entirely present.",
        delta: { introspection: 4, aggression: 3 },
      },
      {
        id: "d",
        text: "The weight of every fight that brought you here",
        subtext: "Every scar is a lesson. Every loss is a reason. You carry all of it and none of it is heavy.",
        delta: { conviction: 4, introspection: 3 },
      },
    ],
  },
];
