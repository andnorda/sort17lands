import { CURRENT_SET_CODE } from "./config";
import { CardRating } from "../types/ratings";

function isValidRow(row: unknown): row is CardRating {
  if (!row || typeof row !== "object") return false;
  const maybe: Record<string, unknown> = row as Record<string, unknown>;
  if (typeof maybe.name !== "string") return false;
  const edwr = Number(maybe.ever_drawn_win_rate);
  if (!Number.isFinite(edwr)) return false;
  return true;
}

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
    if (isValidRow(row)) {
      filtered.push({
        name: row.name,
        color: row.color ?? null,
        ever_drawn_win_rate: Number(row.ever_drawn_win_rate),
        seen_at: row.seen_at ?? null,
        rarity: row.rarity ?? null,
        id_hash: row.id_hash ?? null,
      });
    }
  }
  return filtered;
}
