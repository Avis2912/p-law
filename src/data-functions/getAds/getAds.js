// src/api/getAds.js
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://app.pentra.club' 
  : 'http://localhost:3040';

export default async function getAds(keyword) {
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
      },
      body: JSON.stringify({ keyword }),
    });

    const text = await response.text();
    console.log('=== CLIENT RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    console.log('Raw Response:', text);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${text}`);
    }

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