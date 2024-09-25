import axios from 'axios';

const apiUrl = 'https://api.dataforseo.com/v3/serp/google/jobs/task_post';

export default async function getJobs(keyword) {
  try {
    const postData = [];
    postData.push({
      "language_code": "en",
      "location_code": 2840,
      "keyword": keyword
    });

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
  
    setTimeout(async () => {
      const results = await fetchResults(taskId);
      console.log('Results:', results);
    }, 10000);

  } catch (error) {
    console.error('Error posting task:', error.response.data);
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

    const jobs = response.data.tasks[0].result[0].items || response.data.tasks[0];
    console.log('Jobs:', jobs);
    return jobs;
  } catch (error) {
    console.error('Error fetching results:', error.response?.data?.tasks?.Jobs?.status_message || error.message);
    return [];
  }
}

getJobs('uvalle law firm');