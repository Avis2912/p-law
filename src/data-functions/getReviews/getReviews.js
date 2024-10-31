import axios from 'axios';

const apiUrl = 'https://api.dataforseo.com/v3/business_data/google/reviews/task_post';

export default async function getReviews(keyword) {

  const formattedKeyword = keyword.replace(/(^\w+:|^)\/\//, '');

  try {
    const postData = [{
      "location_name": "United States",
      "language_name": "English",
      "keyword": formattedKeyword,
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
  
    // Convert setTimeout to a Promise
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    const results = await fetchResults(taskId);
    return results;

  } catch (error) {
    console.error('Error posting task:', error.response?.data || error);
    return [];
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

    const reviews = response.data.tasks[0].result[0].items
    .map(item => ({
      NAME: item.profile_name,
      PFP: item.profile_image_url,
      RATING: item.rating.value,
      REVIEW: item.review_text,
      REVIEW_URL: item.review_url,
      DATE: item.time_age
    })) || [];

    console.log('Reviews:', reviews);
    return reviews;

  } catch (error) {
    console.error('Error fetching results:', error.response?.data || error);
    return [];
  }
}

// getReviews('ravaltriallaw.com');