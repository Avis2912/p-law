import React, { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
import { useNavigate, useParams } from 'react-router-dom';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import Anthropic from '@anthropic-ai/sdk';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { getDocs, getDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import Iconify from 'src/components/iconify';
import { db, auth } from 'src/firebase-config/firebase';
import Button from '@mui/material/Button';
import { Card, TextField, Dialog } from '@mui/material';
import { css, keyframes } from '@emotion/react';

import PageTitle from 'src/components/PageTitle';
import BlogEditor from 'src/components/Editor';
import WpDialog from 'src/components/WpDialog';
import ComingSoon from 'src/components/ComingSoon';
import CategoryDialog from 'src/components/CategoryDialog';

// eslint-disable-next-line import/no-relative-packages
import publishBlog from '../../../../functions/src/WpFunctions/publishBlog';
// eslint-disable-next-line import/no-relative-packages
import saveToQueue from '../../../../functions/src/General/saveToQueue';

import { ScheduleDialog } from '../../seo/view/schedule-dialog';

const isImagesOn = true;
const modelKeys = {
1: 'claude-3-haiku-20240307',
2: 'claude-3-sonnet-20240229',
3: 'claude-3-opus-20240229'} 


// ----------------------------------------------------------------------

export default function ProductsView() {

  const queryParams = new URLSearchParams(window.location.search);
  const blogId = queryParams.get('blogID');
  const queueTitle = queryParams.get('title');
  const queueList = queryParams.get('list');
  const queueTime = queryParams.get('time');
  const queueDate = queryParams.get('date');

  const [text, setText] = 
  useState(`<h1>Welcome Back!</h1> Let's draft a new legal blog post. <br>This is where your content shows up.`);
  // useState(`<h1>✨ Generating... </h1>`);
  const navigate = useNavigate();

  const [blogText, setBlogText] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogInstructions, setBlogInstructions] = useState(null);
  const [smallBlog, setSmallBlog] = useState(null); 
  const [internalLinks, setInternalLinks] = useState(null); 
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);

  const [isGenMode, setIsGenMode] = useState(false);
  const [isAlterMode, setIsAlterMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('Build Outline');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isElongating, setIsElongating] = useState(false);

  const [isBrowseWeb, setIsBrowseWeb] = useState(false);
  const [browseText, setBrowseText] = useState("");
  const [selectedModel, setSelectedModel] = useState(1);
  const [wordCount, setWordCount] = useState(0);
  const [contactUsLink, setContactUsLink] = useState(null);

  const [isMimicBlogStyle, setIsMimicBlogStyle] = useState(false);
  const [imageCount, setImageCount] = useState("2 Images");
  const [wordRange, setWordRange] = useState("600 - 800 Words");
  const [style, setStyle] = useState("Unstyled");
  const [isReferenceGiven, setIsReferenceGiven] = useState(false);
  const [referenceText, setReferenceText] = useState(null);
  const [isUseInternalLinks, setIsUseInternalLinks] = useState(false);
  const [isMentionCaseLaw, setIsMentionCaseLaw] = useState(false);

  const [isWpIntegrated, setIsWpIntegrated] = useState(false);
  const [isWpDropdownOpen, setIsWpDropdownOpen] = useState(false);
  const [isWpDialogOpen, setIsWpDialogOpen] = useState(false);
  const [isPostError, setIsPostError] = useState(false);

  const [wpUrl, setWpUrl] = React.useState(null);
  const [wpUsername, setWpUsername] = React.useState(null);
  const [wpPassword, setWpPassword] = React.useState(null);
  const [isComingSoon, setIsComingSoon] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const titleTag = 'h2';

  const boxHeight = 'calc(100% - 125px)'; 
  const boxWidth = 'calc(100%)';

  const [dots, setDots] = useState('');
  const [initialText, setInitialText] = useState('');
  const [isContentChanged, setIsContentChanged] = useState(false);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCategoryConfirmOpen, setIsCategoryConfirmOpen] = useState(false);

  useEffect(() => {
    const intervalId = isGenerating && setInterval(() => {
      setDots(prevDots => {
        const newDots = prevDots.length < 3 ? `${prevDots}.` : '';
        setText(`<h1>✨ Generating${newDots} </h1>`);
        return newDots;
      }); }, 350);
    return () => intervalId && clearInterval(intervalId);
  }, [isGenerating]);

  useEffect(() => {

    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            if (queueTitle) {
              const currentQueue = firmDoc.data().QUEUE;
              const listKey = queueList.toUpperCase(); console.log(listKey);
              const queueItem = currentQueue[listKey].find(item => item.title === queueTitle && item.time === queueTime);
              await setBlogText(queueItem.content);
            } else {
            await setBlogText(firmDoc.data().WEEKLY_BLOGS.BLOGS[blogId].content); 
            }
            await setFirmName(firmDoc.data().FIRM_INFO.NAME);
            await setFirmDescription(firmDoc.data().FIRM_INFO.DESCRIPTION);
            const smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
            const smallBlogString = smallBlogArray.map((item, index) => `{BLOG ${index + 1}}:\n\n${item}\n`).join('\n');
            await setSmallBlog(smallBlogString);  
            await setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US);         
            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG || [];
            const internalLinkData = bigBlog.map(blog => `${blog.TITLE}: ${blog.LINK}`).join('\n');
            await setInternalLinks(internalLinkData); 
          } else {
            console.log('Error: Firm document not found.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
    setText(blogText); 
    setWordCount(blogText.split(' ').length);

  }, [blogText, blogId, queueList, queueTitle, queueTime]);

  useEffect(() => {
    // Set initialText when blogText is loaded
    setInitialText(blogText);
    setText(blogText);
  }, [blogText]);

  useEffect(() => {
    // Detect content changes
    if (text !== initialText) {
      setIsContentChanged(true);
    } else {
      setIsContentChanged(false);
    }
  }, [text, initialText]);

  const saveBlog = async () => {
    setIsSaving(true);
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDoc.exists()) {
        const firmDocRef = doc(db, 'firms', userDoc.data().FIRM);
        const firmDoc = await getDoc(firmDocRef);
        
        if (firmDoc.exists()) {

          if (queueTitle) {
            const currentQueue = { ...firmDoc.data().QUEUE }; // Create a copy of the queue
            const listKey = queueList.toUpperCase();
            
            if (currentQueue[listKey]) {
              const updatedList = currentQueue[listKey].map(item => {
                if (item.title === queueTitle && 
                    item.time === queueTime) {
                  return { ...item, content: text };
                }
                return item;
              });
              
              // Update the specific list in the queue
              currentQueue[listKey] = updatedList;
              
              // Update the entire queue object
              await updateDoc(firmDocRef, {
                QUEUE: currentQueue
              });
            }
          } else {
            // Regular blog save
            const currentBlogs = firmDoc.data().WEEKLY_BLOGS.BLOGS;
            currentBlogs[blogId] = {
              ...currentBlogs[blogId],
              content: text,
            };
            await updateDoc(firmDocRef, {
              'WEEKLY_BLOGS.BLOGS': currentBlogs,
            });
          }
          setInitialText(text);
          setIsContentChanged(false);
        }
      }
    } catch (err) {
      console.error('Error saving:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // BLOG GENERATION

  const generateBlog = async () => {

      setText(`<h1>✨ Generating${dots} </h1>`);
      setIsGenerating(true);
      let messages = [];

      let browseTextResponse = "";

      if (currentMode === "Generate") {
        if (isBrowseWeb) {browseTextResponse = await browseWeb(browseText); console.log(browseTextResponse);};
        messages.push({
          "role": "user", 
          "content":  `

          <instruction>
          Write a blog post based on the following topic: ${blogDescription}. 
          ${blogKeywords && `Keywords: ${blogKeywords}`}. ${text !== "" && `Consider using the following outline: ${text}`}. 
          </instruction>

          `
        });
      }

      if (currentMode === "Build Outline") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          Write a detailed blog outline in rich text format using <b> tags and <br> tags (after every paragraph/line) based on the following topic: ${blogDescription}. ${blogKeywords && `Keywords: ${blogKeywords}`}.
          KEEP IN MIND: this is for a blog post ${wordRange} long.`
        });
      }

      if (currentMode === "Alter Draft") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          EDIT the blog post given below based on this prompt: ${blogDescription}. Don't deviate from the prompt and keep the blog post AS MUCH THE SAME as you can.
          BLOG POST: ${text}.
          
          IMPORTANT INSTRUCTIONS:
          - FORMATTING IN RICH TEXT: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs in <p> tags. Wrap parts to be bolded in <b> tags. 
          - WORD RANGE: this post should be ${wordRange} long.
          - PERSPECTIVE: Don't refer to yourself in the post, but feel free to explain how your firm  can help.
          - IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: Chapter 7 Bankruptcy Flowchart//. 
          Add two <br> tags after. Make sure these are evenly spaced out in the post and with specific and relevant descriptions.
          - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}
          - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
          - ${isUseInternalLinks && `INTERNAL LINKS: Add internal links to the blog post using <a> tags.`}
          - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
          - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
          `
        });
      }

    //   const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    //     method: 'POST',
    //     headers: {
    //     'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,  
    //     'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //     model: "gpt-3.5-turbo-0125",
    //     messages,
    //   }), });

      if (currentMode === "Build Outline") {setCurrentMode('Generate');};
      if (currentMode === "Generate") {setCurrentMode('Alter Draft');};


    const claudeResponse = await fetch('http://localhost:3050/claudeAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages, blogDescription, blogKeywords,
        model: modelKeys[selectedModel], system: 
        `
        ${currentMode === "Generate" ?
        `
        <role>You are Pentra AI, a friendly, witty legal & creative writing expert for ${firmName}. ${firmDescription}.
        Mention firm ONLY at the end. </role> 

        <instruction>

        ${isMimicBlogStyle && 
          `VERY VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT MUST BE FRIENDLY & APPROACHABLE.
         ${smallBlog}`} 

        IMPORTANT INSTRUCTIONS:
        - FORMATTING: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs in <p> tags. Wrap parts to be BOLDED in <b> tags. 
        - WORD RANGE: this post should be ${wordRange} long.
        - PERSPECTIVE: Don't refer to yourself in the post, but feel free to explain how your firm ${firmName} can help.
        ${imageCount !== "No Images" && `- IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: Chapter 7 Bankruptcy Flowchart//.
        Add two <br> tags after. Make sure these are evenly spaced out in the post and with specific and relevant descriptions.`}
        - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}
        - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
        - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
        - ${contactUsLink && `CONTACT US LINK AT END: Use this contact us link with <a> tags toward the end if applicable: ${contactUsLink}`}
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
        - ${isUseInternalLinks && `LINK TO RELEVANT POSTS: Use <a> tags to add link(s) to relevant blog posts from the firm wherever applicable: ${internalLinks}.`}
        - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. 
      
        </instruction>
        `
        : `<role>You are Pentra AI, a legal expert and an expert SEO blog writer for ${firmName}. ${firmDescription}.</role>` 
      }`
    }), });

    const elongationPrompt = `
    <instruction>
    - YOUR GOAL IS TO COPY THE USER-GIVEN DRAFT AND ELONGATE IT TO MAKE IT ${wordRange} LONG. 
    Right now it's falling a little short.
    - EXCEPTION: Just make sure the final how we can help / contact us paragraph remains at the end of your output.
    - COPY THE TEXT'S CURRENT FORMAT EXACTLY: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs in <p> tags. Wrap parts to be BOLDED in <b> tags.
    - STYLE & TONE: Keep the voice and tone of the text exactly the same when elongating it.
    - IMAGES: KEEP ALL IMAGES as they are. You're allowed to add one new one in your elongation in the same format.
    - OUTPUT: ONLY output for me the final article. Nothing else.
    </instruction>
    `

    let gptResponse = (await claudeResponse.text()).replace(/<br><br> /g, '<br><br>'); console.log(gptResponse);

    // const data = await gptResponse.json();
    // const gptText = data.choices[0].message.content.trim();
    // const textWithImages = await addImages(gptText);

    const lowerRange = wordRange === "Upto 200 Words" ? 0 : parseInt(wordRange.split('-')[0], 10); let counter = 0;
    while (lowerRange > gptResponse.split(' ').length && counter < 3) {

      messages = [{"role": "user", "content": gptResponse}]; console.log('RUNNING:', gptResponse.split(' ').length, ' < ', lowerRange, 'count: ', counter);
      // eslint-disable-next-line no-await-in-loop
      const claudeElongationResponse = await fetch('http://localhost:3050/claudeAPI', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages, model: modelKeys[selectedModel], system: elongationPrompt})});

      // eslint-disable-next-line no-await-in-loop
      gptResponse = await claudeElongationResponse.text();
      counter += 1; console.log('RAN: gptresponse', gptResponse, gptResponse.split(' ').length, lowerRange);
    }

    let textWithImages = gptResponse.trim();
    if (isImagesOn) {textWithImages = await addImages(gptResponse.trim());}
    const textWithBreaks = await textWithImages.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/(<image[^>]*>)/gi, '$&<br><br>');
    await setText(textWithBreaks); console.log(textWithBreaks);

    if (currentMode === "Generate") await setWordCount(textWithBreaks.split(' ').length);
    setIsGenerating(false);

    try {
      const firmDatabase = collection(db, 'firms');
      const data = await getDocs(firmDatabase);
      const userDoc = data.docs.find((docc) => docc.id === 'testlawyers');
      if (userDoc) {  
        const userDocRef = doc(db, 'firms', userDoc.id);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)} | ${currentDate.getHours() % 12 || 12}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const genPosts = userDoc.data().GEN_POSTS || [];
        const newPost = { [formattedDate]: textWithImages }; genPosts.unshift(newPost);
        await updateDoc(userDocRef, { GEN_POSTS: genPosts });
    }} catch (err) {console.log(err);}


  };

  const addImages = async (imagelessText) => {
    const regex = /\/\/Image: (.*?)\/\//g;
    const matches = [...imagelessText.matchAll(regex)];
    const descriptions = matches.map(match => match[1]);

    const subscriptionKey = `${import.meta.env.VITE_BING_API_KEY}`;
    const host = 'api.bing.microsoft.com';
    const path = '/v7.0/images/search';

    let imagefullText = imagelessText;

    const fetchImage = async (description) => {
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

    const imageTags = [];

    for (let i = 0; i < descriptions.length; i += 3) {
      const batch = descriptions.slice(i, i + 3);
      // eslint-disable-next-line no-await-in-loop
      const batchImageTags = await Promise.all(batch.map(fetchImage));
      imageTags.push(...batchImageTags);

      if (i + 3 < descriptions.length) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    matches.forEach((match, index) => {
      if (imageTags[index]) {
        imagefullText = imagefullText.replace(match[0], imageTags[index]);
      }
    });

    return imagefullText;
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

  // const loading = keyframes`
  //   0% {
  //     background-position: -200% 0;
  //   }
  //   100% {
  //     background-position: 200% 0;
  //   }
  // `;

  // const loadingAnimation = {
  //   animation: '1.5s ease-in-out infinite',
  //   animationName: `${loading}`,
  //   background: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)',
  //   backgroundSize: '200% 100%',
  // };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`https://${wpUrl.replace('https://', '').replace('http://', '')}/wp-json/wp/v2/categories`, {
        headers: {
          'Authorization': `Basic ${btoa(`${wpUsername}:${wpPassword}`)}`,
        }
      });
      const categories = await response.json();
      setAvailableCategories(categories);
      setSelectedCategories([categories[0]?.id]); // Select first category by default
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      <script src="http://localhost:30015/embed.min.js" defer />
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <PageTitle title="Edit Blog Post" />


      <Stack direction="row" spacing={2} >

      {/* <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (wordRange) {
          case "Upto 200 Words": setWordRange("200 - 400 Words"); break;
          case "200 - 400 Words": setWordRange("400 - 600 Words"); break;
          case "400 - 600 Words": setWordRange("600 - 800 Words"); break;
          case "600 - 800 Words": setWordRange("800 - 1000 Words"); break;
          case "800 - 1000 Words": setWordRange("1000 - 1200 Words"); break;
          case "1000 - 1200 Words": setWordRange("1200 - 1400 Words"); break;
          case "1200 - 1400 Words": setWordRange("1400 - 1600 Words"); break;
          case "1400 - 1600 Words": setWordRange("Upto 200 Words"); break;
          default: setWordRange("600 - 800 Words");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green,
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>
      {wordRange} </Button>

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (imageCount) {
          case "2 Images": setImageCount("3 Images"); break;
          case "3 Images": setImageCount("4 Images"); break;
          case "4 Images": setImageCount("5 Images"); break;
          case "5 Images": setImageCount("No Images"); break;
          case "No Images": setImageCount("1 Image"); break;
          case "1 Image": setImageCount("2 Images"); break;
          default: setImageCount("2 Images");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green,
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>
      {imageCount} </Button>

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (style) {
          case "Unstyled": setStyle("How-To Guide"); break;
          case "How-To Guide": setStyle("Narrative"); break;
          case "Narrative": setStyle("Opinion"); break;
          case "Opinion": setStyle("Case Study"); break;
          case "Case Study": setStyle("Comparision"); break;
          case "Comparision": setStyle("Case Law Breakdown"); break;
          case "Case Law Breakdown": setStyle("Unstyled"); break;
          default: setStyle("Unstyled");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green,
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>        
      {style} </Button>

        {currentMode === "Alter Draft" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
        sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', },}}
        onClick={() => {setCurrentMode("Build Outline"); setText('');}}>
        Create New Draft </Button>}

        {currentMode === "Build Outline" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, },})}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        Skip Outline </Button>} */}


      {isWpDropdownOpen && <Button variant="contained" startIcon={<Iconify icon="teenyicons:text-document-solid" sx={{height: '13.25px'}}/>} 
        onClick={async () => {
          await saveToQueue('DRAFTS', text);
          setText('');  setIsWpDropdownOpen(false);
          setBlogTitle(''); setBlogInstructions('');
        }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.black,
      '&:hover': { backgroundColor: theme.palette.primary.black, }, })}>        
      Save Draft </Button>}

      {isWpDropdownOpen && <Button variant="contained" startIcon={<Iconify icon="mdi:clock" sx={{height: '16.25px'}}/>} 
      onClick={() => setIsScheduleDialogOpen(true)}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.black,
      '&:hover': { backgroundColor: theme.palette.primary.black, }, })}>        
      Schedule </Button>}

      {isComingSoon && <ComingSoon isDialogOpen2={isComingSoon} handleClose2={() => {setIsComingSoon(false)}} />}

      {isWpDropdownOpen && <Button 
        variant="contained" 
        startIcon={<Iconify icon="cib:telegram-plane" sx={{height: '15.75px'}}/>} 
        onClick={() => setIsCategoryConfirmOpen(true)}
        sx={(theme) => ({ 
          backgroundColor: theme.palette.primary.black,
          '&:hover': { backgroundColor: theme.palette.primary.black, }, 
        })}
      >        
        Publish Now 
      </Button>}

      {text !== '' && <Button variant="contained" startIcon={<Iconify icon="dashicons:wordpress" sx={{height: '15.25px'}}/>} 
      onClick={() => {if (isWpIntegrated) {setIsWpDropdownOpen(!isWpDropdownOpen);} else {setIsWpDialogOpen(true);}}}
    sx={(theme) => ({ backgroundColor: theme.palette.primary.navBg,
      '&:hover': { backgroundColor: theme.palette.primary.navBg, }, })}>        
      {(isWpDropdownOpen ? `Close` : `Publish`)} </Button>}

        <Button variant="contained" startIcon={<Iconify icon="icon-park-solid:left-c" />} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.black, },})}
        onClick={() => {
          // If it's a queue post, return to queue, otherwise to weekly blogs
          navigate(queueTitle ? '/queue' : '/weeklyblogs');
        }}>
        {queueTitle ? 'Return To Queue' : 'Return To Weekly Posts'} </Button>

        {isContentChanged && (
        <Button
          variant="contained"
          startIcon={<Iconify icon={isSaving ? "line-md:loading-loop" : "eva:save-fill"} />}
          onClick={saveBlog}
          disabled={isSaving}
          sx={(theme) => ({
            backgroundColor: theme.palette.primary.black,
            '&:hover': { backgroundColor: theme.palette.primary.black },
            // opacity: isSaving ? 0.85 : 1,
          })}
        >
          {isSaving ? 'Saving' : 'Save'}
        </Button>
      )}

        </Stack></Stack>

        <WpDialog isDialogOpen={isWpDialogOpen} handleClose={() => {setIsWpDialogOpen(false)}} 
        isWpIntegrated={isWpIntegrated} setIsWpIntegrated={setIsWpIntegrated} firmName={firmName}
        wpUrl={wpUrl} setWpUrl={setWpUrl} wpUsername={wpUsername} setWpUsername={setWpUsername}
        wpPassword={wpPassword} setWpPassword={setWpPassword} />

      {/* <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
    
      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      <TextField
       value={blogDescription}
       onChange={(e) => setBlogDescription(e.target.value)}
       placeholder={currentMode === "Alter Draft" ? 'Make the first two sections shorter & replace mentions of TX with Dallas' : 'Blog Description'}
       sx={{width: currentMode === "Alter Draft" ? '100%' : '70%', transition: 'ease 0.3s'}} />

      {currentMode !== "Alter Draft" && <TextField
       value={blogKeywords}
       onChange={(e) => setBlogKeywords(e.target.value)}
       placeholder='Blog Keywords'
       sx={{width: '30%', transition: 'ease 0.3s'}} />}
       </Stack>
       
        <Button onClick={() => generateBlog()}
        variant="contained" color="inherit" 
        sx={(theme) => ({height: '54px', width: '150px', backgroundColor: currentMode === "Generate" ? theme.palette.primary.navBg : theme.palette.primary.black})}>
          {currentMode} ✨
        </Button> */}

        <BlogEditor text={text} setText={setText} isGenerating={isGenerating}
        boxHeight={boxHeight} boxWidth={boxWidth} wordCount={wordCount}/>


{/*       
        <Stack direction="row" spacing={2} >

        <Button variant="contained" sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, }, cursor: 'default'})}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>
                  
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsBrowseWeb(!isBrowseWeb); setIsReferenceGiven(false);}}
        sx={(theme) => ({backgroundColor: isBrowseWeb ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Browse Web </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMentionCaseLaw(!isMentionCaseLaw)}}
        sx={(theme) => ({backgroundColor: isMentionCaseLaw ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mention Case Law </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMimicBlogStyle(!isMimicBlogStyle)}}
        sx={(theme) => ({backgroundColor: isMimicBlogStyle ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mimic Our Blogs </Button>


          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsReferenceGiven(!isReferenceGiven); setIsBrowseWeb(false);}}
        sx={(theme) => ({backgroundColor: isReferenceGiven ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Use New Data </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsUseInternalLinks(!isUseInternalLinks)}}
        sx={(theme) => ({backgroundColor: isUseInternalLinks ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Internal Links </Button>

        </Stack>  */}

        {isReferenceGiven && (
        <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)} 
        style={{width: '100%', height: '225px', marginTop: '18px', border: '0.1px solid',
        borderRadius: '0px', padding: '15px', fontSize: '15px', fontFamily: 'Arial',}} 
        placeholder='Feed any text here you would like the AI model to use. It helps to explain how youd like it to use it in the blog description.'/>
        )}


        {isBrowseWeb && (<>
        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        
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

       <ScheduleDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        onSchedule={async (date, time) => {
          const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag, `${date}T${time}:00`);
          if (response && (response.status === 200 || response.status === 201)) {
            await saveToQueue('SCHEDULED', text);
            setText('');
            setIsWpDropdownOpen(false);
            setCurrentMode('Generate');
            setIsPostError(false);
            setBlogTitle('');
            setBlogInstructions('');
          } else {
            setIsPostError(true);
          }
        }}
      />

      <CategoryDialog 
        open={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        categories={availableCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        onPublish={async () => {
          const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag, null, selectedCategories);
          if (response && (response.status === 200 || response.status === 201)) {
            await saveToQueue('PUBLISHED', text);
            setText(''); setIsWpDropdownOpen(false);
            setCurrentMode('Generate'); setIsPostError(false);
            setBlogTitle(''); setBlogInstructions('');
            setIsCategoryDialogOpen(false);
          } else {
            setIsPostError(true);
          }
        }}
      />

      <Dialog
        open={isCategoryConfirmOpen}
        onClose={() => setIsCategoryConfirmOpen(false)}
        PaperProps={{ style: { borderRadius: '6px' } }}
      >
        <Card sx={{ p: 3, width: '400px' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Would you like to add categories to this post?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={async () => {
                setIsCategoryConfirmOpen(false);
                const response = await publishBlog(wpUsername, wpPassword, wpUrl, text, titleTag);
                if (response?.status === 200 || response?.status === 201) {
                  await saveToQueue('PUBLISHED', text);
                  setText(''); setIsWpDropdownOpen(false);
                  setCurrentMode('Generate'); setIsPostError(false);
                  setBlogTitle(''); setBlogInstructions('');
                } else {
                  setIsPostError(true);
                }
              }}
            >
              Skip Categories
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                setIsCategoryConfirmOpen(false);
                fetchCategories();
                setIsCategoryDialogOpen(true);
              }}
              sx={(theme) => ({ 
                minHeight: 38,
                bgcolor: theme.palette.primary.navBg,
                '&:hover': { bgcolor: theme.palette.primary.navBg }
              })}
            >
              Add Categories
            </Button>
          </Stack>
        </Card>
      </Dialog>
    
    </Container>
  );
}
