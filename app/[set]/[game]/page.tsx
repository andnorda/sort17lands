import Link from "next/link";
import { notFound } from "next/navigation";
import GameBoard from "../../../components/Game";
import { getCachedCardRatings } from "../../../lib/fetchRatings";
import { pickRandomCards } from "../../../lib/random";

export default async function GamePage({
  params,
  searchParams,
}: {
  params: Promise<{ set: string; game: string }>;
  searchParams: Promise<{ boomerMode?: string }>;
}) {
  const { set, game } = await params;
  const { boomerMode } = await searchParams;
  const isBoomerMode = boomerMode === "true";

  try {
    const ratings = await getCachedCardRatings(isBoomerMode);
    const cards = game
      .match(/.{1,2}/g)
      ?.map((id) => ratings.find((c) => c.id === id)!);

    if (!cards) return notFound();

    return (
      <GameBoard
        key={game}
        cards={cards}
        nextHref={`/${set}/${pickRandomCards(ratings, 5)
          .map((c) => c.id)
          .join("")}${isBoomerMode ? "?boomerMode=true" : ""}`}
      />
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
