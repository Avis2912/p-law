const modelKeys = {
    1: 'claude-3-haiku-20240307',
    2: 'claude-3-5-sonnet-20240620',
    3: 'claude-3-opus-20240229',
    // 3: 'claude-3-sonnet-20240229',
  } 
  
  const functions = require("firebase-functions");
  const admin = require("firebase-admin");
  const fetch = require("node-fetch");
  
  admin.initializeApp();
  
  exports.generateWeeklyBlogs = functions.pubsub.schedule("5 0 * * 1").timeZone("America/Chicago").onRun(async (context) => {
    const db = admin.firestore();
  
    const adminDoc = await db.collection("admin").doc("firms").get();
    const activeFirms = adminDoc.data().ACTIVE_FIRMS;
  
    for (const firmId of activeFirms) {
      await generateBlogsForFirm(firmId);
    }
  
    return null;
  });

  let sources;

  async function generateBlogsForFirm(firmId) {
    const db = admin.firestore();
    const firmDoc = await db.collection("firms").doc(firmId).get();
    const firmData = firmDoc.data();

    let firmName, firmImage, contactUsLink, customColor, firmDescription, imagesSettings, plan, genPostPlatform, selectedModel, bigBlogString, smallBlogArray, smallBlogString, internalLinks;
  
    console.log('FIRM DATA: ', firmData);
    firmName = firmData.FIRM_INFO.NAME;
    firmImage = firmData.FIRM_INFO.IMAGE;
    contactUsLink = firmData.FIRM_INFO.CONTACT_US;
    customColor = firmData.CHAT_INFO.THEME || "#000000";
    firmDescription = firmData.FIRM_INFO.DESCRIPTION;
    imagesSettings = firmData.SETTINGS.IMAGES;
    plan = firmData.FIRM_INFO.PLAN;
    genPostPlatform = ""; // You'll need to implement logic to determine this
    selectedModel = 1; // You'll need to implement logic to determine this
    bigBlogString = firmData.BLOG_DATA.BIG_BLOG || [];

    smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
    // smallBlogString = smallBlogArray.map(index => `[${bigBlogString[index]?.TITLE || ''}]: ${bigBlogString[index]?.CONTENT || ''}`).join('\n'); 
    internalLinks = bigBlogString.map(blog => `${blog.TITLE}: ${blog.LINK}`).join('\n');
  
    const posts = await writeWeeklyBlogs (
        firmData,
        contactUsLink, 
        internalLinks, 
        bigBlogString, 
        firmName, 
        selectedModel, 
        browseWeb, 
        addImages,
        plan,
        true, //isImagesOn
    );
  
    const currentDate = new Date();
    const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
  
    console.log('POSTS IN MAIN FUNC: ', posts);
    await db.collection("firms").doc(firmId).update({
      "WEEKLY_POSTS.POSTS": posts,
      "WEEKLY_POSTS.LAST_DATE": formattedDate,
    });
  }



    async function writeWeeklyBlogs (
    firmData,
    contactUsLink, 
    internalLinks, 
    bigBlogString, 
    firmName, 
    selectedModel, 
    browseWeb, 
    addImages,
    plan,
    isImagesOn, 
    ) {

    console.log('ACTIVATED WRITE WEEKLY BLOGS');
    let tempPosts = []; const numberOfBlogs = 1; 
    let isError = false; let firmNameInt; let firmDescriptionInt; let internalLinksInt; let contactUsLinkInt; let smallBlogInt; let blogTitlesInt; let imagesSettingsInt;
        firmNameInt = firmData.FIRM_INFO.NAME; firmDescriptionInt = firmData.FIRM_INFO.DESCRIPTION; 
        const linksArray = firmData.BLOG_DATA.BIG_BLOG.map(blog => blog.LINK); 
        const blogTitlesArray = firmData.BLOG_DATA.BIG_BLOG.map(blog => blog.TITLE); blogTitlesInt = blogTitlesArray.join(", ");
        internalLinksInt = JSON.stringify(firmData.BLOG_DATA.BIG_BLOG.map(blog => ({title: blog.TITLE, link: blog.LINK}))); imagesSettingsInt = firmData.SETTINGS.IMAGES;
        contactUsLinkInt = firmData.FIRM_INFO.CONTACT_US; console.log('contact us link: ', contactUsLinkInt); console.log('internal links: ', internalLinksInt); 
        const bigBlog = firmData.BLOG_DATA.BIG_BLOG; const smallBlogArray = firmData.BLOG_DATA.SMALL_BLOG || [];
        smallBlogInt = smallBlogArray.map(index => `[${bigBlog[index]?.TITLE || ''}]: ${bigBlog[index]?.CONTENT || ''}`).join('\n');


    const response0 = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: plan === 'Trial Plan' ? modelKeys[2] : modelKeys[2], 
        messages: [{ role: "user", content: `
        <instruction> 
        GIVE ME A JSON PARSABLE ARRAY WITH SHORT BUT 12 VERY SPECIFIC BLOG TITLES. 
        
        Make them very, very specific and relevant to ${firmNameInt}, a law firm described as the following: "${firmDescriptionInt}".

        - FOLLOW THE TITLING STYLE FROM PREVIOUS TITLES (BUT DONT COPY OUTRIGHT): ${blogTitlesInt}
        - MAKE SURE: ALL 12 TITLES MUST BE DISTINCTLTY DIFFERENT. Use tangentially related topics to go after long tail keywords if required.
        - OUTPUT FORMAT: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5", "Title 6", "Title 7", "Title 8", "Title 9", "Title 10", "Title 11", "Title 12"]
        - DONT OUT ANYTHING ELSE. DONT START BY SAYING ANYTHING. JUST. OUTPUT. THE. ARRAY.
        </instruction>
        ` }
        ]})});

    let gptResponse0; try { gptResponse0 = JSON.parse(await response0.text()); } catch (error) { console.error(error); } console.log(gptResponse0);
    const shuffledArray = gptResponse0.sort(() => 0.5 - Math.random());
    const titleArray = shuffledArray.slice(0, numberOfBlogs);
    console.log('contact us link: ', contactUsLinkInt);
    console.log('internal links: ', internalLinksInt);


    for (let i = 0; i < numberOfBlogs; i += 1) {

        let browseTextResponse = "";
        // eslint-disable-next-line no-await-in-loop
        browseTextResponse = JSON.stringify((await browseWeb(titleArray[i])).hits.map(({snippet, title, link}) => ({title, snippet, link})));
        console.log('browseTextResponse: ', browseTextResponse);

        // eslint-disable-next-line no-await-in-loop
        const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: modelKeys[selectedModel], 
        messages: [
            { role: "user", content: `
            
            <role>You are Pentra AI, a friendly, witty lawyer & expert SEO writer for ${firmNameInt}. ${firmNameInt} is described as such: ${firmDescriptionInt}.
            Mention ${firmNameInt} ONLY at the end. </role> 

            <instruction>

            IMPORTANT INSTRUCTIONS:
            - TOPIC: This post is on ${titleArray[i]}. Use exactly this title.
            - FORMATTING: Wrap titles in <h1> and sub-titles in <h2> tags. Wrap all paragraphs (and everything else that should have a line after) in <p> tags. Use b tags only in same-line text or 'title: paragraph'.
            - PERSPECTIVE: Don't refer to yourself in the post. Explain how your firm ${firmNameInt} can help, but only at the end. 
            - WORD RANGE: this post should be 1000+ WORDS LONG.
            - IMAGES: blog post should contain 2-3 images. Please add representations of them in this format: //Image: {Image Description}//. 
            Consider putting them right after h2 titles. Make sure these are evenly spaced out in the post and with specific descriptions.
            - FACTS & LAW: Reference data & law in the blog post if & when necessary. Dont make things up.
            - LINK TO RELEVANT POSTS: Use <a> tags to add link(s) to relevant blog posts from the firm wherever applicable: ${internalLinksInt}.
            - CONTACT US LINK AT END: Use this contact us link with <a> tags at the end: ${contactUsLinkInt}
            - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. 

            </instruction>

            ${browseTextResponse !== "" && 
            `WEB RESULTS: Consider using the following web information I got from an LLM:
            <web-information> ${browseTextResponse} </web-information>`}

            VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT ALSO MUST BE FRIENDLY & APPROACHABLE. BLOGS:

            <example-blogs>
            ${smallBlogInt}
            </example-blogs>
            ` }

            // TEXT DUMP
            // ${isMimicBlogStyle && 
            //   `VERY VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT MUST BE FRIENDLY & APPROACHABLE.
            //  ${smallBlog}`} 
            // - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
            // - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
            // - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}


        ] })
        });


        // eslint-disable-next-line no-await-in-loop
        let gptResponse = (await response.text()); console.log(gptResponse);
        // eslint-disable-next-line no-await-in-loop
        gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|<\/ul>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/<\/ol>/gi, '$&<br><br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');
        const postTitle = gptResponse.match(/<h1>(.*?)<\/h1>/i)[1]; 
        // eslint-disable-next-line no-control-regex
        const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); let textWithoutImages;
        try { textWithoutImages = [{content: sanitizedResponse}] } catch (err) {isError = true; console.log(err)};
        console.log(textWithoutImages); let textWithImages = textWithoutImages;
        // eslint-disable-next-line no-await-in-loop
        if (isImagesOn) {textWithImages = await addImages(textWithoutImages, imagesSettingsInt);}
        // eslint-disable-next-line no-await-in-loop
        tempPosts = tempPosts.concat(textWithImages); console.log(`TEMP BLOGS ${i} DONE): `, tempPosts); 
    };

    return tempPosts;

};

const browseWeb = (prompt) => {

    const youUrl = `https://us-central1-pentra-claude-gcp.cloudfunctions.net/youAPIFunction`;
    const apiKey = '7cc375a9-d226-4d79-b55d-b1286ddb4609<__>1P4FjdETU8N2v5f458P2BaEp-Pu3rUjGEYkI4jh';
    const query = encodeURIComponent(
    `GIVE FACTUAL LEGAL INFORMATION SPECIFICALLY ON: ${prompt}.
      DONT DEVIATE FROM THE PROMPT.
    `);

    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: query,
      })
    };

    return fetch(youUrl, options)
    .then(response => response.json())
    .then(data => {console.log('YOU DATA: ', data); sources = data.hits; return data;})
    .catch(err => {console.error(err); return err;});
}


const addImages = async (posts, imagesSettings='All') => {
    const regex = /\/\/Image: (.*?)\/\//g;

    const fetchImage = async (description) => {
      let resultImg = null; 
      const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
      const payload = JSON.stringify([{
          keyword: `${description}`,
          location_code: 2826, language_code: "en",
          device: "desktop", os: "windows", depth: 100,
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
        if (data.tasks[0].result[0].items[rIndex].source_url === undefined) {rIndex = Math.floor(Math.random() * 3); console.log('rerunn serp img, undefined: ', data.tasks[0].result[0].items[rIndex].source_url, 'img desc: ', description);} else {tempUrl = data.tasks[0].result[0].items[rIndex].source_url; console.log('img not undefined: ', tempUrl, 'img desc: ', description); break;};
      counter += 1; }

      resultImg = `<img src="${tempUrl}" alt="${description}"/>`;

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
          const matches = [...imagefullText.matchAll(regex)];
          const descriptions = matches.map(match => match[1]);
          const imageTags = await Promise.all(descriptions.map(fetchImage));

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



  exports.manuallyTriggerWeeklyBlogs = functions.https.onRequest(async (req, res) => {
    const { firmId } = req.body;
  
    console.log(`Received request with firmId: ${firmId}`);
  
    if (!firmId) {
      res.status(400).send("The function must be called with a firmId.");
      return;
    }
  
    await generateBlogsForFirm(firmId);
  
    res.send({ success: true, message: "Weekly blogs generated successfully." });
  });