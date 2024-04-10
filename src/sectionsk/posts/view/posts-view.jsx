import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import Iconify from 'src/components/iconify';
import PostCard from '../post-card';

const isImagesOn = true;
const modelKeys = {
1: 'claude-3-haiku-20240307',
2: 'claude-3-sonnet-20240229',
3: 'claude-3-opus-20240229'} 

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [timeToUpdate, setTimeToUpdate] = useState("");
  const [isUpdateTime, setIsUpdateTime] = useState(false);

  const [selectedModel, setSelectedModel] = useState(1);
  const [weeklyPosts, setWeeklyPosts] = useState([]);
  const [bigBlogString, setBigBlogString] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);

  // PAGE LOAD FUNCTIONS

  const writeWeeklyPosts = useCallback(async () => {
    
    let tempPosts = []; const platforms = ["LinkedIn", "Facebook", "Instagram"]; 
    let isError = false; let firmNameInt; let firmDescriptionInt;
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    if (userDoc.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; }};
    
    for (let i = 0; i < 3; i += 1) {
      const tempPlatform = platforms[i];

      // eslint-disable-next-line no-await-in-loop
      const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: modelKeys[selectedModel], 
        messages: [
          { role: "user", content: `<role> You are Pentra AI, an attorney at ${firmNameInt}.
          ${firmName} Description: ${firmDescriptionInt}. </role> 
          
          <instruction>
          YOUR GOAL: Write 3 FULL EDUCATIONAL ${tempPlatform} posts from the perspective of ${firmName}. Don't be generic and corporate but be approachable and genuinely informative. Don't be lazy.
          
          IMPORTANT INSTRUCTIONS:
          - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps, 
          EXAMPLE OUTPUT: "[{"platform": "${tempPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}]". 
          ONLY OUTPUT THE ARRAY. NOTHING ELSE.
          - Wrap titles in <h2> tags. Wrap EVERY paragraph in <p> tags.
          - Be truly informative about a relevant legal topic, use points if necessary, and mention the firm at the end if relevant. Add just a few hashtags at the end.
          - PARAGRAPH COUNT: these posts should be informative 5-6 paragraphs long for LinkedIn, 4-5 for Facebook, and just 1 for Instagram.
          - IMAGES: post should contain 1 image, placed after the h2 post title. Please add it in this format: //Image: {short image description}//.
          - Array should be in proper format: [{}, {}, {}]. </instruction>

          Pull from in the following blog posts only if useful information is contained:

          ${bigBlogString}
          ` }
        ] })
      });

      // eslint-disable-next-line no-await-in-loop
      let gptResponse = (await response.text()); console.log(gptResponse);
      // eslint-disable-next-line no-await-in-loop
      gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');
      // eslint-disable-next-line no-control-regex
      const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); let textWithoutImages;
      try { textWithoutImages = JSON.parse(sanitizedResponse) } catch (err) {isError = true; console.log(err)};
      console.log(textWithoutImages); let textWithImages = textWithoutImages;
      // eslint-disable-next-line no-await-in-loop
      if (isImagesOn) {textWithImages = await addImages(textWithoutImages);}
      // eslint-disable-next-line no-await-in-loop
      tempPosts = tempPosts.concat(textWithImages); console.log(`TEMP POSTS (${tempPlatform} DONE): `, tempPosts);
    };

    try {
      if (userDoc.exists()) { const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
        if (firmDoc.exists()) {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
          await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_POSTS.POSTS': tempPosts, 'WEEKLY_POSTS.LAST_DATE': isError ? "3/3/3" : formattedDate });
        }
      }} catch (err) {console.log(err)};
  }, [bigBlogString, firmName, genPostPlatform, selectedModel]);



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
            const lastDateParts = firmDoc.data().WEEKLY_POSTS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = 7 - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            if (firmDoc.data().WEEKLY_POSTS.LAST_DATE === "") {setIsUpdateTime(true); return;}
            await setWeeklyPosts(firmDoc.data().WEEKLY_POSTS.POSTS || []);
            if (diffDays >= 1) { await setTimeToUpdate(diffDays); } else { setIsUpdateTime(true); writeWeeklyPosts(); console.log('WRITING POSTS'); setWeeklyPosts([]); 
              await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_POSTS.LAST_DATE': "" }); }
            
            // GET BIG BLOG DATA

            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG;
            const selectedBlogs = [];
            const numBlogsToSelect = Math.min(5, bigBlog.length);
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
  }, [isNewPost]);
    
  
  
  
  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    if (genPostPlatform) {setGenPostPlatform(null)} 
    else {setGenPostPlatform("LinkedIn")};
  }

  const generatePosts = async () => {
    setIsGenerating(true);
      const messages = [];

      let firmNameInt; let firmDescriptionInt;
      const userDocInt = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDocInt.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDocInt.data().FIRM));
      if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; }};

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
        - Wrap titles in <h2> tags. Dont use ANY new lines but add one <br> tags after EVERY paragraph and h1/h2 tag.
        - PARAGRAPH COUNT: these posts should be ${wordRange} paragraphs long. 
        - IMAGES: post should contain 1 image, placed after the h2 post title. Please add it in this format: //Image: Idaho Courthouse// OR //Image: Chapter 7 Bankruptcy Flowchart//.
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
        - ${postKeywords !== "" && `KEYWORDS: Use the following keywords in your posts: ${postKeywords}.`}
        - ${style !== "Unstyled" && `STYLE: This post should SPECIFICALLY be written in the ${style} style.`}
        - DONT ADD ANY SPACE BETWEEN THE JSON AND ARRAY BRACKETS. It should be proper [{}, {}, {}].
        </instruction>

        - ${isUseBlog && `BLOGS: Use the following blogs from the firm to source content from: ${bigBlogString}.`}

        `
      });
      
    const response = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ messages, blogDescription: postDescription, blogKeywords: postKeywords,
      model: modelKeys[selectedModel] })
    });

    const gptResponse = (await response.text()); console.log(gptResponse);

    const textWithoutImages = JSON.parse(gptResponse.trim().replace(/^```|```$/g, '').replace(/json/g, '')); console.log(textWithoutImages);
    let textWithImages = textWithoutImages;
    if (isImagesOn) {textWithImages = await addImages(textWithoutImages);}
    await setGeneratedPosts(textWithImages);
    await setWeeklyPosts(textWithImages);   
    console.log(weeklyPosts);
    setIsGenerating(false);

    try {
      const userDoc = await getDoc(doc(db, 'firms', 'testlawyers'));
      if (userDoc.exists()) {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate()} ${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()} | ${(currentDate.getHours() % 12 || 12).toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const genPosts = userDoc.data().GEN_POSTS || [];
        const newPost = { [formattedDate]: textWithImages }; 
        genPosts.unshift(newPost);
        await updateDoc(doc(db, 'firms', userDoc.id), { GEN_POSTS: genPosts });
      }
    } catch (err) {
      console.log(err);
    }
    
  }

  const addImages = async (posts) => {
    const regex = /\/\/Image: (.*?)\/\//g;

    const fetchImage = async (description) => {
      const subscriptionKey = `${import.meta.env.VITE_BING_API_KEY}`;
      const host = 'api.bing.microsoft.com';
      const path = '/v7.0/images/search';
      const url = `https://${host}${path}?q=${encodeURIComponent(description)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      });

      const data = await response.json();

      if (data.value && data.value.length > 0) {
        const firstImageResult = data.value[0];
        return `<image src="${firstImageResult.thumbnailUrl}" alt="${description}" />`;
      }
      return null;
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
        model: 'sonar-medium-online',
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>         
        {isNewPost ? 'Create New Posts' : 'Weekly Social Media Posts'}
        </Typography>
        
        <Stack direction="row" spacing={2}>
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
      {wordRange} Paragraphs </Button>

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
        </>)}

       {!isNewPost && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600'})}>
          {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Update In Progress'}
        </Button>
        </>)}
        
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleClickRoute()}
        sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isNewPost ? 'Close Creator' : 'Create New Post'}
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
        <Stack direction="row" spacing={2} alignItems="center" mt={0} mb={2}>
        
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
          Use {imageSettings} Images
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
    </Container>
  );
}
