// src/api/getAds.js
const BASE_URL = process.env.NODE_ENV === 'production'
  ? '' // Remove /api prefix
  : 'http://localhost:3040'; // Remove /api prefix

export default async function getAds(keyword) {
  if (!keyword) {
    console.error('No keyword provided');
    return [];
  }

  console.log('Getting ads for:', keyword);

  try {
    const response = await fetch(`${BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Parsed result:', result);
    return result || [];

  } catch (error) {
    console.error('Error in getAds:', error.message);
    return [];
  }
}

// scrapeGoogleAdsLibrary('flair.ai');