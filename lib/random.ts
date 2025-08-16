import { CardRating } from "@/types/ratings";

export function pickRandomCards(a: CardRating[], k: number): CardRating[] {
  const arr = a.filter((c) => c.ever_drawn_win_rate > 0.3);
  const n = arr.length;
  if (k <= 0 || n === 0) return [];
  if (k >= n) return [...arr];

  const picked: CardRating[] = [];
  const seen = new Set<number>();
  while (picked.length < k) {
    const idx = Math.floor(Math.random() * n);
    if (seen.has(idx)) continue;
    seen.add(idx);
    picked.push(arr[idx]);
  }
  if (
    picked.some((c, i, a) =>
      a
        .filter((_, index) => i !== index)
        .some(
          (card) =>
            Math.abs(card.ever_drawn_win_rate - c.ever_drawn_win_rate) < 0.005
        )
    )
  ) {
    return pickRandomCards(a, k);
  }
  return picked;
}
