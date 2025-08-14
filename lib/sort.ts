import { CardRating } from "../types/ratings";

export function sortByEverDrawnWinRateDesc(cards: CardRating[]): CardRating[] {
  return [...cards].sort(
    (a, b) => b.ever_drawn_win_rate - a.ever_drawn_win_rate
  );
}
