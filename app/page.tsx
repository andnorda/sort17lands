import { redirect } from "next/navigation";
import { getCachedCardRatings } from "../lib/fetchRatings";
import { pickRandomCards } from "../lib/random";
import { CardRating } from "../types/ratings";
import { CURRENT_SET_CODE } from "../lib/config";
import { buildMtgaIdToCode, encodeGameCode } from "../lib/gameCode";
export const dynamic = "force-dynamic";

export default async function Home() {
  let redirectPath = null;
  try {
    const ratings = await getCachedCardRatings();
    const five = pickRandomCards<CardRating>(ratings, 5);
    const idToCode = buildMtgaIdToCode(ratings);
    const code = encodeGameCode(five, idToCode);
    redirectPath = `/${CURRENT_SET_CODE}/${code}`;
  } catch (e) {
    console.error(e);
    redirectPath = `/${CURRENT_SET_CODE}/error`;
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
