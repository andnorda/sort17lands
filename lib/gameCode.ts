import { CardRating } from "../types/ratings";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // base62
const CHAR_TO_VAL: Record<string, number> = Object.fromEntries(
  Array.from(ALPHABET).map((c, i) => [c, i])
);

function toBase62(num: number): string {
  if (num === 0) return "0";
  let n = Math.floor(Math.abs(num));
  let out = "";
  while (n > 0) {
    out = ALPHABET[n % 62] + out;
    n = Math.floor(n / 62);
  }
  return out;
}

// Precompute a stable mapping from mtga_id to a 2-char code based on rank
export function buildMtgaIdToCode(ratings: CardRating[]): Map<number, string> {
  const sorted = [...ratings].sort((a, b) => a.mtga_id - b.mtga_id);
  const map = new Map<number, string>();
  for (let i = 0; i < sorted.length; i++) {
    const code = toBase62(i).padStart(2, "0").slice(-2);
    map.set(sorted[i].mtga_id, code);
  }
  return map;
}

export function encodeGameCode(
  cards: CardRating[],
  idToCode: Map<number, string>
): string {
  return cards.map((c) => idToCode.get(c.mtga_id) ?? "00").join("");
}

export function decodeGameCode(
  code: string,
  ratings: CardRating[]
): CardRating[] | null {
  if (code.length !== 10) return null; // 5 cards * 2 chars
  const sorted = [...ratings].sort((a, b) => a.mtga_id - b.mtga_id);
  const result: CardRating[] = [];
  for (let i = 0; i < 10; i += 2) {
    const chunk = code.slice(i, i + 2);
    const high = CHAR_TO_VAL[chunk[0] as string];
    const low = CHAR_TO_VAL[chunk[1] as string];
    if (high === undefined || low === undefined) return null;
    const index = high * 62 + low;
    if (!Number.isFinite(index) || index < 0 || index >= sorted.length)
      return null;
    result.push(sorted[index]);
  }
  return result;
}
