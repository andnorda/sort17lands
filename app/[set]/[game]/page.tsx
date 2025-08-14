import Link from "next/link";
import { notFound } from "next/navigation";
import GameBoard from "../../../components/Game";
import { getCachedCardRatings } from "../../../lib/fetchRatings";
import { pickRandomCards } from "../../../lib/random";
import { CardRating } from "../../../types/ratings";

export default async function GamePage({
  params,
}: {
  params: Promise<{ set: string; game: string }>;
}) {
  const { set, game } = await params;

  try {
    const ratings = await getCachedCardRatings();
    const cards = game
      .match(/.{1,2}/g)
      ?.map((id) => ratings.find((c) => c.id === id)!);

    if (!cards) return notFound();

    return (
      <>
        <h1>Order the cards by Ever Drawn Win Rate</h1>
        <p>Drag to reorder from lowest to highest, then submit.</p>
        <GameBoard
          key={game}
          cards={cards}
          nextHref={`/${set}/${pickRandomCards<CardRating>(ratings, 5)
            .map((c) => c.id)
            .join("")}`}
        />
      </>
    );
  } catch {
    return (
      <>
        <p>Failed to load ratings.</p>
        <Link href="/">Retry</Link>
      </>
    );
  }
}
