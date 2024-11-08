const modelKeys = {
  1: 'claude-3-haiku-20240307',
  2: 'claude-3-5-sonnet-20240620',
  3: 'claude-3-opus-20240229',
  // 3: 'claude-3-sonnet-20240229',
} 

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://pentra-hub.firebaseio.com'
});

exports.generateWeeklyPosts = functions.pubsub.schedule("5 0 * * 1").timeZone("America/Chicago").onRun(async (context) => {
  const db = admin.firestore();

  const adminDoc = await db.collection("admin").doc("firms").get();
  const activeFirms = adminDoc.data().ACTIVE_FIRMS;

  for (const firmId of activeFirms) {
    await generatePostsForFirm(firmId);
  }

  return null;
});

async function generatePostsForFirm(firmId) {
  const db = admin.firestore();
  const firmDoc = await db.collection("firms").doc(firmId).get();
  const firmData = firmDoc.data();

  console.log('FIRM DATA: ', firmData);
  const firmName = firmData.FIRM_INFO.NAME;
  const firmImage = firmData.FIRM_INFO.IMAGE;
  const firmSite = firmData.FIRM_INFO.CONTACT_US;
  const customColor = firmData.CHAT_INFO.THEME || "#000000";
  const firmDescription = firmData.FIRM_INFO.DESCRIPTION;
  const imagesSettings = firmData.SETTINGS.IMAGES;
  const genPostPlatform = ""; // You'll need to implement logic to determine this
  const selectedModel = 1; // You'll need to implement logic to determine this
  const bigBlogString = firmData.BLOG_DATA.BIG_BLOG || [];

  const posts = await writeWeeklyPosts(
      bigBlogString,
      firmName,
      firmImage,
      firmSite,
      customColor,
      firmDescription,
      imagesSettings,
      genPostPlatform,
      selectedModel,
      admin.auth(),
      db,
      true // isImagesOn
  );

  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;

  console.log('POSTS IN MAIN FUNC: ', posts);
  await db.collection("firms").doc(firmId).update({
    "WEEKLY_POSTS.POSTS": posts,
    "WEEKLY_POSTS.LAST_DATE": formattedDate,
  });
}

async function writeWeeklyPosts(bigBlogString, firmName, firmImage, firmSite, customColor, firmDescription, imagesSettings, genPostPlatform, selectedModel, auth, db, isImagesOn) {
  console.log("WEEKLY POSTS ACTIVATED");
  let tempPosts = [];
  const platforms = ["LinkedIn"];

  for (const tempPlatform of platforms) {
    let isError; let tries = 0;
    let textWithoutImages;

    do {
      isError = false;
      tries += 1;

      const response = await fetch("https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelKeys[selectedModel],
          messages: [
            { role: "user", content: `
            <role> You are Pentra AI, an attorney at ${firmName}.
            ${firmName} Description: ${firmDescription}. </role> 
            
            <instruction>
            YOUR GOAL: Write 3 FULL EDUCATIONAL ${tempPlatform} posts from the perspective of ${firmName}. Don't be generic and corporate but be approachable and genuinely informative. Don't be lazy.

            IMPORTANT INSTRUCTIONS:
            - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps, 
            EXAMPLE OUTPUT: "[{"platform": "${tempPlatform}", "content": "*Post Content*"}, {"platform": "${tempPlatform}", "content": "*Post Content*"}, {"platform": "${tempPlatform}", "content": "*Post Content*"}]". 
            ONLY OUTPUT THE ARRAY. NOTHING ELSE.
            - POST FORMAT: Wrap titles in <h2> tags. Wrap EVERY paragraph in <p> tags. don't use list tags.
            - Be truly informative about a relevant topic, and mention the firm at the end. Add hashtags in a new paragraph at the very end.
            ${tempPlatform === "LinkedIn" ? "- PARAGRAPH COUNT: these posts should be 5-6 paragraphs long." :
              tempPlatform === "Facebook" ? "- PARAGRAPH COUNT: these posts should be 4-5 paragraphs long." :
              "- PARAGRAPH COUNT: these posts should be 1 paragraph long."}
            - IMAGES: post should contain 1 image, placed right after the h2 post title. Please add it in this format: //Image: {short image description}//.
            - Array should be in proper format: [{}, {}, {}]. </instruction>

            Pull from in the following blog posts only if useful information is contained:

            ${bigBlogString}
            ` },
          ],
        }),
      });

      let gptResponse = await response.text();
      console.log(gptResponse);

      gptResponse = gptResponse.replace(/<br\s*\/?>/gi, "").replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, "$&<br>").replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, "$&<br>");
      const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

      try {
        console.log("SANITIZED RESPONSE: ", sanitizedResponse);
        textWithoutImages = JSON.parse(sanitizedResponse);
      
      } catch (err) {
        isError = true;
        console.log("TEMP ERROR: ", err);
      }
    } while (isError && tries < 3);

    console.log('TEXT WOUT IMAGES: ', textWithoutImages);
    let textWithImages = textWithoutImages;

    if (isImagesOn) {
      textWithImages = await addImages(textWithoutImages, imagesSettings, firmName, firmImage, firmSite, customColor);
    }

    tempPosts = tempPosts.concat(textWithImages);
    console.log(`TEMP POSTS (${tempPlatform} DONE): `, tempPosts);
  }

  return tempPosts;
}

const templates = [
  { title: 'Legal', titleType: true, imgType: false, isCaps: false, id: 'f360d9d3-434e-489c-8502-9026c541df8b', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-03%20at%2012.02.08%E2%80%AFAM.png?alt=media&token=f207e707-10cc-4b5b-ac64-0d7f285adb62' },
  { title: 'Legal', titleType: false, imgType: false, isCaps: false, id: '5972339a-bd3c-4608-ad00-0e02dc887195', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-03%20at%2012.39.27%E2%80%AFAM.png?alt=media&token=60a63e69-5e4c-415f-b5a8-3aeda19ef83a' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: '78ff1eaa-ed4f-44e6-82a8-730aa0952499', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-14%20at%202.58.33%E2%80%AFAM.png?alt=media&token=17decfe5-6a2b-415f-91b3-7fd7cc67b55e' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: 'b678796f-976a-4f2c-8350-57e4a64029f1', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-09%20at%203.02.07%E2%80%AFAM.png?alt=media&token=7507c8a5-4f0d-4d00-a6bb-3754ad3a3fd0' },

  { title: 'Legal', titleType: true, imgType: true, isCaps: true, id: '256576e6-4634-4ed1-9b2e-07e9be11e996', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-14%20at%203.00.11%E2%80%AFAM.png?alt=media&token=e91ad2c6-c7ef-40fb-97e0-a389385fa5e3' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: true, id: '75ebc6ac-b11c-4452-8537-20a3e5fd5ddd', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-02%20at%2011.57.08%E2%80%AFPM.png?alt=media&token=4317ded0-cf03-412d-a02d-0479e89353e8' },
  { title: 'Legal', titleType: true, imgType: true, isCaps: false, id: '4cc38a38-534f-4e5b-82ed-11be890d9c72', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-03%20at%2012.40.44%E2%80%AFAM.png?alt=media&token=e2b34e55-e641-4bfe-9e99-a0eff84bdb08' },
  { title: 'Legal', titleType: false, imgType: true, isCaps: false, id: '26564e2c-7af5-4a21-b5f8-0d6b5a96715a', thumbnail: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/templates%2FScreenshot%202024-05-09%20at%202.54.05%E2%80%AFAM.png?alt=media&token=3a166a19-fcac-41b1-aee2-02b69c7e3efe' },
]

const addImages = async (posts, imagesSettings='All', firmName, firmImage, firmSite, customColor) => {
  const regex = /\/\/Image: (.*?)\/\//g; 
  // const templateSetting = 'Brand'; const isTemplatesOn = (templateSetting === 'Brand' || templateSetting === 'Brand & Web');
  const isTemplatesOn = true; const templateSetting = 'Brand';

  const fetchBrandImage = async (imgDescription, post='') => { // 1.5c per image
    let resultImg = null; const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const h2Title = randomTemplate.isCaps ? post.content.match(/<h2>(.*?)<\/h2>/)[1].toUpperCase() : post.content.match(/<h2>(.*?)<\/h2>/)[1]; const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const secondSentFirstPara = (post.content.match(/<p>(.*?)<\/p>/) || [''])[0].split('. ')[1].replace(/<\/?p>|<\/?b>/g, '') || (post.content.match(/<p>(.*?)<\/p>/) || [''])[0].split('. ')[0].replace(/<\/?p>|<\/?b>/g, '') || '';      
    const timeToRead = Math.ceil(post.content.split(' ').length / 200); let formattedFirmSite = '';
    try {formattedFirmSite = new URL('').firmSite.replace(/^www\./, '');} catch (e) {console.error(e);}
    const aiText = randomTemplate.titleType ? h2Title : `"${secondSentFirstPara}"`; let webPic = '';
    
    if (templateSetting === 'Brand & Web' && Math.random() < 0.5) {return fetchWebImage(imgDescription);}
    if (randomTemplate.imgType) {webPic = await fetchWebImage(imgDescription, true);} console.log('fetching bg img')
    console.log('WEB PIC: ', webPic); 

    await fetch('https://api.templated.io/v1/render', {
      method: 'POST',
      async: false,
      body: JSON.stringify({
        "template" : randomTemplate.id,
        "async" : false,
        "layers" : {
          "primary-text" : {
            "text" : aiText,
          },
          "shape-0" : {
            "stroke": customColor,
          },
          "firm-name" : {
            "text": firmName,
          },
          "firm-site" : {
            "text": formattedFirmSite,
          },
          "firm-img": {
            "image_url" : firmImage,
          },
          "date-today" : {
            "text": formattedDate,
          },
          "read-time" : {
            "text": `  ${timeToRead} MIN READ`,
          },
          "primary-img" : {
              "image_url": webPic,
          },

        }
      }),
      headers: {
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer 6986627b-2860-4083-adc1-aceb9c3cc052`
      }
    })
    .then(response => {if(!response.ok){console.log('Network response was not ok')};   return response.json(); })
    .then(data => {console.log(data); resultImg = `<image src="${data.render_url}" alt="Branded Image" />`;})
    .catch(error => {console.error('Error:', error);});

    return resultImg;
  }

  let isNewPost = true;

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
        console.log('POST CONTENTT: ', post.content);
        const matches = [...imagefullText.matchAll(regex)];
        const descriptions = matches.map(match => match[1]);
        console.log('IS TEMPLATES ON: ', isTemplatesOn);
        const imageTags = await Promise.all(descriptions.map((desc, it) => new Promise(resolve => setTimeout(() => resolve(isTemplatesOn ? fetchBrandImage(desc, post) : fetchWebImage(desc)), it * 200))));
        
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
  console.log('POSTS WITH IMAGES: ', postsWithImages);
  return postsWithImages; 
}

exports.manuallyTriggerWeeklyPosts = functions.https.onRequest(async (req, res) => {
  const { firmId } = req.body;

  console.log(`Received request with firmId: ${firmId}`);

  if (!firmId) {
    res.status(400).send("The function must be called with a firmId.");
    return;
  }

  await generatePostsForFirm(firmId);

  res.send({ success: true, message: "Weekly posts generated successfully." });
});