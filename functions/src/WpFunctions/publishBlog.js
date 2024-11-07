import axios from 'axios';

async function getImageBlob(imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'blob' });
        return response.data;
    } catch (error) {
        console.error("Error fetching image:", error);
        throw error;
    }
}

async function uploadImage(user_id, user_app_password, siteUrl, imageUrl) {
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_media_url = wp_url + "/media";

    const credentials = btoa(user_id + ':' + user_app_password);
    
    try {
        // Get image data
        const imageData = await getImageBlob(imageUrl);
        const fileName = imageUrl.split('/').pop() || 'image.jpg';

        const header = {
            'Authorization': 'Basic ' + credentials,
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': imageData.type
        };

        const response = await axios.post(wp_media_url, imageData, { headers: header });
        return response.data.id;
    } catch (error) {
        console.error("Error uploading image:", error.response?.data || error.message);
        return null;
    }
}

async function publishBlog(user_id, user_app_password, siteUrl, htmlContent, titleTag, scheduledFor=null) {
    const article_title = htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`)) ? htmlContent.match(new RegExp(`<${titleTag}>(.*?)</${titleTag}>`))[1] : 'Untitled';
    const formattedContent = htmlContent.replace(new RegExp(`<${titleTag}>.*?</${titleTag}>`, 'g'), '').replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '$1');
    const formattedContent1 = formattedContent.replace(/(<img[^>]*)(>)/g, '$1 style="max-width: 100%;"$2');
    const formattedContent2 = formattedContent1
    .replace(/<p>\s*<\/p>/g, '').replace('45', '35')
    .replace(/(<table(?=\s|>))/g, '<table style="border-collapse: collapse; width: 100%;"')
    .replace(/(<td(?=\s|>))/g, '<td style="border: 1px solid black; padding: 4px; padding-left: 8px;"');
    const imageUrl = htmlContent.match(/<img[^>]*src="([^"]*)"[^>]*>/)[1];
    
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_post_url = wp_url + "/posts";

    const credentials = btoa(user_id + ':' + user_app_password);
    const header = { 'Authorization': 'Basic ' + credentials };

    console.log('HTML:', formattedContent2);

    // Upload the image and get the media ID
    const mediaId = await uploadImage(user_id, user_app_password, siteUrl, imageUrl);

    const post_data = {
        "title": article_title,
        "content": formattedContent2,
        "categories": [1],
        "status": scheduledFor ? 'future' : 'publish',
        ...(scheduledFor && { "date": scheduledFor }), // Use provided schedule date
        "featured_media": mediaId,
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