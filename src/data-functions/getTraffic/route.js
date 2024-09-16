const axios = require('axios');

async function getTraffic(domain) {
  const trafficApiUrl = 'https://api.dataforseo.com/v3/traffic_analytics/domain_overview/live';
  const keywordsApiUrl = 'https://api.dataforseo.com/v3/domain_analytics/organic/organic_search_data/live';

  try {
    const trafficResponse = await axios({
      method: 'post',
      url: trafficApiUrl,
      data: [{
        "target": domain,
        "location_code": 2840,
        "language_code": "en"
      }],
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
      }
    });

    const keywordsResponse = await axios({
      method: 'post',
      url: keywordsApiUrl,
      data: [{
        "target": domain,
        "location_code": 2840,
        "language_code": "en",
        "limit": 10
      }],
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
      }
    });

    const trafficResult = trafficResponse.data.tasks[0].result[0];
    const keywordsResult = keywordsResponse.data.tasks[0].result[0];

    const trafficData = {
      TRAFFIC: trafficResult.metrics.slice(-6).map(month => ({
        date: month.date,
        visits: month.visits
      })),
      RANKING_FOR: keywordsResult.organic.top_keywords.slice(0, 10).map(keyword => ({
        keyword: keyword.keyword,
        position: keyword.position
      }))
    };

    return trafficData;
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    return { TRAFFIC: [], RANKING_FOR: [] };
  }
}

// Example usage
getTraffic('example.com').then(data => console.log(data));