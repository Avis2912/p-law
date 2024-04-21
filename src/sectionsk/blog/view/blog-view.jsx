import { useState, useEffect } from 'react';
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
import { Card, TextField } from '@mui/material';
import { css, keyframes } from '@emotion/react';


const isImagesOn = true;
const modelKeys = {
1: 'claude-3-haiku-20240307',
2: 'claude-3-sonnet-20240229',
3: 'claude-3-opus-20240229'} 


// ----------------------------------------------------------------------

export default function ProductsView() {

  const queryParams = new URLSearchParams(window.location.search);
  const blogId = queryParams.get('blogID');

  const [text, setText] = 
  useState(`<h1>Welcome Back!</h1> Let's draft a new legal blog post. <br>This is where your content shows up.`);
  // useState(`<h1>✨ Generating... </h1>`);
  const navigate = useNavigate();

  const [blogText, setBlogText] = useState('');
  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState(null);
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

  const boxHeight = 'calc(80% + 45px)'; 
  const boxWidth = 'calc(100%)';

  const [dots, setDots] = useState('');
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
            await setBlogText(firmDoc.data().WEEKLY_BLOGS.BLOGS[blogId].content); 
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
  
  }, [blogText, blogId]);

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

  return (
    <Container sx={{backgroundColor: '', height: '100%', paddingBottom: '20px'}}>
      <script src="http://localhost:30015/embed.min.js" defer />
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 2, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>
        Edit Blog Post Draft
      </Typography>

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

        <Button variant="contained" startIcon={<Iconify icon="icon-park-solid:left-c" />} 
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.black, },})}
        onClick={() => {navigate('/weeklyblogs')}}>
        Return To Weekly Posts </Button>

        </Stack></Stack>

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
        </Button>
        </Stack> */}

        <ReactQuill 
        value={text}
        onChange={setText}
        style={{ 
          width: boxWidth, 
          height: boxHeight,                
          marginBottom: '58px', 
          border: '0px solid #ccc',
          borderRadius: '0px', 
          backgroundColor: isGenerating ? '#fffefa' : 'white',
          opacity: '1',
          transition: 'ease-in-out 0.3s',
        }}
      />

      <Typography sx={{ position: 'absolute', fontSize: '14px', fontFamily: 'Arial', 
            top: '143.5px', right: '72.5px', letterSpacing: '-0.25px', fontWeight: '600' }}>
        {wordCount !== 0 ? `${wordCount} Words` : ''}
      </Typography>


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

        

    
    </Container>
  );
}
