import { useState, useEffect } from 'react';
import { Editor, EditorState } from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles
import Anthropic from '@anthropic-ai/sdk';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { collection } from 'firebase/firestore';
import Iconify from 'src/components/iconify';
import { db } from 'src/firebase-config/firebase';
import Button from '@mui/material/Button';
import { Card, TextField } from '@mui/material';
import { css, keyframes } from '@emotion/react';

// import sdk from 'api'; 

const anthropic = new Anthropic({
  apiKey: `${import.meta.env.VITE_ANTHROPIC_API_KEY}`,
});
// ----------------------------------------------------------------------

export default function ProductsView() {

  const [text, setText] = 
  useState(`<h1>Welcome Back!</h1> Let's draft a new legal blog post. <br>This is where your content shows up.`);
  // useState(`<h1>✨ Generating... </h1>`);

  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState(null);

  const [isGenMode, setIsGenMode] = useState(false);
  const [isAlterMode, setIsAlterMode] = useState(false);
  const [currentMode, setCurrentMode] = useState('Build Outline');
  const [isGenerating, setIsGenerating] = useState(false);

  const [isBrowseWeb, setIsBrowseWeb] = useState(false);
  const [browseText, setBrowseText] = useState("");
  // const [browseTextResponse, setBrowseTextResponse] = useState(null);

  const [isMimicBlogStyle, setIsMimicBlogStyle] = useState(false);
  const [imageCount, setImageCount] = useState("2 Images");
  const [wordRange, setWordRange] = useState("600 - 800 Words");
  const [style, setStyle] = useState("Unstyled");
  const [isReferenceGiven, setIsReferenceGiven] = useState(false);
  const [referenceText, setReferenceText] = useState(null);
  const [isUseInternalLinks, setIsUseInternalLinks] = useState(false);
  const [isMentionCaseLaw, setIsMentionCaseLaw] = useState(false);

  let boxHeight;
  if (isReferenceGiven) { boxHeight = 'calc(80% - 330px)';} 
  else if (isBrowseWeb) { boxHeight = 'calc(80% - 125px)';} 
  else { boxHeight = 'calc(80% - 55px)'; }
  const boxWidth = 'calc(100%)';

  const [dots, setDots] = useState('');
  useEffect(() => {
    const intervalId = isGenerating && setInterval(() => {
      setDots(prevDots => {
        const newDots = prevDots.length < 3 ? `${prevDots}.` : '';
        setText(`<h1>✨ Generating${newDots} </h1>`);
        return newDots;
      }); }, 1000);
    return () => intervalId && clearInterval(intervalId);
  }, [isGenerating]);

  // BLOG GENERATION

  const generateBlog = async () => {

      setText(`<h1>✨ Generating${dots} </h1>`);
      setIsGenerating(true);
      const messages = [];

      let browseTextResponse = "";

      if (currentMode === "Generate") {
        if (isBrowseWeb) {browseTextResponse = await browseWeb(browseText); alert(browseTextResponse);};
        messages.push({
          "role": "system", 
          "content":  `You are Pentra AI, a legal expert and an expert SEO blog writer.  Write a blog post based on the following topic: ${blogDescription}. 
          ${blogKeywords && `Keywords: ${blogKeywords}`}. ${text !== "" && `Consider using the following outline: ${text}`}. 
          
          IMPORTANT INSTRUCTIONS:
          - Wrap titles in <h1> and <h2> tags. Dont use ANY new lines but add two <br> tags after EVERY paragraph and one <br> tag after EVERY h1/h2 tag.
          - WORD RANGE: this post should be ${wordRange} long.
          - IMAGES: blog post should contain ${imageCount}. Please add representations of them in this format: //Image: Idaho Courthouse// OR //Image: Chapter 7 Bankruptcy Flowchart//. 
          Add two <br> tags after. Make sure these are evenly spaced out in the post and with specific and relevant descriptions.
          - ${style !== "Unstyled" && `STYLE: This blog post should be written in the ${style} style.`}
          - ${isMentionCaseLaw && `CASE LAW: Reference case law in the blog post when necessary.`}
          - ${isUseInternalLinks && `INTERNAL LINKS: Add some internal links to the blog post using <a> tags.`}
          - ${isReferenceGiven && `USEFUL DATA: Refer to the following text and use as applicable: ${referenceText}`}
          - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
          `
        });
      }

      if (currentMode === "Build Outline") {
        messages.push({
          "role": "system", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          Write a detailed blog outline in rich text format using <h1> tags and <br> tags (after every paragraph/line) based on the following topic: ${blogDescription}. ${blogKeywords && `Keywords: ${blogKeywords}`}.`
        });
      }

      if (currentMode === "Alter Draft") {
        messages.push({
          "role": "system", 
          "content": `You are Pentra AI, a legal expert and an expert SEO blog writer. 
          EDIT the blog post given below based on this prompt: ${blogDescription}. Don't deviate from the prompt and keep the blog post AS MUCH THE SAME as you can.
          BLOG POST: ${text}.`
        });
      }

      const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,  
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages,
      }), });

      if (currentMode === "Build Outline") {setCurrentMode('Generate');};
      if (currentMode === "Generate") {setCurrentMode('Alter Draft');};

    const data = await gptResponse.json();
    // const textWithImages = await addImages(data.choices[0].message.content.trim());
    const textWithImages = data.choices[0].message.content.trim();
    await setText(textWithImages);
    setIsGenerating(false);

    // const gptResponse = await anthropic.messages.create({
    //   model: "claude-3-sonnet-20240229",
    //   max_tokens: 4024,
    //   messages: [{ role: "user", content: "Hello, Claude. hows it going?" }],
    // });

    // gptResponse().then((data) => {
    //   console.log(data.content[0].text);
    //   alert(data.content[0].text);
    // });

  };

  const addImages = async (imagelessText) => {

    const regex = /\/\/Image: (.*?)\/\//g;
    const matches = [...imagelessText.matchAll(regex)];
    const descriptions = matches.map(match => match[1]);

    const subscriptionKey = 'c6f3a31686d04a81b68f71ac7a6eed38';
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

    const imageTags = await Promise.all(descriptions.map(fetchImage));

    matches.forEach((match, index) => {
      if (imageTags[index]) {
        imagefullText = imagefullText.replace(match[0], imageTags[index]);
      }
    });

    return imagefullText;
  }


  const browseWeb = (prompt) => {
    const apiKey = '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';
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
      
      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
      <Typography variant="h3" sx={{ mb: 2, letterSpacing: '-0.px' }}>
        Create Blog Post
      </Typography>

      <Stack direction="row" spacing={2} >

      <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
      onClick={() => {
        switch (wordRange) {
          case "Upto 200 Words": setWordRange("200 - 400 Words"); break;
          case "200 - 400 Words": setWordRange("400 - 600 Words"); break;
          case "400 - 600 Words": setWordRange("600 - 800 Words"); break;
          case "600 - 800 Words": setWordRange("800 - 1000 Words"); break;
          case "800 - 1000 Words": setWordRange("1000 - 1200 Words"); break;
          case "1000 - 1200 Words": setWordRange("Upto 200 Words"); break;
          default: setWordRange("600 - 800 Words");
        }
      }}
      sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
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
      sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
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
        sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
        {style} </Button>

        {currentMode === "Alter Draft" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
        sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', },}}
        onClick={() => {setCurrentMode("Build Outline"); setText('');}}>
        Create New Draft </Button>}

        {currentMode === "Build Outline" && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} 
        sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', },}}
        onClick={() => {setCurrentMode("Generate"); setText('');}}>
        Skip Outline </Button>}

        </Stack></Stack>

      <Stack mb={2} direction="row" alignItems="center" justifyContent="space-between"
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
        sx={{height: '54px', width: '150px', backgroundColor: currentMode === "Generate" ? '#242424' : '#2e2a1f'}}>
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
          backgroundColor: isGenerating ? '#fffefa' : 'white',
          opacity: '1',
          transition: 'ease-in-out 1s',
          // ...loadingAnimation
        }}
      />

      
        <Stack direction="row" spacing={2} >

        <Button variant="contained" sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', }, cursor: 'default'}}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>
                  
        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsBrowseWeb(!isBrowseWeb); setIsReferenceGiven(false);}}
        sx={{backgroundColor: isBrowseWeb ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Browse Web </Button>

        <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMentionCaseLaw(!isMentionCaseLaw)}}
        sx={{backgroundColor: isMentionCaseLaw ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Mention Case Law </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsMimicBlogStyle(!isMimicBlogStyle)}}
        sx={{backgroundColor: isMimicBlogStyle ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
        Mimic My Firm&apos;s Style </Button>


          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsReferenceGiven(!isReferenceGiven); setIsBrowseWeb(false);}}
        sx={{backgroundColor: isReferenceGiven ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
          Use New Data </Button>

          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => {setIsUseInternalLinks(!isUseInternalLinks)}}
        sx={{backgroundColor: isUseInternalLinks ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', },}}>
          Internal Links </Button>

        </Stack> 

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
