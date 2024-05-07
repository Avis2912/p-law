import { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
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
import { Card, TextField, ListItem, ListItemText } from '@mui/material';
import { css, keyframes } from '@emotion/react';

const isImagesOn = true;
const modelKeys = {
1: 'claude-3-haiku-20240307',
2: 'claude-3-sonnet-20240229',
3: 'claude-3-opus-20240229'} 


// ----------------------------------------------------------------------

export default function ProductsView() {

  const [text, setText] = useState(``);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogInstructions, setBlogInstructions] = useState(null);
  const [smallBlog, setSmallBlog] = useState(null); 
  const [internalLinks, setInternalLinks] = useState(null); 
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);

  const [isGenMode, setIsGenMode] = useState(false);
  const [isAlterMode, setIsAlterMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('Generate');
  const [isGenerating, setIsGenerating] = useState(true);
  const [isElongating, setIsElongating] = useState(false);
  const [loadIndicator, setLoadIndicator] = useState(['Welcome Back!', -185]);

  const [isBrowseWeb, setIsBrowseWeb] = useState(true);
  const [isAdvancedBrowseWeb, setIsAdvancedBrowseWeb] = useState(true);
  const [browseText, setBrowseText] = useState("");
  const [selectedModel, setSelectedModel] = useState(2);
  const [wordCount, setWordCount] = useState(0);
  const [contactUsLink, setContactUsLink] = useState(null);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  const [isMimicBlogStyle, setIsMimicBlogStyle] = useState(false);
  const [imageCount, setImageCount] = useState("2 Images");
  const [wordRange, setWordRange] = useState("600 - 800 Words");
  const [style, setStyle] = useState("Unstyled");
  const [isReferenceGiven, setIsReferenceGiven] = useState(false);
  const [referenceText, setReferenceText] = useState(null);
  const [isUseInternalLinks, setIsUseInternalLinks] = useState(false);
  const [isMentionCaseLaw, setIsMentionCaseLaw] = useState(false);
  const [imagesSettings, setImagesSettings] = useState("All");

  const [expandedSource, setExpandedSource] = useState(null);
  const [doneSourcing, setDoneSourcing] = useState(true);
  const [sources, setSources] = useState([]);

  let boxHeight;
  if (isReferenceGiven) { boxHeight = 'calc(80% - 200px)';} 
  // else if (isBrowseWeb) { boxHeight = 'calc(80% - 125px)';} 
  else { boxHeight = 'calc(80% - 55px)'; }
  const boxWidth = 'calc(100%)';

  const [dots, setDots] = useState('');
  useEffect(() => {
    // const intervalId = isGenerating && setInterval(() => {
    //   setDots(prevDots => {
    //     const newDots = prevDots.length < 3 ? `${prevDots}.` : '';
    if (isGenerating) {setText(``)};
    //     return newDots;
    //   }); }, 350);
    // return () => intervalId && clearInterval(intervalId);
  }, [isGenerating]);

  useEffect(() => {

    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setFirmName(firmDoc.data().FIRM_INFO.NAME);
            await setFirmDescription(firmDoc.data().FIRM_INFO.DESCRIPTION);
            await setSelectedModel(firmDoc.data().SETTINGS.MODEL);
            await setImagesSettings(firmDoc.data().SETTINGS.IMAGES);
            const bigBlog = firmDoc.data().BLOG_DATA.BIG_BLOG || [];
            const smallBlogArray = firmDoc.data().BLOG_DATA.SMALL_BLOG || [];
            const smallBlogString = smallBlogArray.map(index => `[${bigBlog[index]?.TITLE || ''}]: ${bigBlog[index]?.CONTENT || ''}`).join('\n'); 
            await setSmallBlog(smallBlogString); 
            await setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US);         
            const internalLinkData = bigBlog.map(blog => `${blog.TITLE}: ${blog.LINK}`).join('\n');
            await setInternalLinks(internalLinkData); 
            if (smallBlogString) {console.log('smallBlogString: ', true) } else {console.log('smallBlogString: ', false);}
          } else {
            console.log('Error: Firm document not found.');
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  
  }, []);

  // BLOG GENERATION

  const generateBlog = async () => {

      // setText(`<h1>✨ Generating${dots} </h1>`);
      setIsGenerating(true); setBrowseText(blogTitle);
      if (isBrowseWeb) {setDoneSourcing(false)};
      let messages = [];

      let browseTextResponse = "";

      if (currentMode === "Generate") {
        if (isBrowseWeb || isAdvancedBrowseWeb) {
          setLoadIndicator(['Browsing The Web', 30]);
          if (isAdvancedBrowseWeb) {browseTextResponse = await browseWeb(browseText); console.log('BROWSE RESPONSE:', browseTextResponse);}
          else {browseTextResponse = JSON.stringify((await browseWeb(browseText)).hits.map(({snippet, title, link}) => ({title, snippet, link})))};
        };
          messages.push({
          "role": "user", 
          "content":  `
          <instruction>
          Write an accurate, specific, ${wordRange} legal blog post based on the following title: ${blogTitle}. 
          ${blogInstructions && `IMPORTANT INSTRUCTIONS (THIS TRUMPS EVERYTHING): ${blogInstructions}`}. 
          ${text !== "" && `Consider using the following outline: ${text}`}. 
          Please don't start by saying anything else. Output ONLY the blog post.
          </instruction>
          `
        });
      }

      if (currentMode === "Build Outline") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          Write a brief blog outline in rich text using <b> tags based on the following topic: ${blogTitle}. 
          ${blogInstructions && `USER INSTRUCTIONS FOR BLOG (use only if necessary): ${blogInstructions}`}.
          KEEP IN MIND: this is for a blog post ${wordRange} long.
          ALSO, WRAP EVERY NEW LINE & HEADING IN <p> TAGS.
          
          EXAMPLE OUTLINE FORMAT TO FOLLOW:

          I. Introduction
              A. Definition of Probate Law
              B. Importance of Avoiding Probate
              C. Overview of Probate Process in Dallas

          II. Understanding Probate Law
              A. What is Probate?
              B. How Does Probate Work in Dallas?
              C. Key Terms and Concepts in Probate Law

          III. Reasons to Avoid Probate
              A. Time Consuming Process
              B. Costly Fees and Expenses
              C. Lack of Privacy
              D. Potential Family Conflicts

          IV. Strategies for Avoiding Probate in Dallas
              A. Estate Planning Tools
                  1. Revocable Living Trusts
                  2. Joint Ownership
                  3. Beneficiary Designations
                  4. Transfer-on-Death Designations
              B. Importance of Legal Counsel
                  1. Hiring an Experienced Estate Planning Attorney
                  2. Tailoring Strategies to Individual Needs
                  3. Ensuring Compliance with Texas Laws

          V. Steps to Take to Avoid Probate
              A. Reviewing and Updating Estate Plan Regularly
              B. Organizing and Documenting Assets
              C. Communicating Plans with Family Members

          VI. Common Misconceptions About Probate
              A. "I Don't Need an Estate Plan Because I'm Not Wealthy"
              B. "My Will Can Avoid Probate"
              C. "Probate is Only Necessary for Large Estates"

          VII. Conclusion
              A. Summary of Key Points
              B. Importance of Taking Action to Avoid Probate
              C. Encouragement to Seek Professional Legal Advice
                    
          `
        });
      }

      if (currentMode === "Alter Draft") {
        messages.push({
          "role": "user", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          EDIT the blog post given below based on this prompt: ${blogTitle}. Don't deviate from the prompt and keep the blog post AS MUCH THE SAME as you can. NEVER START by saying anything else - output ONLY the blog post.
          BLOG POST: ${text}.
          
          <instruction>
          IMPORTANT INSTRUCTIONS:
          - FORMATTING: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs and also all individual pointers in <p> tags. Use b tags only in same-line text.
          - WORD RANGE: this post should be ${wordRange} long.
          - SPECIFICITY: Be as specific and detailed as possible. Don't be repetitive or ramble.
          - PERSPECTIVE: Don't refer to yourself in the post, but feel free to explain how your firm  can help.
          - IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: {Image Description}//. 
          Add two <br> tags after. Make sure these are evenly spaced out in the post and with specific and relevant descriptions.
          - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}
          - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
          - ${isUseInternalLinks && `INTERNAL LINKS: Add internal links to the blog post using <a> tags.`}
          - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
          - ${browseTextResponse !== "" && `WEB RESULTS: Please consider using the following internet information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
          </instruction>
          `
        });
      }

    //  const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
    //  method: 'POST', headers: { 'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, 'Content-Type': 'application/json', },
    //  body: JSON.stringify({ model: "gpt-3.5-turbo-0125", messages, }), });

    const generationText = currentMode === "Build Outline" ? 'Building Outline': 'Generating Article'; setLoadIndicator([generationText, 60]);

    const claudeResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messages, blogTitle, blogInstructions,
            model: modelKeys[selectedModel], system: 
        `
        ${currentMode === "Generate" ?
        `
        <role>You are Pentra AI, a friendly, witty lawyer & expert SEO writer for ${firmName}. ${firmName} is described as such: ${firmDescription}.
        Mention ${firmName} ONLY at the end. </role> 

        <instruction>

        IMPORTANT INSTRUCTIONS:
        - FORMATTING: Wrap titles in <h1> and sub-titles in <h2> tags. Wrap all paragraphs (and everything else that should have a line after) in <p> tags. Use b tags only in same-line text or 'title: paragraph'.
        - PERSPECTIVE: Don't refer to yourself in the post. Explain how your firm ${firmName} can help, but only at the end.
        ${imageCount !== "No Images" && `- IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: {Relevant Image Description}//.
        Make sure these are evenly spaced out in the post, and place them after h tags or in between paragraphs.`}
        - SPECIFICITY: Be as specific and detailed as possible. Don't be repetitive and ramble.
        - ${style !== "Unstyled" && `STYLE: This blog post MUST be written in the ${style} style.`}
        - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
        - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
        - ${contactUsLink && `CONTACT US LINK AT END: Use this contact us link with <a> tags toward the end if applicable: ${contactUsLink}`}
        - ${isUseInternalLinks && `LINK TO RELEVANT POSTS: Use <a> tags to add link(s) to relevant blog posts from the firm wherever applicable: ${internalLinks}.`}
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from leading websites: ${browseTextResponse}`}
        - NEVER OUTPUT ANYTHING other than the blog content. DONT START BY DESCRIBING WHAT YOURE OUTPUTING, JUST OUTPUT. DONT OUTPUT INACCURATE INFORMATION.
      
        </instruction>

        ${isMimicBlogStyle && 
          `VERY VERY IMPORTANT: REPRODUCE THE TONE & STYLE OF THE FOLLOWING BLOGS PERFECTLY IN YOUR OUTPUT. YOUR OUTPUT ALSO MUST BE FRIENDLY & APPROACHABLE. BLOGS:
         ${smallBlog}`} 
        `
        : `<role>You are Pentra AI, a legal expert and an expert SEO blog writer for ${firmName}. ${firmDescription}.</role>` 
      }`
    }), });

    const elongationPrompt = `
    <instruction>
    - YOUR GOAL IS TO COPY THE USER-GIVEN DRAFT AND ELONGATE IT TO MAKE IT ${wordRange} LONG. 
    Right now it's falling a little short.
    - COPY THE TEXT'S CURRENT FORMAT EXACTLY: Wrap titles in <h1> and <h2> tags. Wrap all paragraphs in <p> tags. 
    - EXCEPTION: Just make sure the final how we can help / contact us paragraph remains at the end of your output.
    - STYLE & TONE: Keep the voice and tone of the text exactly the same when elongating it.
    - IMAGES: KEEP ALL IMAGES as they are. You're allowed to add one new one in your elongation in the same format.
    - OUTPUT: ONLY output the final article. NEVER START by saying anything else.
    </instruction>
    `

    let gptResponse = (await claudeResponse.text()).replace(/<br><br> /g, '<br><br>');
    const textWithBreaks0 = await gptResponse.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/b>|<\/ul>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/<\/ol>/gi, '$&<br><br>').replace(/(<image[^>]*>)/gi, '$&<br><br>');    
    if (currentMode === "Build Outline") {setCurrentMode('Generate');};
    if (currentMode === "Build Outline") {await setIsGenerating(false); await setText(textWithBreaks0); console.log('return'); return;};

    // const data = await gptResponse.json();
    // const gptText = data.choices[0].message.content.trim();
    // const textWithImages = await addImages(gptText);

    const lowerRange = wordRange === "Upto 200 Words" ? 0 : parseInt(wordRange.split('-')[0], 10); let counter = 0;
    while (lowerRange > gptResponse.split(' ').length && counter < 3) {

      setLoadIndicator(['Improving Article', 75]);
      messages = [{"role": "user", "content": gptResponse}]; console.log('RUNNING:', gptResponse.split(' ').length, ' < ', lowerRange, 'count: ', counter);
      // eslint-disable-next-line no-await-in-loop
      const claudeElongationResponse = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ messages, model: modelKeys[selectedModel], system: elongationPrompt})});

      // eslint-disable-next-line no-await-in-loop
      gptResponse = await claudeElongationResponse.text();
      counter += 1; console.log('RAN: gptresponse', gptResponse, gptResponse.split(' ').length, lowerRange);
    }

    let textWithImages = gptResponse.trim();
    setLoadIndicator(['Adding All Images', 90]);
    if (isImagesOn) {textWithImages = await addImages(gptResponse.trim());}
    const textWithBreaks = await textWithImages.replace(/<br\s*\/?>/gi, '').replace(/<\/p>|<\/h1>|<\/h2>|<\/h3>|\/\/Image:.*?\/\//gi, '$&<br>').replace(/<\/ol>/gi, '$&<br><br>').replace(/(<img[^>]*>)/gi, '$&<br><br>');
    await setText(textWithBreaks); console.log(textWithBreaks);

    if (currentMode === "Generate") await setWordCount(textWithBreaks.split(' ').length);
    if (currentMode === "Generate") {setCurrentMode('Alter Draft');};
    setIsGenerating(false);

    try {
      const firmDatabase = collection(db, 'firms');
      const data = await getDocs(firmDatabase);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      const firmDoc = data.docs.find((docc) => docc.id === userDoc.data().FIRM);
      if (firmDoc) {  
        const firmDocRef = doc(db, 'firms', firmDoc.id);
        const currentDate = new Date();
        const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().substr(-2)} | ${currentDate.getHours() % 12 || 12}:${currentDate.getMinutes()} ${currentDate.getHours() >= 12 ? 'PM' : 'AM'}`;
        const genPosts = firmDoc.data().GEN_POSTS || [];
        const newPost = { [formattedDate]: textWithImages }; genPosts.unshift(newPost);
        await updateDoc(firmDocRef, { GEN_POSTS: genPosts });
    }} catch (err) {console.log('ERRORRRRRR', err);}


  };

  const addImages = async (imagelessText) => {
    const regex = /\/\/Image: (.*?)\/\//g;
    const matches = [...imagelessText.matchAll(regex)];
    const descriptions = matches.map(match => match[1]);

    let imagefullText = imagelessText;
    
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

      let counter = 0; let data;
      while (counter < 2) {
        // eslint-disable-next-line no-await-in-loop
        data = await fetch(url, { method: 'POST', headers, body: payload })
          .then(response => response.json())
          .catch(error => console.error('Error:', error));
        if (data.tasks[0].result[0].items[0].source_url !== undefined) {break;} else {console.log('rerunn img')};
      counter += 1; }
      if (data) {resultImg = `<img src="${data.tasks[0].result[0].items[0].source_url}" alt="${description}" style="max-width: 600px;" />`;}

      return resultImg;
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


  const browseWeb = async (prompt) => {

    const youUrl = `https://us-central1-pentra-claude-gcp.cloudfunctions.net/youAPIFunction`;
    const apiKey = '7cc375a9-d226-4d79-b55d-b1286ddb4609<__>1P4FjdETU8N2v5f458P2BaEp-Pu3rUjGEYkI4jh';
    const query = encodeURIComponent(`GIVE FACTUAL LEGAL INFORMATION SPECIFICALLY ON: ${blogTitle}.`);
    let claudeKeyPoints = "";

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

  if (isAdvancedBrowseWeb) {
    setLoadIndicator(['Deeply Researching', 37.5]); 
    const results = []; 

    try {
    const youResponse = await fetch(youUrl, options);
    const data = await youResponse.json(); console.log(data); 
    setSources(data.hits); setDoneSourcing(true);

      for (let i = 0; i < 3; i += 1) {
        console.log('RUN ', i, data.hits[i]);
        const url = data.hits[i].url; const title = data.hits[i].title;

        try {
          // eslint-disable-next-line no-await-in-loop
          const response = await fetch('https://api.firecrawl.dev/v0/scrape', {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 
            'Authorization': 'Bearer fc-62533a96243b43b597852174840099a3'},
            body: JSON.stringify({ url })
          });
          // eslint-disable-next-line no-await-in-loop
          const data0 = await response.json();
          const content = data0.data.content;
          const startIndex = content.indexOf('==================');
          if (startIndex !== -1) {
            const words = content.slice(startIndex).split(' ');
            const slicedWords = words.slice(0, 4000);
            const result = {LINK: url, TITLE: title, CONTENT: slicedWords.join(' ')};
            results.push(result);
            console.log(result);
          }
        } catch (err) {console.error(err);}
      }} catch (err) {console.error(err);}

    setLoadIndicator(['Synthesizing Info', 45]); 

    claudeKeyPoints = await fetch('https://us-central1-pentra-claude-gcp.cloudfunctions.net/gcp-claudeAPI', {
    method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ 
    model: modelKeys[1], messages: [{role: "user", content: `Give me 10-14 comprehensive and detailed key points for the web results
    given below, SPECIFICALLY in the context of ${blogTitle}. DONT DEVIATE. DATA: ${JSON.stringify(results)} `}],})});


    } else {

    return fetch(youUrl, options)
    .then(response => response.json())
    .then(data => {console.log(data); setSources(data.hits); setDoneSourcing(true); return data;})
    .catch(err => {console.error(err); return err;});
    
  } return (claudeKeyPoints.text());
}


  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      <script src="http://localhost:30015/embed.min.js" defer />
      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
        <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 2, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>
        Create Blog Post
      </Typography>

      <Stack direction="row" spacing={2} >

      <Button variant="contained" startIcon={<Iconify icon="solar:document-text-outline" sx={{height: '17.0px'}} />} 
      onClick={() => {
        switch (wordRange) {
          case "Upto 200 Words": setWordRange("200 - 400 Words"); break;
          case "200 - 400 Words": setWordRange("400 - 600 Words"); break;
          case "400 - 600 Words": setWordRange("600 - 800 Words"); break;
          case "600 - 800 Words": setWordRange("800 - 1000 Words"); break;
          case "800 - 1000 Words": setWordRange("1000 - 1200 Words"); break;
          case "1000 - 1200 Words": setWordRange("1200 - 1400 Words"); break;
          // case "1200 - 1400 Words": setWordRange("1400 - 1600 Words"); break;
          case "1200 - 1400 Words": setWordRange("Upto 200 Words"); break;
          default: setWordRange("600 - 800 Words");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green,
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>
      {wordRange} </Button>

      <Button variant="contained" startIcon={<Iconify icon="ph:images-bold" />} 
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

      <Button variant="contained"
      sx={(theme) => ({backgroundColor: theme.palette.primary.green, '&:hover': { backgroundColor: theme.palette.primary.green, },
      width: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '10px',})}
      onClick={() => {setIsBrowseWeb(!isBrowseWeb);}}>
        <Iconify icon= {isBrowseWeb ? "mdi:web" : "mdi:web-cancel"} sx={{minHeight: '18.25px', minWidth: '18.25px'}}/>
      </Button>

      <Button variant="contained" startIcon={<Iconify icon="material-symbols:emoji-food-beverage" sx={{height: '18px'}}/>} 
      onClick={() => {
        switch (style) {
          case "Unstyled": setStyle("How-To Guide"); break;
          case "How-To Guide": setStyle("Data-Dense"); break;
          case "Data-Dense": setStyle("Opinion"); break;
          case "Opinion": setStyle("Case Study"); break;
          case "Case Study": setStyle("Case Law Breakdown"); break;
          case "Case Law Breakdown": setStyle("Unstyled"); break;
          default: setStyle("Unstyled");
        }
      }}
      sx={(theme) => ({ backgroundColor: theme.palette.primary.green,
      '&:hover': { backgroundColor: theme.palette.primary.green, }, })}>        
      {style} </Button>

      {isBrowseWeb && sources.length !== 0 && <Button variant="contained" startIcon={<Iconify icon= {doneSourcing ? "map:search" : "line-md:downloading-loop"} sx={{height: '18px'}}/>}  
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: '40px', paddingLeft: '28px', minWidth: '10px',})}
      onClick={() => {if (sources.length !== 0) {setIsSourcesOpen(!isSourcesOpen);}}} />}

      <Card sx={(theme) => ({position: 'absolute', top: '122px', right: '54px', height: '362.5px', width: '460px', 
      display: isSourcesOpen ? 'block' : 'none', zIndex: 100, backgroundColor: 'white', padding: '0px', 
      border: `1.5px solid ${theme.palette.primary.navBg}`, borderRadius: '4px', boxShadow: 'none', overflow: 'auto'})}>
        
      <Card sx={(theme) => ({top: '0px', height: '52.5px', width: '100%', borderRadius: '0px', color: 'white',
      backgroundColor: theme.palette.primary.navBg, display: 'flex', alignItems: 'center',
      fontSize: '16px', letterSpacing: '-0.25px', paddingLeft: '12px', fontWeight: '600'})}> 
      <Iconify icon= "map:search" sx={{height: '14.5px', marginRight: '4px'}}/>
      {doneSourcing ? "Searched for" : "Searching for"} {blogTitle}
      </Card>

      {sources.map((source, index) => (

        <ListItem 
          key={index} 
          sx={{height: expandedSource === index ? 'auto' : '102.5px', borderBottom: sources.length > 3 ? (index !== sources.length - 1 && '1.5px solid darkred') : '1px solid #c2c1c0',
          transition: 'all 0.2s ease', padding: expandedSource === index && '14.5px', justifyContent: 'space-between', paddingInline: '15.5px'}}>          

          <Stack direction="column" spacing={0.75}>
          <ListItemText primaryTypographyProps={{ style: { fontSize: '15.75px', fontWeight: '600', 
          letterSpacing: '-0.15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', 
          maxWidth: '325px', } }}>{source.title} </ListItemText>

          <Iconify icon={(isAdvancedBrowseWeb && (index === 0 || index === 1 || index === 2)) ? "noto:star" : ""} sx={{width: '19.5px',
          height: '19.5px', position: 'absolute', right: '80px', top: '8.75px', cursor: 'pointer'}}
          onClick={() => {setExpandedSource(expandedSource === index ? null : index);}}/>

          <Iconify icon="fluent:link-multiple-24-filled" sx={{width: '19.5px', height: '19.5px', position: 'absolute',
          right: '49.5px', top: '10.25px', cursor: 'pointer'}}
          onClick={() => {const url = source.url.startsWith('http://') || source.url.startsWith('https://') ? source.url : `http://${source.url}`; window.open(url, '_blank');}}/>

          <Iconify icon={expandedSource === index ? "eva:arrow-up-fill" : "eva:arrow-down-fill"} sx={{width: '29px', height: '29px', position: 'absolute',
          right: '15px', top: '5.0px', cursor: 'pointer'}}
          onClick={() => {setExpandedSource(expandedSource === index ? null : index);}}/>

          {expandedSource === index ? (
              <Typography variant="body2" style={{width: '420px',}}
              >{source.snippet}</Typography> ) : (
              <Typography variant="body2" style={{ width: '420px',
                  overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', 
                  WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{source.snippet}
              </Typography>
          )}
          </Stack></ListItem>
      ))}

      </Card>

        {currentMode === "Alter Draft" && <Button variant="contained" startIcon={<Iconify icon="mingcute:quill-pen-fill" sx={{height: '20px'}}/>} // iconoir:post
        sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', },}}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        New Article </Button>}

        {currentMode === "Build Outline" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" sx={{height: '20px'}}/>} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, },})}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        Skip Outline </Button>}

        </Stack></Stack>

      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>

      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      
      <TextField value={blogTitle} onChange={(e) => setBlogTitle(e.target.value)}
       placeholder={currentMode === "Alter Draft" ? 'Make the first two sections shorter & replace mentions of TX with Dallas' : 'Blog Post Title'}
       sx={{width: currentMode === "Alter Draft" ? '100%' : '61%', transition: 'ease 0.3s'}} />

    
      {isGenerating && (
      <Stack direction="column" spacing={loadIndicator[0] === "Welcome Back!" ? 0.5 : 1.25} sx={{top: '382.5px', right: 'calc((100% - 285px)/2 - 160px)', position: 'absolute', 
      height: 'auto', width: '320px', backgroundColor: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>

      <Typography sx={{ fontFamily: "DM Serif Display",
      letterSpacing: '-0.55px',  fontWeight: 500, fontSize: '36.75px'}}>
        {loadIndicator[0]}
      </Typography>

      {loadIndicator[0] !== "Welcome Back!" && <Card sx={(theme) => ({height: '45px', backgroundColor: 'white', width: '100%', borderRadius: '6px',
      border: `2.00px solid ${theme.palette.primary.navBg}`, background: `linear-gradient(to right, ${theme.palette.primary.navBg} ${loadIndicator[1]}%, white 20%)`,
      transition: '1s ease all' })} />}

      {loadIndicator[0] === "Welcome Back!" && !isReferenceGiven && <Typography sx={{ fontFamily: "serif", 
      lineHeight: '32.5px', letterSpacing: '-0.25px',  fontWeight: 200, fontSize: '23.75px', textAlign: 'center'}}>
        This is the place your new <br />  articles will appear.
      </Typography>}

      </Stack>)}

      {currentMode !== "Alter Draft" && <TextField
       value={blogInstructions}
       onChange={(e) => setBlogInstructions(e.target.value)}
       placeholder='Optional Instructions / Keywords'
       sx={{width: '60%', transition: 'ease 0.3s'}} />}
       </Stack>
       
        <Button onClick={() => generateBlog()}
        variant="contained" color="inherit" 
        sx={(theme) => ({height: '54px', width: '150px', backgroundColor: currentMode === "Generate" ? theme.palette.primary.navBg : theme.palette.primary.black})}>
          {currentMode} ✨
        </Button>
        </Stack>

        <ReactQuill 
        value={text}
        onChange={setText}
        style={{ 
          width: boxWidth, 
          height: boxHeight,                
          marginBottom: '58px', 
          border: '0px solid #ccc',
          borderRadius: '0px', 
          backgroundColor: isGenerating ? 'white' : 'white',
          opacity: '1',
          transition: 'ease-in-out 0.3s',
          // ...loadingAnimation
        }}
      />

      <Typography sx={{ position: 'absolute', fontSize: '14px', fontFamily: 'Arial', 
            top: '206.5px', right: '72.5px', letterSpacing: '-0.25px', fontWeight: '600' }}>
        {wordCount && currentMode === "Alter Draft" ? `${wordCount} Words` : ''}
      </Typography>


      
        <Stack direction="row" spacing={2} >

        <Button variant="contained" sx={(theme) => ({backgroundColor: theme.palette.primary.black, '&:hover': { backgroundColor: theme.palette.primary.black, }, cursor: 'default'})}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>
                  
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsAdvancedBrowseWeb(!isAdvancedBrowseWeb); setIsReferenceGiven(false);}}
        sx={(theme) => ({backgroundColor: isAdvancedBrowseWeb ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, border: "2.5px solid darkgreen" },
        maxHeight: '36.0px',
        border: isAdvancedBrowseWeb ? "2.5px solid darkgreen" : '2.5px solid grey'})}>
        Do Deep Research </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMimicBlogStyle(!isMimicBlogStyle)}}
        sx={(theme) => ({backgroundColor: isMimicBlogStyle ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mimic Firm Blogs </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMentionCaseLaw(!isMentionCaseLaw)}}
        sx={(theme) => ({backgroundColor: isMentionCaseLaw ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Mention Cases </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsReferenceGiven(!isReferenceGiven); setIsBrowseWeb(false);}}
        sx={(theme) => ({backgroundColor: isReferenceGiven ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        New Data </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsUseInternalLinks(!isUseInternalLinks)}}
        sx={(theme) => ({backgroundColor: isUseInternalLinks ? theme.palette.primary.green : 'grey', '&:hover': { backgroundColor: theme.palette.primary.green, },})}>
        Internal Links </Button>

        </Stack> 

        {isReferenceGiven && (
        <textarea value={referenceText} onChange={(e) => setReferenceText(e.target.value)} 
        style={{width: '100%', height: '125px', marginTop: '18px', border: '0.1px solid',
        borderRadius: '0px', padding: '15px', fontSize: '15px', fontFamily: 'Arial',}} 
        placeholder='Feed any text here you would like the AI model to use. It helps to explain how youd like it to use it in the blog description.'/>
        )}    

    
    </Container>
  );
}
