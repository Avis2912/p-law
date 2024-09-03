import axios from 'axios';

async function publishBlog(user_id, user_app_password, siteUrl, htmlContent, titleTag, scheduledFor=null) {

    const article_title = htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`))[1];
    const formattedContent = htmlContent.replace(new RegExp(`<${titleTag}>.*?</${titleTag}>`, 'g'), '');
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_post_url = wp_url + "/posts";

    const credentials = btoa(user_id + ':' + user_app_password);
    const header = { 'Authorization': 'Basic ' + credentials };

    const post_data = {
        "title": article_title,
        "content": htmlContent,
        "comment_status": "closed",
        "categories": [1],
        "status": scheduledFor ? 'future' : 'publish',
        ...(scheduledFor && { "date": '2024-08-31T12:00:00' }),
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