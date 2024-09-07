import axios from 'axios';

async function publishBlog(user_id, user_app_password, siteUrl, htmlContent, titleTag, scheduledFor=null) {

    const article_title = htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`)) ? htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`))[1] : 'Untitled';
    const formattedContent = htmlContent.replace(new RegExp(`<${titleTag}>.*?</${titleTag}>`, 'g'), '').replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');
    const formattedContent1 = formattedContent.replace(/(<img[^>]*)(>)/g, '$1 style="max-width: 100%;"$2');
    const formattedContent2 = formattedContent1
    .replace(/<p>\s*<\/p>/g, '').replace('45', '35')
    .replace(/(<table(?=\s|>))/g, '<table style="border-collapse: collapse; width: 100%;"')
    .replace(/(<td(?=\s|>))/g, '<td style="border: 1px solid black; padding: 4px; padding-left: 8px;"');
    
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_post_url = wp_url + "/posts";

    const credentials = btoa(user_id + ':' + user_app_password);
    const header = { 'Authorization': 'Basic ' + credentials };

    console.log('HTML:', formattedContent2);

    const post_data = {
        "title": article_title,
        "content": formattedContent2,
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