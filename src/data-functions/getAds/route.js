const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3040'; // Ensure this matches the port your server is running on

async function scrapeGoogleAdsLibrary(keyword) {
  try {
    const response = await fetch(`${BASE_URL}/scrape`, { // Ensure this matches the endpoint defined in api.js
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    // Log the response status and body for debugging
    console.log('Response Status:', response.status);
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result = JSON.parse(responseBody);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
  return null;
}

// Example usage
scrapeGoogleAdsLibrary('flair.ai');

module.exports = scrapeGoogleAdsLibrary;