const BASE_URL = 'http://localhost:3040';

export default async function getAds(keyword) {
  if (!keyword) {
    console.error('No keyword provided');
    return [];
  }

  try {
    const response = await fetch(`${BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword }),
    });

    // Log the response status for debugging
    console.log('Response Status:', response.status);
    
    // Get the response as text first
    const responseBody = await response.text();
    console.log('Response Body:', responseBody);

    // Check if the response was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Try to parse the response body
    let result;
    try {
      result = JSON.parse(responseBody);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Invalid JSON response from server');
    }

    console.log('Parsed result:', result);
    return result || [];

  } catch (error) {
    console.error('Error in scrapeGoogleAdsLibrary:', error.message);
    // Return empty array instead of null to maintain consistency with other data fetching functions
    return [];
  }
}

// scrapeGoogleAdsLibrary('flair.ai');