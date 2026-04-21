import type { PersonalityVector } from "./vector";

export type BladeType = "nodachi" | "wakizashi" | "dual-blades" | "katana" | "naginata" | "tanto";

export type ZanpakutoData = {
  id: string;
  sealed_name: string;
  true_name: string | null;
  blade_type: string;
  guard_desc: string;
  hilt_color: string;
  element: string;
  inner_world_desc: string;
  inner_world_image_url: string | null;
  spirit_persona: {
    tone: string;
    archetype: string;
    speech_style: string;
    core_trait: string;
    quote: string;
  };
  state: string;
};

const ELEMENT_HILT: Record<string, string> = {
  fire:      "deep crimson lacquer with ember-gold inlays",
  water:     "ocean-blue silk wrap with silver rivets",
  ice:       "frost-white ray skin with platinum filigree",
  wind:      "storm-grey cord wrap with open-spoke binding",
  earth:     "dark mahogany wood core wrapped in aged leather",
  lightning: "black lacquer with gold-violet undertone veining",
  void:      "matte obsidian with no ornament — absorbs light",
  light:     "radiant ivory with gilded wire wrap",
};

const ELEMENT_GUARD: Record<string, string> = {
  fire:      "flame-tongue tsuba with molten copper veining along each prong",
  water:     "circular wave-pattern tsuba with concentric ripple etchings",
  ice:       "hexagonal crystal tsuba with fracture-line engravings",
  wind:      "open-spoke tsuba shaped like a hollow wheel — gaps intentional",
  earth:     "heavy octagonal iron tsuba with mountain-ridge relief carving",
  lightning: "jagged bolt-pattern tsuba with asymmetric sharp points",
  void:      "void-mirror tsuba — perfectly smooth, no reflection, no edge",
  light:     "radiant cross-tsuba with solar-corona engravings on each arm",
};

export const ELEMENT_ACCENT: Record<string, string> = {
  fire:      "#ffb4ab",
  water:     "#00fbfb",
  ice:       "#b8d4ff",
  wind:      "#a8d8b0",
  earth:     "#ffb86e",
  lightning: "#00fbfb",
  void:      "#a020f0",
  light:     "#ffe082",
};

export const ELEMENT_DESC: Record<string, string> = {
  fire:      "Immense combustion. Overwhelming pressure on release. Recommended combat style: relentless forward assault.",
  water:     "Fluid adaptation. Force absorbed and redirected without loss. Recommended combat style: flowing counter-pressure.",
  ice:       "Absolute stillness. Freeze and contain before the decisive strike. Recommended combat style: controlled suppression.",
  wind:      "Unbounded movement. Speed and angular redirection. Recommended combat style: evasion and precision strikes.",
  earth:     "Immovable foundation. Weight and endurance above all else. Recommended combat style: defensive anchoring.",
  lightning: "High volatility. Extreme kinetic force on release. Recommended combat style: Hakuda integration.",
  void:      "Formless negation. Reality bends at the boundary. Recommended combat style: spatial deconstruction.",
  light:     "Radiant intensity. Blinding force on direct exposure. Recommended combat style: overwhelming brilliance.",
};

export function mapBlade(v: PersonalityVector): {
  bladeType: BladeType;
  displayName: string;
  guardDesc: string;
  hiltColor: string;
} {
  let bladeType: BladeType;

  if (v.aggression > 0.7)                              bladeType = "nodachi";
  else if (v.introspection > 0.7 && v.mercy > 0.6)    bladeType = "wakizashi";
  else if (v.ambition > 0.7)                           bladeType = "dual-blades";
  else if (v.loyalty > 0.7 && v.conviction > 0.7)     bladeType = "katana";
  else if (v.curiosity > 0.7)                          bladeType = "naginata";
  else                                                  bladeType = "tanto";

  const DISPLAY: Record<BladeType, string> = {
    "nodachi":     "Nodachi",
    "wakizashi":   "Wakizashi",
    "dual-blades": "Dual Blades",
    "katana":      "Katana",
    "naginata":    "Naginata",
    "tanto":       "Tanto",
  };

  return {
    bladeType,
    displayName: DISPLAY[bladeType],
    guardDesc:   ELEMENT_GUARD[v.element] ?? "plain iron tsuba",
    hiltColor:   ELEMENT_HILT[v.element]  ?? "black silk wrap",
  };
}

export function computeReiatsu(id: string, element: string): number {
  const base: Record<string, number> = {
    fire: 7500, lightning: 8200, void: 8800, light: 7200,
    water: 6800, ice: 7100, wind: 6500, earth: 7300,
  };
  let h = 0;
  for (const c of id) h = (Math.imul(31, h) + c.charCodeAt(0)) | 0;
  return (base[element] ?? 7000) + (Math.abs(h) % 1000);
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function isCanonical(name: string, list: string[]): boolean {
  const normalized = name.toLowerCase().trim().replace(/['']/g, "'");
  return list.some((canon) => levenshtein(normalized, canon) <= 2);
}
