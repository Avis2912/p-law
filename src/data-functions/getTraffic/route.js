import axios from 'axios';

export default async function getTraffic(domains) {
  const bulkTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_bulk_traffic_estimation/live';
  const rankedTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live';
  
  try {
    const postData = [{
      "targets": [domains],
      "location_code": 2840,
      "language_code": "en",
      "date_from": "2024-03-01",
      "date_to": "2024-09-01"
    }];

    // const bulkTrafficResponse = await axios({
    //     method: 'post', url: bulkTrafficUrl, data: postData,
    //     headers: {
    //       'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
    //       'Content-Type': 'application/json'
    //     } 
    // });

    // const organicSearches = bulkTrafficResponse.result.items.organic;

    const rankedKeywordResponse = await axios({
        method: 'post',
        url: rankedTrafficUrl,
        data: postData,
        headers: {
          'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
          'Content-Type': 'application/json'
        }
      });

    const rankedSearches = rankedKeywordResponse.result.items[0].monthly_searches;

    const trafficData = {
      TRAFFIC: rankedSearches.map(item => ({
        year: item.year,
        month: item.month,
        visits: item.count,
      })),
      RANKING_FOR: [],
    };

    return trafficData;
  } catch (error) {
    console.error('Error fetching traffic data:', error.response ? error.response.data : error.message);
    return { TRAFFIC: [], RANKING_FOR: [] };
  }
}

// Example usage
getTraffic('ravaltriallaw.com').then(data => console.log(data));