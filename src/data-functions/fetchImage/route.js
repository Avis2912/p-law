const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

app.post('/fetchImage', async (req, res) => {
  try {
    const { description, imagesSettings } = req.body;
    const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
    const payload = JSON.stringify([{
        keyword: `${description}`,
        location_code: 2826, language_code: "en",
        device: "desktop", os: "windows", depth: 100,
        search_param: imagesSettings === 'Free' ? "&tbs=sur:cl" : ``,
    }]);

    const headers = {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
    };

    let counter = 0; let data = null; let tempUrl; let rIndex = 0;
    data = await fetch(url, { method: 'POST', headers, body: payload })
    .then(response => response.json())
    .catch(error => console.error('Error:', error));      
    while (counter < 3) {
      if (data.tasks[0].result[0].items[rIndex].source_url === undefined) {rIndex = Math.floor(Math.random() * 3); console.log('rerunn serp img, undefined: ', data.tasks[0].result[0].items[rIndex].source_url, 'img desc: ', description);} else {tempUrl = data.tasks[0].result[0].items[rIndex].source_url; console.log('img not undefined: ', tempUrl, 'img desc: ', description); break;};
    counter += 1; }

    res.json({ imageUrl: tempUrl });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error generating image. Please try again.' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));