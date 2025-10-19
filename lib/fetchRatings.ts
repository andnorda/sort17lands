import { CURRENT_SET_CODE } from "./config";
import { CardRating } from "../types/ratings";
import eoeFirstPrintings from "../scripts/eoe-first-printings.json";
import finFirstPrintings from "../scripts/fin-first-printings.json";

const chars = "awsg6x9h34j572uqr8feckz";

export const encode = (id: number) => {
  if (id < 0) {
    throw new Error("id cannot be negative");
  }

  const [first, ...rest] = [2, 1, 0].map(
    (pos) => Math.floor(id / chars.length ** pos) % chars.length
  );

  if (first > 0) {
    throw new Error("id is too large");
  }

  return rest.map((i) => chars.at(i)).join("");
};

export async function getCachedCardRatings(
  boomerMode: boolean = false,
  setCode?: string
): Promise<CardRating[]> {
  const expansion = (setCode ?? CURRENT_SET_CODE).toUpperCase();
  const url = `https://www.17lands.com/card_ratings/data?expansion=${expansion}&format=premierdraft&start_date=0`; // start_date=0 is a hack for FDN
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ratings: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected ratings response shape");
  }

  // If boomer mode is enabled, fetch first printing images for each card
  let processedCards = data;
  if (boomerMode) {
    // Select the appropriate first printings data based on set
    const firstPrintingsData = [...finFirstPrintings, ...eoeFirstPrintings];

    processedCards = data.map((card) => {
      return {
        ...card,
        first_printing_url: firstPrintingsData.find((c) => c.name === card.name)
          ?.first_printing?.url,
      };
    });
  }

  return processedCards
    .map((card) => ({
      name: card.name,
      ever_drawn_win_rate: card.ever_drawn_win_rate,
      url:
        boomerMode && card.first_printing_url
          ? card.first_printing_url
          : card.url,
      mtga_id: card.mtga_id,
    }))
    .sort((a, b) => b.mtga_id - a.mtga_id)
    .map((card, i) => ({
      ...card,
      id: encode(i),
    }));
}
