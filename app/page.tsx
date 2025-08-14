import GameBoard from "../components/GameBoard";
import { getCachedCardRatings } from "../lib/fetchRatings";
import { pickRandomCards } from "../lib/random";
import { CardRating } from "../types/ratings";

export default async function Home() {
  let five: CardRating[] = [];
  try {
    const ratings = await getCachedCardRatings();
    five = pickRandomCards<CardRating>(ratings, 5);
  } catch {
    // render a minimal retry UI on failure
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
        <div style={{ display: "grid", gap: 12, textAlign: "center" }}>
          <div>Failed to load ratings.</div>
          <form>
            <button formAction={() => {}} onClick={() => {}}>
              Retry
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", placeItems: "center", padding: 32 }}>
      <div style={{ maxWidth: 820, width: "100%", display: "grid", gap: 16 }}>
        <h1 style={{ fontSize: 24 }}>Order the cards by Ever Drawn Win Rate</h1>
        <p style={{ opacity: 0.8 }}>Drag to reorder from highest to lowest, then submit.</p>
        <GameBoard cards={five} />
      </div>
    </div>
  );
}
