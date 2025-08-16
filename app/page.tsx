import { redirect } from "next/navigation";
import { CURRENT_SET_CODE } from "../lib/config";
import { getCachedCardRatings } from "../lib/fetchRatings";
import { pickRandomCards } from "../lib/random";
export const dynamic = "force-dynamic";

const generateGameCode = async (boomerMode: boolean = false) => {
  const ratings = await getCachedCardRatings(boomerMode);
  const five = pickRandomCards(ratings, 5);
  return five.map((c) => c.id).join("");
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ boomerMode?: string }>;
}) {
  const { boomerMode } = await searchParams;
  const isBoomerMode = boomerMode === "true";

  let redirectPath = "/error";
  try {
    const gameCode = await generateGameCode(isBoomerMode);
    redirectPath = `/${CURRENT_SET_CODE.toLocaleLowerCase()}/${gameCode}${
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
