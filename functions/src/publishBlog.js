import axios from 'axios';

async function publishBlog(user_id, user_app_password, siteUrl, htmlContent, titleTag, scheduledFor=null) {

    // const article_title = htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`))[1];
    const formattedContent = htmlContent.replace(new RegExp(`<${titleTag}>.*?</${titleTag}>`, 'g'), '').replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');
    const formattedContent1 = formattedContent.replace(/(<img[^>]*)(>)/g, '$1 style="max-width: 100%;"$2');
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_post_url = wp_url + "/posts";

    const credentials = btoa(user_id + ':' + user_app_password);
    const header = { 'Authorization': 'Basic ' + credentials };

    console.log('HTML:', formattedContent1);

    const post_data = {
        "title": "article_title",
        "content": `<table border="1" style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="padding: 10px;">Factor</th>
          <th style="padding: 10px;">Description</th>
        </tr>
        <tr>
          <td style="padding: 10px;">Income Generation</td>
          <td style="padding: 10px;">The business should generate sufficient income to support more than just the E1 visa holder and their family.</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Job Creation</td>
          <td style="padding: 10px;">The enterprise should have the potential to create jobs for U.S. workers.</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Future Growth Potential</td>
          <td style="padding: 10px;">There should be a clear path for business expansion and increased trade volume.</td>
        </tr>
        <tr>
          <td style="padding: 10px;">Impact on U.S. Economy</td>
          <td style="padding: 10px;">The business should contribute positively to the local or national economy.</td>
        </tr>
      </table>`,
        "categories": [1],
        "status": scheduledFor ? 'future' : 'publish',
        ...(scheduledFor && { "date": '2024-08-31T12:00:00' }),
        // "title": 'article_title',
        // "content": `<p>hey</p>  
        // <img src="https://cdn.audleytravel.com/3551/2537/79/1333985-na-pali-coastline--kauai-hawaii.jpg" alt="image" style="max-width: 100%" />`,
        // "comment_status": "closed",
        // "featured_media": 0,
    };

    try {
        const response = await axios.post(wp_post_url, post_data, { headers: header });
        console.log(response); // Log the entire response
        return response;
    } catch (error) {
        console.error("Error!", error);
        return null;
    }
}

export default publishBlog;