import { getDoc, doc } from '@firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';

export const newsletterTemplates = [
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: '88e62b0b-9879-4d56-af23-1b32afbf1457' },
  { title: 'Legal', titleType: true, imgType: false, isCaps: false, id: 'f360d9d3-434e-489c-8502-9026c541df8b' },
  { title: 'Legal', titleType: false, imgType: false, isCaps: false, id: '5972339a-bd3c-4608-ad00-0e02dc887195' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: '78ff1eaa-ed4f-44e6-82a8-730aa0952499' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: 'b678796f-976a-4f2c-8350-57e4a64029f1' },
];

export const addNewsletterImages = async (newsletterDescription, content, selectedTemplates=[0, 1, 2, 3]) => {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    let firmName = "", firmImage = "", contactUsLink = "", customColor = "";
    
    if (userDoc.exists()) {
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {
        firmName = firmDoc.data().FIRM_INFO.NAME;
        firmImage = firmDoc.data().FIRM_INFO.IMAGE;
        contactUsLink = firmDoc.data().FIRM_INFO.CONTACT_US;
        customColor = firmDoc.data().CHAT_INFO.THEME || "#000000";
      }
    }

    const fetchWebImage = async (description, justUrl=false) => {
      let resultImg = null; 
      const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
      const payload = JSON.stringify([{
          keyword: `${description}`,
          location_code: 2826,
          language_code: "en",
          device: "desktop",
          os: "windows",
          depth: 100
      }]);

      const headers = {
          'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
          'Content-Type': 'application/json'
      };

      const data = await fetch(url, { method: 'POST', headers, body: payload })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));

      const tempUrl = data?.tasks[0]?.result[0]?.items[0]?.source_url;
      resultImg = justUrl ? tempUrl : `<img src="${tempUrl}" alt="${description}"/>`;
      return resultImg;
    };

    const randomTemplate = newsletterTemplates[selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)]];
    const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    let firmSite = contactUsLink;
    try {
      firmSite = new URL(contactUsLink).hostname.replace(/^www\./, '');
    } catch (e) {
      console.error(e);
    }

    let resultImg = null;
    const webPic = randomTemplate.imgType ? await fetchWebImage("newsletter hero image", true) : null;

    await fetch('https://api.templated.io/v1/render', {
      method: 'POST',
      body: JSON.stringify({
        "template": randomTemplate.id,
        "layers": {
          "primary-text": {
            "text": newsletterDescription,
          },
          "shape-0": {
            "stroke": customColor,
          },
          "firm-name": {
            "text": firmName,
          },
          "firm-site": {
            "text": firmSite,
          },
          "firm-img": {
            "image_url": firmImage,
          },
          "date-today": {
            "text": formattedDate,
          },
          "read-time": {
            "text": "5 MIN READ",
          },
          "primary-img": {
            "image_url": webPic,
          },
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_TEMPLATED_API_KEY}`
      }
    })
    .then(response => response.json())
    .then(data => {
      resultImg = `<img src="${data.render_url}" alt="Newsletter Image" />`;
    })
    .catch(error => console.error('Error:', error));

    return resultImg;
};