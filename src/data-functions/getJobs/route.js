import axios from 'axios';

const apiUrl = 'https://api.dataforseo.com/v3/serp/google/jobs/task_post';

export default async function getJobs(keyword) {
  try {
    const postData = [{
      "language_code": "en",
      "location_code": 2840,
      "keyword": keyword
    }];

    const response = await axios({
      method: 'post',
      url: apiUrl,
      data: postData,
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
      }
    });

    const taskId = response.data.tasks[0].id;
    console.log(`Task ID: ${taskId}`);
  
    // Convert setTimeout to a Promise
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    const results = await fetchResults(taskId);
    console.log('Results:', results);
    return results;

  } catch (error) {
    console.error('Error posting task:', error.response?.data || error);
    return [];
  }
}

async function fetchResults(taskId) {
  const resultUrl = `https://api.dataforseo.com/v3/serp/google/jobs/task_get/advanced/${taskId}`;
  
  try {
    const response = await axios.get(resultUrl, {
      headers: {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
      }
    });

    const jobs = response.data.tasks[0].result[0].items
    // .map(item => ({
      
    // })) || [];
    console.log('Jobs:', jobs);

    if (!Array.isArray(jobs)) {return [];}    
    return jobs;

  } catch (error) {
    console.error('Error fetching results:', error.response?.data?.tasks?.Jobs?.status_message || error.message);
    return [];
  }
}

// getJobs('uvalle law firm');