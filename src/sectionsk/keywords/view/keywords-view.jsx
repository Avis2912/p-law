import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import PageTitle from 'src/components/PageTitle';
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

  const [keywordToAdd, setKeywordToAdd] = useState('');
  const [keywordToSearch, setKeywordToSearch] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchesMade, setSearchesMade] = useState(0);
  const [searchLimit, setSearchLimit] = useState(5);

  const [isNewPost, setIsNewPost] = useState(false);
  const [genPostPlatform, setGenPostPlatform] = useState(null);

  const [timeToUpdate, setTimeToUpdate] = useState("");
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [planName, setPlanName] = useState('');
  
  const [weeklyKeywords, setWeeklyKeywords] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);
  const [isAddNewMode, setIsAddNewMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);

  const [searchResults, setSearchResults] = useState([
  // { KEYWORD: 'Campaign Manager', TRAFFIC: '3300', COMPETITION: 'LOW', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Political Consultant', TRAFFIC: '2800', COMPETITION: 'MEDIUM', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Fundraising Coordinator', TRAFFIC: '22100', COMPETITION: 'HIGH', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Public Relations Specialist', TRAFFIC: '1600', COMPETITION: 'LOW', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Policy Analyst', TRAFFIC: '18300', COMPETITION: 'HIGH', PREVDATA: [-1, -1, -1, -1] },
  ]);

  const updateDays = 14;
  const competitionLevels = { LOW: 'Low Competition', MEDIUM: 'Avg Competition', HIGH: 'High Competition' };
  const [isClicked, setIsClicked] = useState([]);

  const handleOpen = () => {setIsDialogOpen(true);};
  const handleClose = () => {setIsDialogOpen(false);};

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
        "WEEKLY_KEYWORDS.LAST_DATE": formattedDate,
        "WEEKLY_KEYWORDS.SEARCH_COUNT": 0,
      });

    }).catch(error => console.error('Error:', error));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
        
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            const lastDateParts = firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            await setPlanName(firmDoc.data().SETTINGS.PLAN);
            await setSearchLimit(firmDoc.data().WEEKLY_KEYWORDS.LIMIT || 15)
            await setSearchesMade(firmDoc.data().WEEKLY_KEYWORDS.SEARCH_COUNT || 0)

            if (typeof firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS === 'string') { writeWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS); console.log('WRITING KEYWORDS 0');}
            else {await setWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS || []); console.log('NOT A STRING');} 
            
            if (firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE === "") {return;}
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

  getFirmData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdateTime) {setWeeklyKeywords([]); return;}; 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewPost, genPostPlatform]);
  
  
  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    if (genPostPlatform) {setGenPostPlatform(null)} 
    else {setGenPostPlatform("LinkedIn")};
  }

  const trackNewKeyword = async (newKeyword, newData=[-1, -1, -1, -1]) => {
    setWeeklyKeywords([{ keyword: newKeyword, data: newData }, ...weeklyKeywords]); setKeywordToAdd('');
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {
      const firmData = firmDoc.data();
      await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.KEYWORDS': [{ keyword: newKeyword, data: [0, 0, 0, 0] }, ...weeklyKeywords] });
    } 
  }

  const searchNewKeyword = async (keyword) => {

    setIsSearching(true); setSearchResults([]); await setSearchesMade(searchesMade + 1);
    const url = "https://api.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live";
    const payload = JSON.stringify([{
        date_from: "2023-12-24",
        search_partners: true,
        keywords: [keyword],
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
        KEYWORD: item.keyword,
        TRAFFIC: item.monthly_searches && item.monthly_searches[0].search_volume,
        PREVDATA: item.monthly_searches ? item.monthly_searches.map(search => search.search_volume).slice(0, 4) : [-1, -1, -1, -1],
        COMPETITION: item.competition,
      }));
    setSearchResults(formattedData);
    console.log(formattedData);

    }).catch(error => console.error('Error:', error));
    setIsSearching(false);

    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {
      const firmData = firmDoc.data();
      await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.SEARCH_COUNT': searchesMade });
      if (!firmData.WEEKLY_KEYWORDS.LIMIT) {await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.LIMIT': searchLimit });}
    } 

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
        🧱 Tracking Now...
      </Typography>
      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, position: 'absolute', 
      top: '407.5px', left: 'calc(50% + 185px)', transform: 'translateX(-50%)', letterSpacing: '-0.05px',  fontWeight: 500, fontSize: '25.75px'}}> 
        {`Return in ~5 minutes and they'll be ready!`}
      </Typography> </>}

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>

        <PageTitle title={isSearchMode ? 'Search New Keywords' : 'Keywords Being Tracked'} />
        
        <Stack direction="row" spacing={2} mb={2}>

        {/* {planName === 'Trial Plan' && <Button variant="contained" onClick={() => {handleOpen()}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="teenyicons:tick-circle-solid" sx={{height: '16px', width: '16px', 
        color: 'white', marginRight: '8px'}}/>
        Activate Keywords
      </Button>} */}

       {!isSearchMode && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Update In Progress'}
        </Button>
        </>)}

        {isSearchMode && (searchLimit - searchesMade <= 5) && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          {`${searchLimit - searchesMade} More Searches`}
        </Button>
        </>)}

        {!isSearchMode && <Button variant="contained" color="inherit" startIcon={<Iconify icon={isAddNewMode ? "charm:cross" : "eva:plus-fill"} />} onClick={() => {setIsAddNewMode(!isAddNewMode)}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isAddNewMode ? 'Add New' : 'Add New'}
        </Button>}

        {!isNewPost && <Button variant="contained" color="inherit" startIcon={<Iconify icon={isSearchMode ? "charm:cross" : "bx:search"} />} 
        onClick={() => {setIsSearchMode(!isSearchMode)}} sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isSearchMode ? `Search New` : `Search New`}
        </Button>}

      </Stack></Stack>

      {isAddNewMode && !isSearchMode && (<>
        <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" mt={0} mb={3}>
        
        <TextField value={keywordToAdd} size="large"
        onChange={(e) => setKeywordToAdd(e.target.value)}
        placeholder='New Keyword' sx={{width: '100%', mt: 0, }} /> 

        <Button onClick={() => {trackNewKeyword(keywordToAdd)}}
        variant="contained" color="inherit" 
        sx={{height: '55px', width: '215px', cursor: 'pointer'}}>
          <Iconify icon="eva:plus-fill" sx={{mr: '10px'}}/>
          Track Keyword 
        </Button>

        </Stack>
       </>)}

       {isSearchMode && (<>
        <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" mt={0} mb={3}>
        
        <TextField value={keywordToSearch} size="large"
        onChange={(e) => setKeywordToSearch(e.target.value)}
        placeholder='Enter A Keyword' sx={{width: '100%', mt: 0, }} /> 

        <Button onClick={() => {if (searchLimit - searchesMade > 0) {searchNewKeyword(keywordToSearch)}}}
        variant="contained" color="inherit" 
        sx={{fontSize: "15.5px", letterSpacing: '-0px', height: '55px', width: '155px', cursor: 'pointer'}}>
          Search
          {/* <Iconify icon="bx:search" sx={{fontSize: "10px", m: '5px'}}/> */}
        </Button>

        </Stack>
       </>)}


      {!isSearchMode && <Grid container spacing={3} sx={{width: '100%'}}>
        {weeklyKeywords.map(({ keyword, data }, index) => (
          <PostCard key={index} data={data} keyword={keyword} index={index} setWeeklyKeywords={setWeeklyKeywords} />
        ))}
      </Grid>}

      {isSearchMode && searchResults.length !== 0 && <List sx={{backgroundColor: 'white', borderRadius: '8px', p: '0px', border: '0.1px solid #c2c1c0',}}>
      
      {searchResults.filter(job => job.TRAFFIC !== 0).map((job, index) => (        
        <ListItem key={index} sx={{ borderBottom: index !== searchResults.length - 1 ? '0.1px solid #c2c1c0' : 'none', 
          justifyContent: 'space-between'}}>    

          <ListItemText primary={job.KEYWORD} sx={{fontWeight: '900', height: '38px', display: 'flex', alignItems: 'center',}}/>
          
          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: '80px', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '12px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.TRAFFIC}</Button>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: '150px', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '12px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {competitionLevels[job.COMPETITION]}          
          </Button>

          <Iconify icon={isClicked.includes(index) ? "mdi:tick" : "eva:plus-fill"} sx={({height: '31.5px', width: '45px', p: '5.75px', cursor: isClicked.includes(index) ? 'default' : 'pointer',
          backgroundColor: 'darkred', marginLeft: '12px', '&:hover': { backgroundColor: 'darkred', }, color: 'white',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {if (!isClicked.includes(index)) {trackNewKeyword(job.KEYWORD, job.PREVDATA); setIsClicked([...isClicked, index])}}}/>
          
        </ListItem>))}
        </List>}

      {isSearchMode && searchResults.length === 0 && <Card sx={{backgroundColor: 'white', height: '575px', width: '100%', 
      borderRadius: '8px', border: '0.1px solid #c2c1c0', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
        <Stack direction="column" spacing={1.5} alignItems="center">
        <Typography sx={{ fontFamily: "DM Serif Display",
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px',}}> 
        {isSearching ? `Searching...` : `Results Appear Here`} </Typography>
        {!isSearching && <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '42.5px',
        letterSpacing: '0.25px', fontWeight: 500, fontSize: '24.75px', textAlign: 'center'}}> 
        When you enter a keyword, you&apos;ll see its search <br /> 
        volume along with similar keywords appear here.
        </Typography>}
        </Stack>
      </Card>}

      <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px', padding: '55px' }}>
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
        </Button></Card>
      </Dialog>

    </Container>
  );
}
