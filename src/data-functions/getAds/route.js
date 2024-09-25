import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3030'; // Replace with your actual base URL

export default async function scrapeGoogleAdsLibrary(keyword) {
  try {
    const response = await fetch(`${BASE_URL}/api/scrape`, {
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
}

// Example usage
scrapeGoogleAdsLibrary('flair.ai');