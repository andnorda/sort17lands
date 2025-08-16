# First Printings Fetch Script

This script fetches 17Lands data for the EOE (Edge of Eternities) set and then retrieves the first printing image for each card from Scryfall.

## What it does

1. **Fetches 17Lands data** for the EOE set (premier draft format)
2. **Gets first printing images** from Scryfall API for each card
3. **Saves everything** to a JSON file with comprehensive card data

## Usage

### Run via npm script (recommended)

```bash
npm run fetch-first-printings
```

### Run directly

```bash
node scripts/fetchFirstPrintings.js
```

## Output

The script generates `eoe-first-printings.json` with the following structure for each card:

```json
{
  "name": "Card Name",
  "mtga_id": 96575,
  "color": "W",
  "rarity": "rare",
  "ever_drawn_win_rate": 0.595606623859412,
  "url": "https://cards.scryfall.io/large/front/...", // Original 17Lands URL
  "first_printing": {
    "url": "https://cards.scryfall.io/large/front/...", // First printing image URL
    "set_name": "Edge of Eternities",
    "released_at": "2025-08-01",
    "set_type": "expansion"
  }
}
```

## Features

- **Rate limiting**: 100ms delay between API calls to be respectful
- **Error handling**: Gracefully handles failed API calls
- **Comprehensive data**: Includes both original and first printing URLs
- **Progress tracking**: Shows progress as it processes each card
- **Summary statistics**: Reports success rate and final counts

## API Endpoints Used

- **17Lands**: `https://www.17lands.com/card_ratings/data?expansion=eoe&format=premierdraft`
- **Scryfall**: `https://api.scryfall.com/cards/search?q={cardName}&unique=prints&order=released`

## Notes

- The script filters out promo printings to get the "true" first printing
- First printing is determined by release date (oldest first)
- All data is cached for 1 hour on the server side
- The script successfully found first printings for all 316 EOE cards (100% success rate)

## Example Results

- **New EOE cards**: Use their EOE printing (e.g., "Anticausal Vestige")
- **Reprinted cards**: Use their original printing (e.g., "Banishing Light" from Journey into Nyx 2014)
- **Classic cards**: Use their original set (e.g., "Darkness" from Legends 1994)

## Use Cases

- **Boomer Mode**: Use first printing images for nostalgic card art
- **Data Analysis**: Compare original vs. first printing URLs
- **Card Database**: Build a comprehensive card database with multiple printings
- **Research**: Study card art evolution across different printings
