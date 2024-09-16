import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage, uploadBytes } from 'firebase/storage';

import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import { modelKeys } from 'src/genData/models';

// eslint-disable-next-line import/no-relative-packages
import { writeWeeklyPosts } from '../../../../functions/src/Weekly/writeWeeklyPosts';
import PostCard from '../post-card';

const isImagesOn = true;


// ----------------------------------------------------------------------

export default function BlogView() {

  const [postDescription, setPostDescription] = useState('');
  const [postKeywords, setPostKeywords] = useState('');
  const [browseText, setBrowseText] = useState('');

  const [isNewPost, setIsNewPost] = useState(false);
  const [isUseNews, setIsUseNews] = useState(false);
  const [isUseBlog, setIsUseBlog] = useState(false);
  const [genPostPlatform, setGenPostPlatform] = useState(null);
  const [imageSettings, setImageSettings] = useState('Brand & Web');
  const [style, setStyle] = useState('Unstyled');
  const [wordRange, setWordRange] = useState('2');
  const [isUseCreativeCommons, setIsUseCreativeCommons] = useState(false);

  const [isFeedbackMode, setIsFeedbackMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [timeToUpdate, setTimeToUpdate] = useState("");
  const [isUpdateTime, setIsUpdateTime] = useState(false);

  const [selectedModel, setSelectedModel] = useState(2);
  const [weeklyPosts, setWeeklyPosts] = useState([]);
  const [bigBlogString, setBigBlogString] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmImage, setFirmImage] = useState('');
  const [contactUsLink, setContactUsLink] = useState('');

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState([0, 1, 2, 3, 4, 5]);
  const [isCustomText, setIsCustomText] = useState(false);
  const [isCustomColor, setIsCustomColor] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('#000000');
  const [customImg, setCustomImg] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);


  const updateDays = 7;
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

  // PAGE LOAD FUNCTIONS


  const addImages = async (posts, imagesSettings='All') => {
    const regex = /\/\/Image: (.*?)\/\//g; 
    const isTemplatesOn = (imagesSettings === 'Brand' || imagesSettings === 'Brand & Web');

    const fetchBrandImage = async (imgDescription, post='') => { // 1.5c per image
      let resultImg = null; const randomTemplate = templates[selectedTemplates[Math.floor(Math.random() * selectedTemplates.length)]];
      const h2Title = randomTemplate.isCaps ? post.content.match(/<h2>(.*?)<\/h2>/)[1].toUpperCase() : post.content.match(/<h2>(.*?)<\/h2>/)[1]; const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      const secondSentFirstPara = (post.content.match(/<p>(.*?)<\/p>/) || [''])[0].split('. ')[1].replace(/<\/?p>|<\/?b>/g, '') || (post.content.match(/<p>(.*?)<\/p>/) || [''])[0].split('. ')[0].replace(/<\/?p>|<\/?b>/g, '') || '';      
      const timeToRead = Math.ceil(post.content.split(' ').length / 200); let firmSite = contactUsLink;
      try {firmSite = new URL(contactUsLink).hostname.replace(/^www\./, '');} catch (e) {console.error(e);}
      const aiText = randomTemplate.titleType ? h2Title : `"${secondSentFirstPara}"`; let webPic = null;
      
      if (imagesSettings === 'Brand & Web' && Math.random() < 0.5) {return fetchWebImage(imgDescription);}
      if (customImg !== '') {webPic = customImg;} else {if (randomTemplate.imgType) {webPic = await fetchWebImage(imgDescription, true);} console.log('fetching bg img')}
      console.log('WEB PIC: ', webPic); 

      await fetch('https://api.templated.io/v1/render', {
        method: 'POST',
        body: JSON.stringify({
          "template" : randomTemplate.id,
          "layers" : {
            "primary-text" : {
              "text" : customText === '' ? aiText : customText,
            },
            "shape-0" : {
              "fill": customColor,
            },
            "firm-name" : {
              "text": firmName,
            },
            "firm-site" : {
              "text": firmSite,
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
          'Authorization' : `Bearer ${import.meta.env.VITE_TEMPLATED_API_KEY}`
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

  const writePosts = () => {
    writeWeeklyPosts(bigBlogString, firmName, genPostPlatform, selectedModel, auth, db, modelKeys, addImages, isImagesOn);
  }

  useEffect(() => {

    if (isUpdateTime) {setWeeklyPosts([]); return;}; 

    if (genPostPlatform) {
      if (genPostPlatform === "LinkedIn") {
        setWeeklyPosts([
          { platform: "LinkedIn", content: "" },
          { platform: "LinkedIn", content: "" },
          { platform: "LinkedIn", content: "" }, 
        ]);
      } else if (genPostPlatform === "Facebook") {
        setWeeklyPosts([
          { platform: "Facebook", content: "" },
          { platform: "Facebook", content: "" },
          { platform: "Facebook", content: "" }, 
        ]);
      } else if (genPostPlatform === "Instagram") {
        setWeeklyPosts([
          { platform: "Instagram", content: "" },
          { platform: "Instagram", content: "" },
          { platform: "Instagram", content: "" }, 
        ]);
      }
    }
    
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            const lastDateParts = await firmDoc.data().WEEKLY_POSTS.LAST_DATE.split('/');
            const lastDate = await new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = await updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            await setSelectedModel(firmDoc.data().SETTINGS.MODEL);
            if (firmDoc.data().WEEKLY_POSTS.LAST_DATE === "") {setIsUpdateTime(true); return;}
            await setFirmImage(firmDoc.data().FIRM_INFO.IMAGE); await setCustomColor(firmDoc.data().CHAT_INFO.THEME);
            setFirmName(firmDoc.data().FIRM_INFO.NAME); setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US); console.log('FIRM CONTACT: ', firmDoc.data().FIRM_INFO.CONTACT_US);
            await setWeeklyPosts(firmDoc.data().WEEKLY_POSTS.POSTS || []); console.log('DIFF DAYS: ', diffDays);
            if (diffDays >= 1) { await setTimeToUpdate(diffDays); } else { setIsUpdateTime(true); writePosts(); console.log('WRITING POSTS'); setWeeklyPosts([]); 
              await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_POSTS.LAST_DATE': "" }); }
            
            // GET BIG BLOG DATA

            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG;
            const selectedBlogs = [];
            const numBlogsToSelect = Math.min(4, bigBlog.length);
            for (let i = 0; i < numBlogsToSelect; i += 1) {
              const randomIndex = Math.floor(Math.random() * bigBlog.length);
              selectedBlogs.push(bigBlog[randomIndex]);
              bigBlog.splice(randomIndex, 1);
            }
            const bigBlogData = selectedBlogs.map(blog => `${blog.TITLE}: ${blog.CONTENT}`).join('\n\n');
            setBigBlogString(bigBlogData);
            // console.log(bigBlogData);

            console.log(firmDoc.data().WEEKLY_POSTS.POSTS);
          }}
      } catch (err) {
        console.log(err);
      }
    };

    if (!genPostPlatform) {getFirmData()};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewPost, genPostPlatform]);
    
  
  
  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    if (genPostPlatform) {setGenPostPlatform(null)} 
    else {setGenPostPlatform("LinkedIn")};
  }

  const generatePosts = async () => {
    setIsGenerating(true);
      const messages = []; 

      let firmNameInt; let firmDescriptionInt; let imagesSettingsInt;
      const userDocInt = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDocInt.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDocInt.data().FIRM));
      if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; imagesSettingsInt = firmDoc.data().SETTINGS.IMAGES;}};

      let browseTextResponse = "";

      if (isUseNews) {browseTextResponse = await browseWeb(browseText); console.log('PERPLEXITY: ', browseTextResponse);};
      messages.push({
        "role": "user", 
        "content":  `<instruction> You are Pentra AI, a lawyer working at ${firmNameInt}, described as ${firmDescriptionInt}.  
        YOUR GOAL: Write 3 informative posts for ${genPostPlatform} ${postDescription !== "" && `based roughly on the following topic: ${postDescription}.`}. 
        
        IMPORTANT INSTRUCTIONS:
        - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps, 
        EXAMPLE OUTPUT: "[{"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}]". 
        ONLY OUTPUT THE ARRAY. NOTHING ELSE. Make sure to put quotes at the ends of the content string.
        - Wrap titles in <h2> tags. Wrap EVERY paragraph in <p> tags.
        - PARAGRAPH COUNT: these posts should be ${wordRange} paragraphs long. 
        - IMAGES: post should contain 1 image, placed after the h2 post title. Please add it in this format: //Image: {relevant description}//.
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
        - ${postKeywords !== "" && `KEYWORDS: Use the following keywords in your posts: ${postKeywords}.`}
        - ${style !== "Unstyled" && `STYLE: This post should SPECIFICALLY be written in the ${style} style.`}
        - DONT ADD ANY SPACE BETWEEN THE JSON AND ARRAY BRACKETS. It should be proper [{}, {}, {}].
        </instruction>

        - ${isUseBlog && `BLOGS: Use the following blogs from the firm to source content from: ${bigBlogString}.`}

        `
      });
      


    let gptResponse; let textWithoutImages; let isError; let tries = 0;
    do { isError = false; tries += 1; 
    // eslint-disable-next-line no-await-in-loop
    const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ messages, blogDescription: postDescription, blogKeywords: postKeywords,
      model: modelKeys[selectedModel] })
    });
    // eslint-disable-next-line no-await-in-loop
    gptResponse = (await response.text()); console.log(gptResponse);
    gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');  
    // eslint-disable-next-line no-await-in-loop
    try { textWithoutImages = JSON.parse(gptResponse.trim().replace(/^```|```$/g, '').replace(/json/g, '')); } catch (error) { if (tries < 3) {console.log('rerun'); isError = true;} else { isError = true; } } } 
    while (isError && tries < 3);

    let textWithImages = textWithoutImages; console.log(textWithoutImages);
    if (isImagesOn) {textWithImages = await addImages(textWithoutImages, imagesSettingsInt);}
    await setGeneratedPosts(textWithImages);
    await setWeeklyPosts(textWithImages);   
    console.log(weeklyPosts);
    setIsGenerating(false);

    try {
      const firmDatabase = collection(db, 'firms');
      const data = await getDocs(firmDatabase);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      const firmDoc = data.docs.find((docc) => docc.id === userDoc.data().FIRM);
      if (firmDoc) {  
        const firmDocRef = doc(db, 'firms', firmDoc.id);
        const currentDate = new Date(); const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)} | ${currentDate.getHours() % 12 || 12}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const genPosts = firmDoc.data().GEN_POSTS || [];
        const newPost = { [formattedDate]: textWithImages }; genPosts.unshift(newPost);
        await updateDoc(firmDocRef, { GEN_POSTS: genPosts });
    }} catch (err) {console.log('ERRORRRRRR', err);}
    
  }

  const handleOpen = () => {setIsDialogOpen(true);};
  const handleClose = () => {setIsDialogOpen(false);};
  const handleOpen2 = () => {setIsDialogOpen2(true);};
  const handleClose2 = () => {setIsDialogOpen2(false);};
  const handleTemplatesOpen = () => {setIsTemplatesOpen(true);};
  const handleTemplatesClose = () => {setIsTemplatesOpen(false);};


  const browseWeb = (prompt) => {
    const apiKey = `${import.meta.env.VITE_PERPLEXITY_API_KEY}`;
    const apiUrl = 'https://api.perplexity.ai';

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3-sonar-large-32k-online',
        messages: [
          { role: 'system', content: 'Be precise and detailed. Mention sources and dates everywhere you can. Keep the current date in mind when generating.' },
          { role: 'user', content: prompt }
        ]
      })
    };

    return fetch(`${apiUrl}/chat/completions`, requestOptions)
      .then(response => response.json())
      .then(data => data.choices[0].message.content)
      .catch(error => console.error(error));
  }

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `user_imgs/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    document.getElementById('userImage').src = fileUrl;
    setCustomImg(fileUrl); console.log('IMAGE SET: ', fileUrl);
  }

  return (
    <Container>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      {isUpdateTime && <>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '325px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '1.05px',  
      fontWeight: 800, fontSize: '60.75px'}}> 
        🧱 Writing Posts...
      </Typography>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '407.5px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '-0.05px',  fontWeight: 500, fontSize: '25.75px'}}> 
        {`Return in ~5 minutes and they'll be ready!`}
      </Typography> </>}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={isNewPost ? 0.5 : 1.5}>
        
      <PageTitle title={`${isNewPost ? 'Create New Posts' : 'Weekly Social Media Posts'}`} />    
        
        <Stack direction="row" spacing={2}  mt={-2}>
        {isNewPost && (<>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (wordRange) {
          case "2": setWordRange("3"); break;
          case "3": setWordRange("4"); break;
          case "4": setWordRange("5"); break;
          case "5": setWordRange("5+"); break;
          case "5+": setWordRange("1"); break;
          case "1": setWordRange("2"); break;
          default: setWordRange("2");
        }
      }}
      sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
      {wordRange} Paras </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (style) {
          case "Unstyled": setStyle("How-To Guide"); break;
          case "How-To Guide": setStyle("Narrative"); break;
          case "Narrative": setStyle("Pointers"); break;
          case "Pointers": setStyle("Case Study"); break;
          case "Case Study": setStyle("Comparision"); break;
          case "Comparision": setStyle("Case Law Breakdown"); break;
          case "Case Law Breakdown": setStyle("Unstyled"); break;
          default: setStyle("Unstyled");
        }
      }}
        sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        {style} </Button>

        <Button variant="contained" sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, }})} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => {
          switch (genPostPlatform) {
          case "LinkedIn": setGenPostPlatform("Facebook"); break;
          case "Facebook": setGenPostPlatform("Instagram"); break;
          case "Instagram": setGenPostPlatform("LinkedIn"); break;
          default: setGenPostPlatform("LinkedIn");
        }}}>
          {genPostPlatform}
        </Button>

        {(imageSettings !== 'No' && imageSettings !== 'Web') && (<>
        <Button variant="contained" onClick={() => {handleTemplatesOpen()}} startIcon={<Iconify icon="solar:posts-carousel-horizontal-bold" />}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'pointer', fontWeight: '600', ':hover&': {backgroundColor: theme.palette.primary.navBg}})}>
          Branded
        </Button> </>)}
        </>)}


       {!isNewPost && (<>
        <Button variant="contained" onClick={() => {}} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover' : {backgroundColor: theme.palette.primary.navBg,}})}>
          {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Update In Progress'}
        </Button>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="streamline:artificial-intelligence-spark-solid" sx={{height: '16px', width: '16px'}}/>}
         onClick={() => {setIsFeedbackMode(!isFeedbackMode); handleOpen2();}} sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          AI Settings
        </Button>
        </>)}
        
        <Button variant="contained" color="inherit" startIcon={<Iconify icon={isNewPost ? "charm:cross" : "eva:plus-fill"} />} onClick={() => handleClickRoute()}
        sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isNewPost ? 'Close Creator' : ' New Post'}
        </Button>
      </Stack></Stack>

      {isNewPost ? <>
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
    
      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      <TextField
       value={postDescription}
       onChange={(e) => setPostDescription(e.target.value)}
       placeholder='Post Description'
       sx={{width: '70%'}} />

      <TextField
       value={postKeywords}
       onChange={(e) => setPostKeywords(e.target.value)}
       placeholder='Post Keywords'
       sx={{width: '30%'}} />
       </Stack>
       
        <Button onClick={() => {generatePosts()}}
        variant="contained" color="inherit" 
        sx={{height: '54px', width: '150px'}}>
          Generate ✨
        </Button>
        </Stack>
        </> : null}

        {isUseNews && (<>
        <Stack direction="row" spacing={2} alignItems="center" mt={0} mb={3}>
        
        <Button onClick={() => {}}
        variant="contained" color="inherit" 
        sx={{height: '54px', width: '150px', cursor: 'default'}}>
          Search For 
          <Iconify icon="eva:arrow-right-fill" />
        </Button>

        <TextField
        value={browseText}
        onChange={(e) => setBrowseText(e.target.value)}
        placeholder='Personal Injury News in the last 7 days'
        sx={{width: '100%', mt: 0, }} /> 
        </Stack>
       </>)}

      <Grid container spacing={3} sx={{width: '100%'}}>
        {weeklyPosts.map(({ platform, content }, index) => (
          <PostCard key={index} platform={platform} content={content} index={index} isGen={isGenerating} />
        ))}
      </Grid>

      {isNewPost && (<>
      <Stack direction="row" spacing={2} mt={3}>

        <Button variant="contained" sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, }, cursor: 'default'})}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>

        <Button variant="contained" sx={(theme) => ({backgroundColor: imageSettings !== "No" ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, }})} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => {
          switch (imageSettings) {
          case "Brand & Web": setImageSettings("Brand"); break;
          case "Brand": setImageSettings("Web"); break;
          case "Web": setImageSettings("No"); break;
          case "No": setImageSettings("Brand & Web"); break;
          default: setImageSettings("Brand & Web");
        }}}>
          {imageSettings} Images
        </Button>

        <Button variant="contained" sx={(theme) => ({backgroundColor: isUseNews ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, }})} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => setIsUseNews(!isUseNews)}>
          Use News
        </Button>

        <Button variant="contained" sx={(theme) => ({backgroundColor: isUseBlog ? theme.palette.primary.green :'grey', '&:hover': { backgroundColor: theme.palette.primary.green, }})} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => setIsUseBlog(!isUseBlog)}>
          Use Blogs
        </Button>


      </Stack> 

      </>)}

      <Dialog open={isTemplatesOpen} onClose={handleTemplatesClose} 
      PaperProps={{ style: { minHeight: '650px', minWidth: '980px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '635px', height: '675px', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px', pt: '40px', overflow: 'auto' }}>

        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px', userSelect: 'none',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Brand Templates</Typography>
        
        <Grid container spacing={5} sx={{width: '635px'}}>
          {templates.map((template, index) => (
            <Grid item xs={12} sm={6} md={4} lg={5} key={index}>
              <Card 
                sx={{ width: '237.5px', height: '237.5px', backgroundColor: 'darkred', borderRadius: '5.5px', 
                border: selectedTemplates.includes(index) ? '5px solid darkred' : 'none' }} 
                onClick={() => setSelectedTemplates(selectedTemplates.includes(index) ? selectedTemplates.filter(i => i !== index) : selectedTemplates.concat(index))}>
                <img src={template.thumbnail} style={{height: '100%', width: '100%', borderRadius: '1px'}} alt=""/>
              </Card>
            </Grid>
          ))}
        </Grid>

        </Card>
        <Card sx={(theme) => ({ width: '355px', height: '675px', backgroundColor: theme.palette.primary.navBg, 
        borderRadius: '0px', p: '55px', pt: '40px' })}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px', userSelect: 'none',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px', color: 'white'}}> 
        Options</Typography>
        
        <input type="file" id="fileInput" onChange={handleUpload} style={{ display: 'none' }} />
        <Card sx={{backgroundColor: 'transparent', height: '235px', width: '232.5px', borderRadius: '0px'}} onClick={() => document.getElementById('fileInput').click()}>
        <img src={customImg !== '' ? customImg : "https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdecentral__33_-removebg-preview.png?alt=media&token=21964431-cfc1-40fb-ba8e-ccc17012798c"}
          id="userImage" alt="" style={{height: '100%', width: '100%', borderRadius: '4px', cursor: 'pointer',}} /> 
        </Card>


        {!isCustomText && <Button variant="contained" onClick={() => {setIsCustomText(true)}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.lighter, '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none', }, boxShadow: 'none', fontWeight: '500', letterSpacing: '-0.55px',
        mt: '25px', width: '232.5px', fontSize: '15.5px', p: '10px', borderRadius: '7px', paddingInline: '20px', color: 'black', 
        display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
          <Iconify icon="quill:text-left" sx={{minHeight: '18.5px', minWidth: '18.5px', color: 'black', marginRight: '5px'}}/>
          Enter Your Own Text
        </Button>}

        {isCustomText && <TextField 
        sx={(theme) => ({backgroundColor: theme.palette.primary.lighter, '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none', }, boxShadow: 'none', fontWeight: '500', letterSpacing: '-0.55px',
        mt: '25px', width: '232.5px', fontSize: '15.5px', borderRadius: '7px', color: 'black', 
        display: 'flex', justifyContent: 'center', minWidth: '10px',})}
        value={customText} onChange={(e) => setCustomText(e.target.value)}
        placeholder='Enter Your Text' size='small' />}

        {!isCustomColor && <Button variant="contained" onClick={() => {setIsCustomColor(true)}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.lighter, '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none', }, boxShadow: 'none', fontWeight: '500', letterSpacing: '-0.55px', 
        mt: '20px', width: '232.5px', fontSize: '15.5px', p: '10px', borderRadius: '7px', paddingInline: '20px', color: 'black', 
        display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
          <Iconify icon="ph:drop-light" sx={{minHeight: '18.5px', minWidth: '18.5px', color: 'black', marginRight: '5px'}}/>
          Change Main Color
        </Button>}

        
        {isCustomColor && <Stack spacing={2} direction="row" sx={{mt: '20px',}}>
        {/* <Button variant="contained" onClick={() => {setIsCustomColor(true)}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.lighter, '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none', }, boxShadow: 'none', fontWeight: '500', letterSpacing: '-0.55px', 
        mt: '20px', width: '85px', fontSize: '15.5px', p: '10px', borderRadius: '7px', paddingInline: '20px', color: 'black', 
        display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
          <Iconify icon="ph:drop-light" sx={{minHeight: '18.5px', minWidth: '18.5px', color: 'black', marginRight: '5px'}}/>
          Back
        </Button> */}

        <input type="color" defaultValue="#8B0000" onChange={(event) => setCustomColor(event.target.value)} style={{
          mt: '20px', width: '232.5px', height: '55px', fontSize: '15.5px', borderRadius: '2px', 
          color: 'darkred', border: 'none', display: 'flex', outline: 'none'
        }} value={customColor}/>

        </Stack>}


        </Card>
        <Button variant="contained" onClick={() => {handleTemplatesClose()}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.lighter, '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none', }, boxShadow: 'none', fontWeight: '800', letterSpacing: '-0.55px', 
      fontSize: '15.5px', p: '10px', borderRadius: '7px', paddingInline: '20px', color: 'black', bottom: '38.5px', right: '38.5px', width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', position: 'absolute', })}>
        <Iconify icon="mingcute:quill-pen-line" sx={{minHeight: '18.5px', minWidth: '18.5px', color: 'black', marginRight: '5px'}}/>
        Make Posts
      </Button> 
      </Dialog>
      
      <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '650px', minWidth: '1000px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '500px', height: '650px', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Branded Images Formatted By Us</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '35px',
        letterSpacing: '-0.35px',  fontWeight: 500, fontSize: '24.75px'}}> 
        💬&nbsp;&nbsp;&nbsp;Powered by AI <br /> 
        🕒&nbsp;&nbsp;&nbsp;Consistent Images <br /> 
        💡&nbsp;&nbsp;&nbsp;Trained on your blogs <br /> 
        📧&nbsp;&nbsp;&nbsp;Social-media ready <br /> 
        ⚡&nbsp;&nbsp;&nbsp;Lightning quick responses <br /> 
        🛠️&nbsp;&nbsp;&nbsp;Custom-made for your firm <br />
        </Typography>
      <Button variant="contained" onClick={() => {window.open('https://tally.so/r/3jydPx', '_blank')}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="ic:baseline-business" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Coming Very Soon!
      </Button>
        </Card>
        <Card sx={(theme) => ({ width: '525px', height: '650px', backgroundColor: theme.palette.primary.navBg, 
        borderRadius: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          <img src="https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-04-27%20at%203.28.50%E2%80%AFAM.png?alt=media&token=3e419fa6-c956-44a6-b7ed-b0fb9b16a0c1" 
          style={{height: '600px', width: '415px', borderRadius: '4px'}} alt=""/>
        </Card>
      </Dialog>

      <Dialog open={isDialogOpen2} onClose={handleClose2} 
      PaperProps={{ style: { minHeight: '220px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px', pb: '35px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.05px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Coming Soon</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '35px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        This feature is in the works and will <br /> 
        be out in the next couple weeks! <br /> 
        </Typography>
        </Card>
      </Dialog>
    </Container>

    
  );
}
