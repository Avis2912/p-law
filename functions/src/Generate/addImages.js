import { getDoc, doc, collection, getDocs, updateDoc } from '@firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import { templates } from 'src/genData/templates';

export const addImages = async (posts, imagesSettings='All', selectedTemplates=[0, 1, 2, 3, 4, 5],
    isNewPost=true, customImg='', customText='', 
) => {
    const regex = /\/\/Image: (.*?)\/\//g; 
    const isTemplatesOn = imagesSettings === 'Brand' || imagesSettings === 'Brand & Web';

    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    let firmName = "", firmDescription = "", firmImage = "", contactUsLink = "", customColor = "";
    
    if (userDoc.exists()) {
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {
        firmName = firmDoc.data().FIRM_INFO.NAME;
        firmDescription = firmDoc.data().FIRM_INFO.DESCRIPTION;
        firmImage = firmDoc.data().FIRM_INFO.IMAGE;
        contactUsLink = firmDoc.data().FIRM_INFO.CONTACT_US;
        customColor = firmDoc.data().CHAT_INFO.THEME || "#000000";
      }
    }

    const fetchBrandImage = async (imgDescription, post='') => { // 1.5c per image
      let resultImg = null; const randomTemplate = templates[selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)]];
      
      // Safer title extraction
      let h2Title = 'Newsletter';
      try {
        const titleMatch = post.content.match(/<h2>(.*?)<\/h2>/);
        if (titleMatch && titleMatch[1]) {
          h2Title = randomTemplate.isCaps ? titleMatch[1].toUpperCase() : titleMatch[1];
        }
      } catch (e) {
        console.error('Error extracting title:', e);
      }

      // Safer first paragraph extraction
      let secondSentFirstPara = '';
      try {
        const paraMatch = post.content.match(/<p>(.*?)<\/p>/);
        if (paraMatch && paraMatch[0]) {
          const sentences = paraMatch[0].split('. ');
          secondSentFirstPara = sentences[1] ? 
            sentences[1].replace(/<\/?p>|<\/?b>/g, '') : 
            sentences[0].replace(/<\/?p>|<\/?b>/g, '');
        }
      } catch (e) {
        console.error('Error extracting paragraph:', e);
        secondSentFirstPara = 'Legal insights from our team';
      }

      const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const timeToRead = Math.ceil(post.content.split(' ').length / 200); let firmSite = contactUsLink;
      try {firmSite = new URL(contactUsLink).hostname.replace(/^www\./, '');} catch (e) {console.error(e);}
      const aiText = randomTemplate.titleType ? h2Title : `"${secondSentFirstPara}"`; let webPic = null;
      
      if (imagesSettings === 'Brand & Web' && Math.random() < 0.5) {return fetchWebImage(imgDescription);}
      if (customImg !== '') {webPic = customImg;} else {if (randomTemplate.imgType) {webPic = await fetchWebImage(imgDescription, true);} console.log('fetching bg img')}
      console.log('WEB PIC: ', webPic); 

      await fetch('https://api.templated.io/v1/render', {
        method: 'POST',
        async: false,
        body: JSON.stringify({
          "template": randomTemplate.id,
          "async": false,
          "layers": {
            "primary-text": {
              "text": customText === '' ? aiText : customText,
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
              "text": `  ${timeToRead} MIN READ`,
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
      .then(response => {if(!response.ok){console.log('Network response was not ok')};   return response.json(); })
      .then(data => {console.log(data); resultImg = `<image src="${data.render_url}" alt="Branded Image" />`;})
      .catch(error => {console.error('Error:', error);});

      return resultImg;
    }


    const fetchWebImage = async (description, justUrl=false) => { // 0.2c per image
      let resultImg = null; 
      const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
      const payload = JSON.stringify([{
          keyword: `${description}`,
          location_code: 2826,
          language_code: "en",
          device: "desktop",
          os: "windows",
          depth: 100,
          search_param: imagesSettings === 'Free' ? "&tbs=sur:cl" : ``,
      }]);

      const headers = {
          'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
          'Content-Type': 'application/json'
      };

      let counter = 0; let data = null; let tempUrl; let rIndex = 0;
      // eslint-disable-next-line no-await-in-loop
      data = await fetch(url, { method: 'POST', headers, body: payload })
      .then(response => response.json())
      .catch(error => console.error('Error:', error));
      while (counter < 3) {
        if (data.tasks[0].result[0].items[rIndex].source_url === undefined) {
          rIndex = Math.floor(Math.random() * 3);
          console.log('rerunn serp img, undefined: ', data.tasks[0].result[0].items[rIndex].source_url, 'img desc: ', description);
        } else {
          tempUrl = data.tasks[0].result[0].items[rIndex].source_url;
          console.log('img not undefined: ', tempUrl, 'img desc: ', description);
          break;
        }
        counter += 1;
      }

      resultImg = justUrl ? `${tempUrl}` : `<img src="${tempUrl}" alt="${description}"/>`;


      return resultImg;
    };

    const postsWithImages = [];
    console.log('IN FUNC')

    try {
      for (let i = 0; i < posts.length; i += 3) {
        console.log('IMAGE API CALLED');
        const batch = posts.slice(i, i + 3);
        // eslint-disable-next-line no-await-in-loop
        const batchPostsWithImages = await Promise.all(batch.map(async (post) => {
          let imagefullText = post.content;
          console.log('POST CONTENT: ', post.content);
          const matches = [...imagefullText.matchAll(regex)];
          const descriptions = matches.map(match => match[1]);
          const imageTags = await Promise.all(descriptions.map((desc, it) => new Promise(resolve => setTimeout(() => resolve(isTemplatesOn && isNewPost ? fetchBrandImage(desc, post) : fetchWebImage(desc)), it * 200))));
          
          matches.forEach((match, index) => {
            if (imageTags[index]) {
              imagefullText = imagefullText.replace(match[0], imageTags[index]);
            }
          });

          console.log('IMAGE TAGS: ', imageTags, 'IMGFULL: ', imagefullText);


          return {
            ...post,
            content: imagefullText,
          };
        }));

        postsWithImages.push(...batchPostsWithImages);
        console.log('BPWI:', postsWithImages);

        if (i + 3 < posts.length) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }

    return postsWithImages; 
  }