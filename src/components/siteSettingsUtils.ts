import { type HeroStat } from "./siteSettingsConfig";

export function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function parseHeroStats(raw: string) {
  if (!raw.trim()) {
    return { stats: [] as HeroStat[], error: null as string | null };
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return { stats: [] as HeroStat[], error: "Hero stats harus berupa array JSON." };
    }

    const stats = parsed.filter(
      (item): item is HeroStat =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as { label?: unknown }).label === "string" &&
        typeof (item as { value?: unknown }).value === "string"
    );

    if (stats.length !== parsed.length) {
      return {
        stats: [] as HeroStat[],
        error: 'Setiap item hero stats wajib punya "label" dan "value".',
      };
    }

    return { stats, error: null as string | null };
  } catch {
    return { stats: [] as HeroStat[], error: "Hero stats bukan JSON yang valid." };
  }
}
