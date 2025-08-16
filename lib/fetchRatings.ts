import { CURRENT_SET_CODE } from "./config";
import { CardRating } from "../types/ratings";

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

// Function to get first printing image from Scryfall
async function getFirstPrintingImage(cardName: string): Promise<string | null> {
  try {
    // Search for the card on Scryfall
    const searchResponse = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        cardName
      )}&unique=prints&order=released`,
      { next: { revalidate: 3600 } }
    );

    if (!searchResponse.ok) return null;

    const searchData = await searchResponse.json();
    if (!searchData.data || searchData.data.length === 0) return null;

    // Get the oldest nonfoil printing
    const firstPrinting = searchData.data.filter((c) => c.nonfoil).at(-1);
    return (
      firstPrinting.image_uris?.large ||
      firstPrinting.image_uris?.normal ||
      null
    );
  } catch (error) {
    console.error(`Failed to fetch first printing for ${cardName}:`, error);
    return null;
  }
}

export async function getCachedCardRatings(
  boomerMode: boolean = false
): Promise<CardRating[]> {
  const url = `https://www.17lands.com/card_ratings/data?expansion=${CURRENT_SET_CODE}&format=premierdraft`;
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
    const cardsWithFirstPrintings = await Promise.all(
      data.map(async (card) => {
        const firstPrintingUrl = await getFirstPrintingImage(card.name);
        return {
          ...card,
          first_printing_url: firstPrintingUrl || card.url, // Fallback to original URL if first printing not found
        };
      })
    );
    processedCards = cardsWithFirstPrintings;
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
