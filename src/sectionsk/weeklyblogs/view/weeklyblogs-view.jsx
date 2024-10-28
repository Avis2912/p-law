import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import Creating from 'src/components/Creating';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions
import { useNavigate } from 'react-router-dom'; 

import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import { modelKeys } from 'src/genData/models';

// eslint-disable-next-line import/no-relative-packages
import { writeWeeklyBlogs } from '../../../../functions/src/Weekly/writeWeeklyBlogs';
import PostCard from '../weeklyblogs-card';

const isImagesOn = true;


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
  const [isUseCreativeCommons, setIsUseCreativeCommons] = useState(false);

  const [plan, setPlan] = useState('Trial Plan');
  const [selectedModel, setSelectedModel] = useState(1);
  const [weeklyBlogs, setWeeklyBlogs] = useState([]);
  const [bigBlogString, setBigBlogString] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [sources, setSources] = useState([]);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const updateDays = 7;
  const handleOpen2 = () => {setIsDialogOpen2(true);};
  const handleClose2 = () => {setIsDialogOpen2(false);};

  // PAGE LOAD FUNCTIONS


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
            const diffDays = updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            await setSelectedModel(firmDoc.data().SETTINGS.MODEL);
            await setPlan(firmDoc.data().SETTINGS.PLAN);
            await setContactUsLink(firmDoc.data().FIRM_INFO.CONTACT_US);
            await setWeeklyBlogs(firmDoc.data().WEEKLY_BLOGS.BLOGS || []);

            if (firmDoc.data().WEEKLY_BLOGS.LAST_DATE === "") {setIsUpdateTime(true); return;}
            if (diffDays >= 1) { await setTimeToUpdate(diffDays); } else { 
              setIsUpdateTime(true); writeBlogs(); console.log('WRITING BLOGS'); setWeeklyBlogs([]); 
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


  const addImages = async (posts, imagesSettings='All') => {
    const regex = /\/\/Image: (.*?)\/\//g;

    const fetchImage = async (description) => {
      let resultImg = null; 
      const url = "https://api.dataforseo.com/v3/serp/google/images/live/advanced";
      const payload = JSON.stringify([{
          keyword: `${description}`,
          location_code: 2826, language_code: "en",
          device: "desktop", os: "windows", depth: 100,
          search_param: imageSettings === 'Free' ? "&tbs=sur:cl" : ``,
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
      while (counter < 5) {
        if (data.tasks[0].result[0].items[rIndex].source_url === undefined) {rIndex = Math.floor(Math.random() * 4); console.log('rerunn serp img, undefined: ', data.tasks[0].result[0].items[rIndex].source_url, 'img desc: ', description);} else {tempUrl = data.tasks[0].result[0].items[rIndex].source_url; console.log('img not undefined: ', tempUrl, 'img desc: ', description); break;};
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

  const writeBlogs = () => { writeWeeklyBlogs(

    contactUsLink, 
    internalLinks, 
    bigBlogString, 
    firmName, 
    selectedModel, 
    modelKeys, 
    browseWeb, 
    browseText,
    isImagesOn, 
    addImages,
    plan
  );

  }

  


  return (
    <Container>

      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.1}>

        <PageTitle title={`${isNewPost ? 'Create New Posts' : 'Curated Weekly Drafts'}`} />    
        
        <Stack direction="row" spacing={2} mb={2.25}>
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
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600', '&:hover': { backgroundColor: theme.palette.primary.navBg, },})}>
          {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Update In Progress'}
        </Button>
        </>)}
        
        <Button variant="contained" color="inherit" startIcon={<Iconify icon="streamline:artificial-intelligence-spark-solid" sx={{height: '16px', width: '16px'}}/>}
         onClick={() => {setIsFeedbackMode(true); handleOpen2();}} sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          Give Pentra AI Feedback
        </Button>
      </Stack></Stack>

      {isUpdateTime && <Creating text='Currently Writing Blogs' imgUrl='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-10-23_201816734.png?alt=media&token=5b3cb682-fc18-4851-9c8f-1f1da74eadf8' />}


      <Grid container spacing={3} sx={{width: '100%'}}>
        {weeklyBlogs.map(({ platform, content }, index) => (
          <PostCard key={index} platform={platform} content={content} index={index} isGen={isGenerating} />
        ))}
      </Grid>

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
