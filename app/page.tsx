import { redirect } from "next/navigation";
import { CURRENT_SET_CODE } from "../lib/config";
import { getCachedCardRatings } from "../lib/fetchRatings";
import { pickRandomCards } from "../lib/random";
import { CardRating } from "../types/ratings";
export const dynamic = "force-dynamic";

const generateGameCode = async () => {
  const ratings = await getCachedCardRatings();
  const five = pickRandomCards(ratings, 5);
  return five.map((c) => c.id).join("");
};

export default async function Home() {
  let redirectPath = "/error";
  try {
    redirectPath = `/${CURRENT_SET_CODE.toLocaleLowerCase()}/${await generateGameCode()}`;
  } catch (e) {
    console.error(e);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}
