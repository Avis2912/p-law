// src/api/getAds.js
const BASE_URL = 'https://us-central1-pentra-claude-gcp.cloudfunctions.net/scrapeAds'

export default async function getAds(keyword) {

  const formattedKeyword = keyword.replace(/(^\w+:|^)\/\//, '');

  const startTime = Date.now();
  console.log('=== CLIENT REQUEST START ===');
  console.log('Time:', new Date().toISOString());
  console.log('Keyword:', keyword);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Base URL:', BASE_URL);

  if (!keyword) {
    console.error('No keyword provided');
    return { error: 'Keyword is required' };
  }

  console.log('Getting ads for:', keyword);

  try {
    const response = await fetch(`${BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly state CORS mode
      credentials: 'omit', // Changed from 'include' to 'omit'
      body: JSON.stringify({ keyword: formattedKeyword }), // Changed from { formattedKeyword }
    });

    // Add more detailed error logging
    if (!response.ok) {
      console.error('Response not OK:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers),
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('=== CLIENT RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    console.log('Raw Response:', text);

    const result = text ? JSON.parse(text) : null;
    console.log('Parsed Result:', result);
    return result;

  } catch (error) {
    console.error('=== CLIENT ERROR ===');
    console.error('Error Type:', error.constructor.name);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Duration:', Date.now() - startTime, 'ms');
    return { error: error.message };
  } finally {
    console.log('=== CLIENT REQUEST END ===');
    console.log('Total Duration:', Date.now() - startTime, 'ms');
  }
}