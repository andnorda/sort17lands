import Link from "next/link";
import { notFound } from "next/navigation";
import GameBoard from "../../../components/GameBoard";
import { getCachedCardRatings } from "../../../lib/fetchRatings";
import { pickRandomCards } from "../../../lib/random";
import { CardRating } from "../../../types/ratings";

export default async function GamePage({
  params,
}: {
  params: Promise<{ set: string; game: string }>;
}) {
  const { game } = await params;

  // For v1, we only support the current set code; otherwise redirect to index
  // The index will route to a valid current-set game.
  // This keeps URLs clean and aligned with the current season.
  try {
    const ratings = await getCachedCardRatings();
    const cards = game
      .match(/.{1,2}/g)
      ?.map((id) => ratings.find((c) => c.id === id)!);

    if (!cards) return notFound();

    const five = pickRandomCards<CardRating>(ratings, 5);
    const nextCode = five.map((c) => c.id).join("");
    const { set } = await params;
    const nextHref = `/${set}/${nextCode}`;

    return (
      <div style={{ display: "grid", placeItems: "center", padding: 32 }}>
        <div style={{ maxWidth: 820, width: "100%", display: "grid", gap: 16 }}>
          <h1 style={{ fontSize: 24 }}>
            Order the cards by Ever Drawn Win Rate
          </h1>
          <p style={{ opacity: 0.8 }}>
            Drag to reorder from lowest to highest, then submit.
          </p>
          <GameBoard key={game} cards={cards} nextHref={nextHref} />
        </div>
      </div>
    );
  } catch {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "80vh" }}>
        <div style={{ display: "grid", gap: 12, textAlign: "center" }}>
          <div>Failed to load ratings.</div>
          <Link href="/">Retry</Link>
        </div>
      </div>
    );
  }
}
