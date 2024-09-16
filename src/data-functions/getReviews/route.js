const axios = require('axios');

const apiUrl = 'https://api.dataforseo.com/v3/business_data/google/reviews/task_post';

async function getReviews(keyword) {
  try {
    const postData = [{
      "location_name": "United States",
      "language_name": "English",
      "keyword": keyword,
      "depth": 20,
      "sort_by": "newest"
    }];

    const response = await axios.post(apiUrl, postData, {
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
    }
    });

    const taskId = response.data.tasks[0].id;
    console.log(`Task ID: ${taskId}`);
  
    setTimeout(() => {
      const results = fetchResults(taskId);
      return results;
    }, 10000);

  } catch (error) {
    console.error('Error posting task:', error.response.data);
  }
}

async function fetchResults(taskId) {
  const resultUrl = `https://api.dataforseo.com/v3/business_data/google/reviews/task_get/${taskId}`;
  
  try {
    const response = await axios.get(resultUrl, {
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
    }
    });

    const reviews = response.data.tasks[0].result[0].items;
    console.log('Reviews:', reviews);
    return reviews;
  } catch (error) {
    console.error('Error fetching results:', error.response.data);
    return [];
  }
}

getReviews('ravaltriallaw.com');