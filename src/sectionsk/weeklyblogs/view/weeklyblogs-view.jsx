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
import { useNavigate } from 'react-router-dom'; 

import Iconify from 'src/components/iconify';
import PostCard from '../weeklyblogs-card';

const isImagesOn = true;
const modelKeys = {
1: 'claude-3-haiku-20240307',
2: 'claude-3-sonnet-20240229',
3: 'claude-3-sonnet-20240229'} 
// 3: 'claude-3-opus-20240229'} 

// ----------------------------------------------------------------------

export default function BlogView() {

  const navigate = useNavigate();
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

  const [internalLinks, setInternalLinks] = useState("{NOT APPLICABLE}");
  const [contactUsLink, setContactUsLink] = useState("{NOT APPLICABLE}");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState([]);
  const [timeToUpdate, setTimeToUpdate] = useState("");
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [isFeedbackMode, setIsFeedbackMode] = useState(false);

  const [selectedModel, setSelectedModel] = useState(1);
  const [weeklyBlogs, setWeeklyBlogs] = useState([]);
  const [bigBlogString, setBigBlogString] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);
  const [sources, setSources] = useState([]);

  // PAGE LOAD FUNCTIONS

  const writeWeeklyBlogs = useCallback(async () => {
    
    
    let tempPosts = []; const numberOfBlogs = 6; 
    let isError = false; let firmNameInt; let firmDescriptionInt; let internalLinksInt; let contactUsLinkInt; let smallBlogInt; let blogTitlesInt; 
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    if (userDoc.exists()) {const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM)); 
    if (firmDoc.exists()) {firmNameInt = firmDoc.data().FIRM_INFO.NAME; firmDescriptionInt = firmDoc.data().FIRM_INFO.DESCRIPTION; 
      const linksArray = firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => blog.LINK); 
      const blogTitlesArray = firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => blog.TITLE); blogTitlesInt = blogTitlesArray.join(", ");
      internalLinksInt = JSON.stringify(firmDoc.data().BLOG_DATA.BIG_BLOG.map(blog => ({title: blog.TITLE, link: blog.LINK}))); 
      contactUsLinkInt = firmDoc.data().FIRM_INFO.CONTACT_US; console.log('contact us link: ', contactUsLinkInt); console.log('internal links: ', internalLinksInt); 
      const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG; const smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
      smallBlogInt = smallBlogArray.map(index => `[${bigBlog[index]?.TITLE || ''}]: ${bigBlog[index]?.CONTENT || ''}`).join('\n'); 
    }}
    
    
    const response0 = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST',headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ model: modelKeys[selectedModel], 
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
        body: JSON.stringify({ model: modelKeys[1], 
        messages: [
          { role: "user", content: `
          
          <role>You are Pentra AI, an approachable, witty attorney at ${firmNameInt}. ${firmDescriptionInt}.
          DONT MENTION YOURSELF OR THE FIRM (except at the very end) </role> 
  
          <instruction>
  
          IMPORTANT INSTRUCTIONS:
          - TOPIC: This post is on ${titleArray[i]}. Use exactly this title.
          - FORMATTING: Wrap titles in <h1> and <h2> tags. Wrap ALL individual paragraphs and points in <p> tags. Wrap parts to be BOLDED in <b> tags. 
          - WORD RANGE: this post should be 1000 - 1200 WORDS LONG.
          - PERSPECTIVE: DONT EVER REFER TO YOURSELF IN THE POST. ONLY MENTION ${firmNameInt} at the VERY END, when explaining how it can help.
          - IMAGES: blog post should contain 2-3 images. Please add representations of them in this format: //Image: {Image Description}//. 
          Consider putting them right after h2 titles. Make sure these are evenly spaced out in the post and with specific descriptions.
          - CASE LAW: Reference common / case law in the blog post if & when necessary. Dont make things up.
          - CONTACT US LINK AT END: Use this contact us link with <a> tags toward the end if applicable: ${contactUsLinkInt}
          - LINK TO RELEVANT POSTS: Use <a> tags to add link(s) to relevant blog posts from the firm wherever applicable: ${internalLinksInt}.
          - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. 

          </instruction>

          ${browseTextResponse !== "" && 
          `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}:
          <web-information> ${browseTextResponse} </web-information>`}

          COPY THE WRITING STYLE & TONE PERFECTLY FROM ${firmNameInt}'s PREVIOUS BLOGS:

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
      gptResponse = gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/(<image[^>]*>|\/\/Image:.*?\/\/)/gi, '$&<br>');
      const postTitle = gptResponse.match(/<h1>(.*?)<\/h1>/i)[1]; 
      // eslint-disable-next-line no-control-regex
      const sanitizedResponse = gptResponse.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); let textWithoutImages;
      try { textWithoutImages = [{content: sanitizedResponse}] } catch (err) {isError = true; console.log(err)};
      console.log(textWithoutImages); let textWithImages = textWithoutImages;
      // eslint-disable-next-line no-await-in-loop
      if (isImagesOn) {textWithImages = await addImages(textWithoutImages);}
      // eslint-disable-next-line no-await-in-loop
      tempPosts = tempPosts.concat(textWithImages); console.log(`TEMP BLOGS ${i} DONE): `, tempPosts); 
    };

    try {
      if (userDoc.exists()) { const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
        if (firmDoc.exists()) {
          const currentDate = new Date();
          const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
          await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_BLOGS.BLOGS': tempPosts, 'WEEKLY_BLOGS.LAST_DATE': isError ? "3/3/3" : formattedDate });
        }
      }} catch (err) {console.log(err)};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contactUsLink, internalLinks, bigBlogString, firmName, selectedModel]);

  
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
    .then(data => {console.log(data); setSources(data.hits); return data;})
    .catch(err => {console.error(err); return err;});
  }


  useEffect(() => {

    if (isUpdateTime) {setWeeklyBlogs([]); return;}; 
    
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) { 
            const lastDateParts = firmDoc.data().WEEKLY_BLOGS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = 7 - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            await setContactUsLink(firmDoc.data().FIRM_INFO.MODEL);
            await setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US);
            await setWeeklyBlogs(firmDoc.data().WEEKLY_BLOGS.BLOGS || []);

            if (firmDoc.data().WEEKLY_BLOGS.LAST_DATE === "") {setIsUpdateTime(true); return;}
            if (diffDays >= 1) { await setTimeToUpdate(diffDays); } else { setIsUpdateTime(true); writeWeeklyBlogs(); console.log('WRITING BLOGS'); setWeeklyBlogs([]); 
              await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_BLOGS.LAST_DATE': "" }); }
            
            // GET BIG BLOG DATA

            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG;
            const selectedBlogs = [];
            const numBlogsToSelect = Math.min(3, bigBlog.length);
            for (let i = 0; i < numBlogsToSelect; i += 1) {
              const randomIndex = Math.floor(Math.random() * bigBlog.length);
              selectedBlogs.push(bigBlog[randomIndex]);
              bigBlog.splice(randomIndex, 1);
            }
            const bigBlogData = selectedBlogs.map(blog => `${blog.TITLE}: ${blog.CONTENT}`).join('\n\n');
            setBigBlogString(bigBlogData);
            // console.log(bigBlogData);

            console.log(firmDoc.data().WEEKLY_BLOGS.BLOGS);
          }}
      } catch (err) {
        console.log(err);
      }
    };

    if (!genPostPlatform) {getFirmData()};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    

  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    if (genPostPlatform) {setGenPostPlatform(null)} 
    else {setGenPostPlatform("LinkedIn")};
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


  return (
    <Container>

      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      {isUpdateTime && <>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '325px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '1.05px',  
      fontWeight: 800, fontSize: '60.75px'}}> 
        🖋️ Writing Blogs...
      </Typography>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '407.5px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '-0.05px',  fontWeight: 500, fontSize: '25.75px'}}> 
        {`Return in ~5 minutes and they'll be ready!`}
      </Typography> </>}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>         
        {isNewPost ? 'Create New Posts' : 'Weekly Blog Idea Drafts'}
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
        
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="streamline:artificial-intelligence-spark-solid" sx={{height: '16px', width: '16px'}}/>}
         onClick={() => setIsFeedbackMode(true)} sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          Give Pentra AI Feedback
        </Button>
      </Stack></Stack>


      <Grid container spacing={3} sx={{width: '100%'}}>
        {weeklyBlogs.map(({ platform, content }, index) => (
          <PostCard key={index} platform={platform} content={content} index={index} isGen={isGenerating} />
        ))}
      </Grid>

    </Container>
  );
}
