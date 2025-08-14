export type CardRating = {
  name: string;
  color?: string | null;
  ever_drawn_win_rate: number; // 0..100 percentage from 17Lands
  seen_at?: string | null; // optional metadata fields if present
  rarity?: string | null;
  id_hash?: string | null; // use as a stable key if available
  mtga_id: number; // used to derive 2-char code
};
