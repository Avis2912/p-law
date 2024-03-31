import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect } from 'react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import Iconify from 'src/components/iconify';

import { set } from 'lodash';
import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

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

  const [weeklyPosts, setWeeklyPosts] = useState([
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "LinkedIn", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },

    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Facebook", content: "<h1>Weekly Post 2</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },

    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    { platform: "Instagram", content: "<h1>Weekly Post 1</h1> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    
  ]);

  
  useEffect(() => {
    
    setWeeklyPosts([
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src=https://cdn-prod.medicalnewstoday.com/content/images/articles/325/325253/assortment-of-fruits.jpg> " },
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src=https://cdn-prod.medicalnewstoday.com/content/images/articles/325/325253/assortment-of-fruits.jpg> " },
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src=https://cdn-prod.medicalnewstoday.com/content/images/articles/325/325253/assortment-of-fruits.jpg> " },
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "LinkedIn", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },

      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Facebook", content: "<h2>Weekly Post 2</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },

      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
      { platform: "Instagram", content: "<h2>Weekly Post 1</h2> This is where content appears. <image src='https://via.placeholder.com/150' />" },
    ])

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
    
    // const brandsData = collection(db, 'brands');
    // const getBrandCampaigns = async () => {
    //   try {
    //     const data = await getDocs(brandsData);
    //     const userDoc = data.docs.find((docc) => docc.id === auth.currentUser.email);
    //     if (userDoc) {
    //       await setBrandCampaigns(userDoc.data().campaigns || []);
    //     } else {
    //       alert('Error: User document not found.');
    //     }
    //   } catch (err) {
    //     alert(err);
    //   }
    // };

    // getBrandCampaigns();
  }, [genPostPlatform]);

  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    if (genPostPlatform) {setGenPostPlatform(null)} 
    else {setGenPostPlatform("LinkedIn")};
  }

  const generatePosts = async () => {
    setIsGenerating(true);
      const messages = [];

      let browseTextResponse = "";

      if (isUseNews) {browseTextResponse = await browseWeb(browseText); console.log('PERPLEXITY: ', browseTextResponse);};
      messages.push({
        "role": "system", 
        "content":  `You are Pentra AI, a legal expert and an expert marketer.  
        YOUR GOAL: Write 3 posts for ${genPostPlatform} ${postDescription !== "" && `based roughly on the following topic: ${postDescription}.`}. 
        
        IMPORTANT INSTRUCTIONS:
        - RESPONSE FORMAT: Always respond with a JSON-parsable array of 3 hashmaps, 
        EXAMPLE OUTPUT: "[{"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}, {"platform": "${genPostPlatform}", "content": "*Post Content*"}]". 
        ONLY OUTPUT THE ARRAY. NOTHING ELSE.
        - Wrap titles in <h2> tags. Dont use ANY new lines but add one <br> tags after EVERY paragraph and h1/h2 tag.
        - PARAGRAPH COUNT: these posts should be ${wordRange} paragraphs long. 
        - IMAGES: blog post should contain 1 image, placed after the h2 post title. Please add it in this format: //Image: Idaho Courthouse// OR //Image: Chapter 7 Bankruptcy Flowchart//.
        - ${browseTextResponse !== "" && `WEB RESULTS: Consider using the following web information I got from an LLM for the prompt ${browseText}: ${browseTextResponse}`}
        - ${postKeywords !== "" && `KEYWORDS: Use the following keywords in your posts: ${postKeywords}.`}
        - ${style !== "Unstyled" && `STYLE: This blog post should SPECIFICALLY be written in the ${style} style.`}
        - 

        `
      });
      
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

    const data = await gptResponse.json();
    const textWithoutImages = JSON.parse(data.choices[0].message.content.trim().replace(/^```|```$/g, ''));
    console.log(textWithoutImages);
    // const textWithImages = await addImages(textWithoutImages);
    const textWithImages = textWithoutImages;
    await setGeneratedPosts(textWithImages);
    await setWeeklyPosts(textWithImages);   
    console.log(weeklyPosts);
    setIsGenerating(false);
    
  }

  const addImages = async (posts) => {
    const regex = /\/\/Image: (.*?)\/\//g;

    const fetchImage = async (description) => {
      const subscriptionKey = 'c6f3a31686d04a81b68f71ac7a6eed38';
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

    const postsWithImages = await Promise.all(posts.map(async (post) => {
      let imagefullText = post.content;
      const matches = [...imagefullText.matchAll(regex)];
      const descriptions = matches.map(match => match[1]);
      const imageTags = await Promise.all(descriptions.map(fetchImage));

      matches.forEach((match, index) => {
        if (imageTags[index]) {
          imagefullText = imagefullText.replace(match[0], imageTags[index]);
        }
      });

      return {
        ...post,
        content: imagefullText,
      };
    }));

    return postsWithImages;
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

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h3">          
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
      sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
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
        sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', },}}>
        {style} </Button>

        <Button variant="contained" sx={{backgroundColor: 'green', '&:hover': { backgroundColor: 'green', }}} startIcon={<Iconify icon="eva:plus-fill" />} 
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

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleClickRoute()}>
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
          <PostCard key={index} platform={platform} content={content} index={index} />
        ))}
      </Grid>

      {isNewPost && (<>
      <Stack direction="row" spacing={2} mt={3}>

        <Button variant="contained" sx={{backgroundColor: 'black', '&:hover': { backgroundColor: 'black', }, cursor: 'default'}}>
        Power Tools <Iconify icon="eva:arrow-right-fill" /></Button>

        <Button variant="contained" sx={{backgroundColor: imageSettings !== "No" ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', }}} startIcon={<Iconify icon="eva:plus-fill" />} 
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

        <Button variant="contained" sx={{backgroundColor: isUseNews ? 'green' : 'grey', '&:hover': { backgroundColor: 'green', }}} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => setIsUseNews(!isUseNews)}>
          Use News
        </Button>

        <Button variant="contained" sx={{backgroundColor: isUseBlog ? 'green' :'grey', '&:hover': { backgroundColor: 'green', }}} startIcon={<Iconify icon="eva:plus-fill" />} 
        onClick={() => setIsUseBlog(!isUseBlog)}>
          Use Blogs
        </Button>


      </Stack> 

      </>)}
    </Container>
  );
}
