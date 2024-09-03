const axios = require('axios');

const siteId = 'class9b891823858.wordpress.com';
const apiUrl = `https://public-api.wordpress.com/wp/v2/sites/${siteId}/posts`;

async function getPosts() {
    try {
        const response = await axios.get(apiUrl);
        const posts = response.data;
        console.log('Retrieved posts from WordPress:', posts);
        return posts;
    } catch (error) {
        console.error('Error retrieving posts from WordPress:', error.response ? error.response.data : error.message);
        throw error;
    }
}

// Example usage
getPosts()
    .then(posts => {
        console.log(`Retrieved ${posts.length} posts from WordPress.`);
    })
    .catch(error => {
        console.error('Failed to retrieve posts:', error.response ? error.response.data : error.message);
    });