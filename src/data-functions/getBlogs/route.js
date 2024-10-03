// import fetch from 'node-fetch';

export default async function getLatestPosts(site) {
  try {
    const response = await fetch(`https://${site}/wp-json/wp/v2/posts`);
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
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// getLatestPosts('ravaltriallaw.com');