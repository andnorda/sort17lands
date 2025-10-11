import { redirect } from "next/navigation";
import { getCachedCardRatings } from "../../lib/fetchRatings";
import { pickRandomCards } from "../../lib/random";

export const dynamic = "force-dynamic";

const generateGameCode = async (set: string, boomerMode: boolean = false) => {
  const ratings = await getCachedCardRatings(boomerMode, set);
  const five = pickRandomCards(ratings, 5);
  return five.map((c) => c.id).join("");
};

export default async function SetHome({
  params,
  searchParams,
}: {
  params: Promise<{ set: string }>;
  searchParams: Promise<{ boomerMode?: string }>;
}) {
  const { set } = await params;
  const { boomerMode } = await searchParams;
  const isBoomerMode = boomerMode === "true";

  let redirectPath = "/error";
  try {
    const gameCode = await generateGameCode(set, isBoomerMode);
    redirectPath = `/${set}/${gameCode}${
      isBoomerMode ? "?boomerMode=true" : ""
    }`;
  } catch (e) {
    console.error(e);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
