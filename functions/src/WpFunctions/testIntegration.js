import axios from "axios";

export async function integrateWp(user_id, user_app_password, siteUrl) {
    const formattedSiteUrl = siteUrl.replace('https://', '').replace('http://', '');
    const wp_url = `https://${formattedSiteUrl}/wp-json/wp/v2`;
    const wp_settings_url = wp_url + "/settings";

    const credentials = btoa(user_id + ':' + user_app_password);
    const header = { 'Authorization': 'Basic ' + credentials };

    try {
        const response = await axios.get(wp_settings_url, { headers: header });
        console.log('IntegrateWP Response: ', response.data); // Log the settings
        return response.data;
    } catch (error) {
        console.error("Error!", error);
        return null;
    }
}

export default integrateWp;