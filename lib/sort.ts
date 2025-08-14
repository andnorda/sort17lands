import { CardRating } from "../types/ratings";

export function sortByEverDrawnWinRateDesc(cards: CardRating[]): CardRating[] {
  return [...cards].sort(
    (a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate
  );
}

export function sortByEverDrawnWinRateAsc(cards: CardRating[]): CardRating[] {
  return [...cards].sort(
    (a, b) => a.ever_drawn_win_rate - b.ever_drawn_win_rate
  );
}
