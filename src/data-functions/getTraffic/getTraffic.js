import axios from 'axios';

export default async function getTraffic(domains) {
  const isOne = domains.length === 1;

  const bulkTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/historical_bulk_traffic_estimation/live';
  const rankedTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live';

  try {
    const postData = (target) => [{
      "target": target,
      "location_code": 2840,
      "language_code": "en",
      "date_from": "2024-03-01",
      "date_to": "2024-09-01"
    }];

    const bulkPostData = [{
      "targets": domains,
      "location_code": 2840,
      "language_code": "en",
      "date_from": "2024-03-01",
      "date_to": "2024-09-01",
      "item_types": ["organic", "paid"]
    }];

    const bulkTrafficResponse = await axios({
      method: 'post',
      url: bulkTrafficUrl,
      data: bulkPostData,
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
      }
    });

    const rankedKeywordResponse = isOne ?
      await axios({
        method: 'post',
        url: rankedTrafficUrl,
        data: postData(domains[0]),
        headers: {
          'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
          'Content-Type': 'application/json'
        }
      }) :
      await Promise.all(domains.map(domain =>
        axios({
          method: 'post',
          url: rankedTrafficUrl,
          data: postData(domain),
          headers: {
            'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
            'Content-Type': 'application/json'
          }
        })
      ));

    const rankedSearches = isOne ? rankedKeywordResponse.data.tasks[0].result[0].items
      : rankedKeywordResponse.map(response => response.data.tasks[0].result[0].items).flat();
    const trafficStatsList = bulkTrafficResponse.data.tasks[0].result;

    const webTrafficData = isOne ? {
      TRAFFIC: trafficStatsList[0].items[0]
        .metrics.organic.map(item => ({
          YEAR: item.year,
          MONTH: item.month,
          VISITS: item.count,
          ETV: item.etv,
        })),
      RANKING_FOR: rankedSearches
        .map(item => ({
          KEYWORD: item.keyword_data.keyword,
          EST_VOLUME: item.keyword_data.keyword_info.search_volume,
          MONTHLY_SEARCHES: item.keyword_data.keyword_info.monthly_searches,
          COMPETITION: item.keyword_data.keyword_info.competition_level,
        }))
    } 
    
    : {
      TRAFFIC: trafficStatsList
        .map(resultsItem =>
          (resultsItem.items[0].metrics.organic
            .map(item => ({
              YEAR: item.year,
              MONTH: item.month,
              VISITS: item.visits,
              ETV: item.etv,
            }))
          )),
      RANKING_FOR:
        rankedSearches
          .map(array => (
            array.map(item => ({
              KEYWORD: item.keyword_data.keyword,
              EST_VOLUME: item.keyword_data.keyword_info.search_volume,
              MONTHLY_SEARCHES: item.keyword_data.keyword_info.monthly_searches,
              COMPETITION: item.keyword_data.keyword_info.competition_level,
            }))))
    };

    return webTrafficData;
  } catch (error) {
    console.error('Error fetching traffic data:', error.response ? error.response.data : error.message);
    return { TRAFFIC: [], RANKING_FOR: [] };
  }
}

// getTraffic(['ravaltriallaw.com', 'salesforce.com']).then(data => console.log(data));
