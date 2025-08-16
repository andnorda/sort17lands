#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

// Function to get first printing image from Scryfall
async function getFirstPrintingImage(cardName) {
  try {
    // Search for the card on Scryfall
    const searchResponse = await fetch(
      `https://api.scryfall.com/cards/search?q=${encodeURIComponent(
        cardName
      )}&unique=prints&order=released`
    );
    
    if (!searchResponse.ok) {
      console.log(`Failed to search for ${cardName}: ${searchResponse.status}`);
      return null;
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.data || searchData.data.length === 0) {
      console.log(`No results found for ${cardName}`);
      return null;
    }

    // Filter to get the oldest non-promo printing
    const firstPrinting = searchData.data
      .filter((c) => c.name === cardName)
      .filter((c) => c.set_type !== "promo")
      .at(-1); // Get the last one (oldest) since they're ordered by release date

    if (!firstPrinting) {
      console.log(`No non-promo printing found for ${cardName}`);
      return null;
    }

    const imageUrl = firstPrinting.image_uris?.large || firstPrinting.image_uris?.normal || null;
    
    if (imageUrl) {
      console.log(`Found first printing for ${cardName}: ${firstPrinting.set_name} (${firstPrinting.released_at})`);
      return {
        url: imageUrl,
        set_name: firstPrinting.set_name,
        released_at: firstPrinting.released_at,
        set_type: firstPrinting.set_type
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Failed to fetch first printing for ${cardName}:`, error);
    return null;
  }
}

// Function to fetch 17Lands data
async function fetch17LandsData() {
  try {
    console.log('Fetching 17Lands data for EOE...');
    const response = await fetch(
      'https://www.17lands.com/card_ratings/data?expansion=eoe&format=premierdraft'
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch 17Lands data: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.length} cards in EOE set`);
    return data;
  } catch (error) {
    console.error('Error fetching 17Lands data:', error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Fetch 17Lands data
    const cards = await fetch17LandsData();
    
    // Process each card to get first printing
    console.log('\nFetching first printing images for each card...');
    const cardsWithFirstPrintings = [];
    
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      console.log(`Processing ${i + 1}/${cards.length}: ${card.name}`);
      
      const firstPrinting = await getFirstPrintingImage(card.name);
      
      const cardData = {
        name: card.name,
        mtga_id: card.mtga_id,
        color: card.color,
        rarity: card.rarity,
        ever_drawn_win_rate: card.ever_drawn_win_rate,
        url: card.url, // Original 17Lands URL
        first_printing: firstPrinting
      };
      
      cardsWithFirstPrintings.push(cardData);
      
      // Add a small delay to be respectful to the APIs
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Save to JSON file
    const outputPath = path.join(__dirname, 'eoe-first-printings.json');
    await fs.writeFile(outputPath, JSON.stringify(cardsWithFirstPrintings, null, 2));
    
    console.log(`\n✅ Successfully processed ${cardsWithFirstPrintings.length} cards`);
    console.log(`📁 Data saved to: ${outputPath}`);
    
    // Print summary
    const withFirstPrintings = cardsWithFirstPrintings.filter(c => c.first_printing).length;
    const withoutFirstPrintings = cardsWithFirstPrintings.filter(c => !c.first_printing).length;
    
    console.log(`\n📊 Summary:`);
    console.log(`   Cards with first printing images: ${withFirstPrintings}`);
    console.log(`   Cards without first printing images: ${withoutFirstPrintings}`);
    console.log(`   Success rate: ${((withFirstPrintings / cardsWithFirstPrintings.length) * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { fetch17LandsData, getFirstPrintingImage };
