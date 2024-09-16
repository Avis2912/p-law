const fetch = require('node-fetch');

async function getLatestPosts() {
  const response = await fetch('https://ravaltriallaw.com/wp-json/wp/v2/posts');
  const posts = await response.json();

  const blogsRetrieved = posts.map(post => ({
    TITLE: post.title.rendered,
    DATE: new Date(post.date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    LINK: post.link
  }));

  console.log('Blogs Retrieved:', blogsRetrieved);
  return blogsRetrieved;
}

getLatestPosts();