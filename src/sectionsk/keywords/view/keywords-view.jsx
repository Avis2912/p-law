import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';

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
3: 'claude-3-sonnet-20240229'} 
// 3: 'claude-3-opus-20240229'} 

// ----------------------------------------------------------------------

export default function BlogView() {

  const [postDescription, setPostDescription] = useState('');
  const [postKeywords, setPostKeywords] = useState('');
  const [browseText, setBrowseText] = useState('');
  const [keywordToAdd, setKeywordToAdd] = useState('');

  const [isNewPost, setIsNewPost] = useState(false);
  const [isUseNews, setIsUseNews] = useState(false);
  const [isUseBlog, setIsUseBlog] = useState(false);
  const [genPostPlatform, setGenPostPlatform] = useState(null);
  const [imageSettings, setImageSettings] = useState('Brand & Web');
  const [style, setStyle] = useState('Unstyled');
  const [wordRange, setWordRange] = useState('2');

  const [timeToUpdate, setTimeToUpdate] = useState("");
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [planName, setPlanName] = useState('');
  
  const [weeklyKeywords, setWeeklyKeywords] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);
  const [isAddNewMode, setIsAddNewMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const updateDays = 14;

  const handleOpen = () => {setIsDialogOpen(true);};
  const handleClose = () => {setIsDialogOpen(false);};
  const handleOpen2 = () => {setIsDialogOpen2(true);};
  const handleClose2 = () => {setIsDialogOpen2(false);};

  const writeWeeklyKeywords = useCallback(async (key="") => {

    let actualKeywords;
    if (key === "") {actualKeywords = weeklyKeywords.map(kw => kw.keyword).join(', ');}
    else {actualKeywords = key;}

    const url = "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live";
    const payload = JSON.stringify([{
        date_from: "2023-12-24",
        search_partners: true,
        keywords: actualKeywords.split(', '),
        sort_by: "search_volume"
    }]);
    
    const headers = {
        'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
        'Content-Type': 'application/json'
    };

    await fetch(url, { method: 'POST', headers, body: payload })
    .then(response => response.json())
    .then(async data => {
      console.log(data);
      const formattedData = data.tasks[0].result.map(item => ({
        keyword: item.keyword,
        data: item.monthly_searches ? item.monthly_searches.map(search => search.search_volume).slice(0, 4) : [0, 0, 0, 0]      
      }));
      setWeeklyKeywords(formattedData);
      console.log(formattedData);

      const currentDate = new Date(); const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
      const docRef = doc(db, 'firms', userDoc.data().FIRM);
      await updateDoc(docRef, {
        "WEEKLY_KEYWORDS.KEYWORDS": formattedData,
        "WEEKLY_KEYWORDS.LAST_DATE": formattedDate
      });

    }).catch(error => console.error('Error:', error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  useEffect(() => {

    if (isUpdateTime) {setWeeklyKeywords([]); return;}; 
    
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            const lastDateParts = firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            setPlanName(firmDoc.data().SETTINGS.PLAN);

            if (typeof firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS === 'string') { writeWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS); console.log('WRITING KEYWORDS 0');}
            else {await setWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS || []); console.log('NOT A STRING');} 
            
            if (firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE === "") {setIsUpdateTime(true); return;}
            if (diffDays >= 1) { await setTimeToUpdate(diffDays); } else { setIsUpdateTime(true); writeWeeklyKeywords(); console.log('WRITING KEYWORDS'); setWeeklyKeywords([]); 
              await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.LAST_DATE': "" }); }
            
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

            console.log(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS);
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

  const trackNewKeyword = async (newKeyword) => {
    setWeeklyKeywords([{ keyword: newKeyword, data: [-1, -1, -1, -1] }, ...weeklyKeywords]); setKeywordToAdd('');
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {
      const firmData = firmDoc.data();
      await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.KEYWORDS': [{ keyword: newKeyword, data: [0, 0, 0, 0] }, ...weeklyKeywords] });
    } 
  }

  console.log(weeklyKeywords);


  return (
    <Container>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      {isUpdateTime && <>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '325px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '1.05px',  
      fontWeight: 800, fontSize: '60.75px'}}> 
        🧱 Tracking Now...
      </Typography>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '407.5px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '-0.05px',  fontWeight: 500, fontSize: '25.75px'}}> 
        {`Return in ~5 minutes and they'll be ready!`}
      </Typography> </>}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>         
        {isNewPost ? 'Add New Keywords' : 'Keywords Being Tracked'}
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

        {planName === 'Trial Plan' && <Button variant="contained" onClick={() => {handleOpen()}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="teenyicons:tick-circle-solid" sx={{height: '16px', width: '16px', 
        color: 'white', marginRight: '8px'}}/>
        Activate Keywords
      </Button>}

       {/* {!isNewPost && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600'})}>
          {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Update In Progress'}
        </Button>
        </>)} */}

        <Button variant="contained" color="inherit" startIcon={<Iconify icon={isAddNewMode ? "charm:cross" : "eva:plus-fill"} />} onClick={() => {setIsAddNewMode(!isAddNewMode)}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isAddNewMode ? 'Add New' : 'Add New'}
        </Button>

        {!isNewPost && <Button variant="contained" color="inherit" startIcon={<Iconify icon="bx:search" />} onClick={() => {handleOpen2()}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          Search
        </Button>}

      </Stack></Stack>

      {isAddNewMode && (<>
        <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" mt={0} mb={3}>
        
        <TextField
        value={keywordToAdd}
        size="large"
        onChange={(e) => setKeywordToAdd(e.target.value)}
        placeholder='New Keyword'
        sx={{width: '100%', mt: 0, }} /> 

        <Button onClick={() => {trackNewKeyword(keywordToAdd)}}
        variant="contained" color="inherit" 
        sx={{height: '55px', width: '215px', cursor: 'pointer'}}>
          <Iconify icon="eva:plus-fill" sx={{mr: '10px'}}/>
          Track Keyword 
        </Button>

        </Stack>
       </>)}

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
       
        <Button onClick={() => {}}
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
        {weeklyKeywords.map(({ keyword, data }, index) => (
          <PostCard key={index} data={data} keyword={keyword} index={index} setWeeklyKeywords={setWeeklyKeywords} />
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
      <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Please Move To A Plan</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '33.5px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        Keyword Research is <i>incredibly</i> expensive<br /> 
        for Pentra to perform! Consequently, we are <br /> 
        able to offer it only on a paid plan. If things <br /> 
        change, you&apos;ll be the first to find out. <br /> 
        </Typography>
        <Button variant="contained" onClick={() => {}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', cursor: 'default'})}>
        <Iconify icon="ic:email" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Reach out to us at pentra.hub@gmail.com
      </Button>
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
