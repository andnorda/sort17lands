import { CURRENT_SET_CODE } from "./config";
import { CardRating } from "../types/ratings";

export async function getCachedCardRatings(): Promise<CardRating[]> {
  const url = `https://www.17lands.com/card_ratings/data?expansion=${CURRENT_SET_CODE}&format=premierdraft`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ratings: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected ratings response shape");
  }
  const filtered: CardRating[] = [];
  for (const row of data) {
    const raw = row as Record<string, unknown>;
    filtered.push({
      name: (raw.name as string) ?? "",
      color: (raw.color as string | null) ?? null,
      ever_drawn_win_rate: row.ever_drawn_win_rate,
      seen_at: (raw.seen_at as string | null) ?? null,
      rarity: (raw.rarity as string | null) ?? null,
      id_hash: (raw.id_hash as string | null) ?? null,
      mtga_id: Number(raw.mtga_id),
    });
  }
  return filtered;
}
