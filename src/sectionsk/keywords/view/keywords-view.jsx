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
import Creating from 'src/components/Creating';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import ComingSoon from 'src/components/ComingSoon';
import PostCard from '../keyword-card';
import StrategyItem from './strategy-item';


// ----------------------------------------------------------------------

export default function BlogView() {

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
  const [selectedList, setSelectedList] = useState('Tracked');
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([
  // { KEYWORD: 'Campaign Manager', TRAFFIC: '3300', COMPETITION: 'LOW', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Political Consultant', TRAFFIC: '2800', COMPETITION: 'MEDIUM', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Fundraising Coordinator', TRAFFIC: '22100', COMPETITION: 'HIGH', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Public Relations Specialist', TRAFFIC: '1600', COMPETITION: 'LOW', PREVDATA: [-1, -1, -1, -1] },
  // { KEYWORD: 'Policy Analyst', TRAFFIC: '18300', COMPETITION: 'HIGH', PREVDATA: [-1, -1, -1, -1] },
  ]);

  const [strategyData, setStrategyData] = useState({
    STRATEGY: {
      TOPICS: [
        { title: 'Public Relations Specialist', keywords: ['Public Relations Specialist', 'Public Relations Manager', 'Public Relations Coordinator', 'Public Relations Director', 'Public Relations Consultant'] },
        { title: 'Policy Analyst', keywords: ['Policy Analyst', 'Policy Researcher', 'Policy Coordinator', 'Policy Director', 'Policy Consultant'] },
        { title: 'Fundraising Coordinator', keywords: ['Fundraising Coordinator', 'Fundraising Manager', 'Fundraising Director', 'Fundraising Consultant'] },
        { title: 'Campaign Manager', keywords: ['Campaign Manager', 'Campaign Coordinator', 'Campaign Director', 'Campaign Consultant'] },
      ]
    },
    TRENDING: [
        { keyword: 'Public Relations Specialist', data: [600, 1400, 1600, 1900] },
        { keyword: 'Policy Analyst', data: [1200, 1700, 1900, 2200] },
        { keyword: 'Fundraising Coordinator', data: [2000, 2200, 2400, 3500] },
        { keyword: 'Campaign Manager', data: [500, 2700, 2900, 3200] },
        { keyword: 'Political Consultant', data: [3500, 3200, 3400, 3700] },
        { keyword: 'Public Relations Specialist', data: [200, 1400, 1600, 1900] },
    ]
  });

  const [openedTopic, setOpenedTopic] = useState(null);

  const updateDays = 14;
  const competitionLevels = { LOW: 'Low Competition', MEDIUM: 'Avg Competition', HIGH: 'High Competition' };
  const [isClicked, setIsClicked] = useState([]);


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
  

  const trackNewKeyword = async (newKeyword, newData=[-1, -1, -1, -1]) => {
    setWeeklyKeywords([{ keyword: newKeyword, data: newData }, ...weeklyKeywords]); 
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {
      const firmData = firmDoc.data();
      await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.KEYWORDS': [{ keyword: newKeyword, data: newData }, ...weeklyKeywords] });
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

  const buttonLabels = ['Strategy', 'Tracked',];
  const icons = ['material-symbols-light:chess', 'clarity:bullseye-line'];

  return (
    <Container>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={isSearchMode ? 0.25 : 1.25}>

        <PageTitle title={isSearchMode ? 'Search New Keywords' : (selectedList === 'Strategy' ? 'Firm Content Strategy' : 'Tracking Keywords')} />
        
        <Stack direction="row" spacing={2} mb={2.25}>


       {!isSearchMode && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          {!isUpdateTime ? (selectedList === 'Strategy' ? `Strategy Curated This Week` : `Updated This Week`) : 'Update In Progress'}
        </Button>
        </>)}

        {isSearchMode && (searchLimit - searchesMade <= 5) && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          {`${searchLimit - searchesMade} More Searches`}
        </Button>
        </>)}

        {!isNewPost && selectedList==='Tracked' && <Button variant="contained" color="inherit" startIcon={<Iconify icon={isSearchMode ? "charm:cross" : "bx:search"} />} 
        onClick={() => {setIsSearchMode(!isSearchMode)}} sx={(theme) => ({backgroundColor: theme.palette.primary.black})}>
          {isSearchMode ? `Find New` : `Find New`}
        </Button>}

        <Stack direction="row" spacing={2} mb={2}>
          <div style={{ 
            display: 'flex', borderRadius: 7, 
            width: 246, height: 37.5, 
            borderWidth: 0.5, borderStyle: 'solid' 
          }}>
            {buttonLabels.map((label, index) => (
              <Button
                key={label}
                startIcon={<Iconify icon={icons[index]} height="16.5px" width="16.5px" marginRight="-1.75px" />}
                style={{
                  width: 123, color: selectedList === label ? 'white' : '#242122',
                  backgroundColor: selectedList === label ? '#242122' : 'transparent',
                  fontWeight: 700, transition: 'all 0.25s ease-out', borderRadius: 0,
                  borderTopLeftRadius: index === 0 ? 6 : 0, borderBottomLeftRadius: index === 0 ? 6 : 0,
                  borderTopRightRadius: index === buttonLabels.length - 1 ? 6 : 0, borderBottomRightRadius: index === buttonLabels.length - 1 ? 6 : 0,
                  border: '0px solid #242122', borderRightWidth: index === buttonLabels.length - 1 ? 0 : 0.5,
                  cursor: 'pointer', fontSize: 15, letterSpacing: '-0.25px',
                }}
                onClick={() => setSelectedList(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Stack>

      </Stack></Stack>

      {isUpdateTime && <Creating text='Updating All SEO Data' imgUrl='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-10-23_202020994.png?alt=media&token=799383a7-7d68-4c2d-8af2-835616badb7b' />}

      {isSearchMode && (<>
      <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" mt={0} mb={3}>
      
      <TextField value={keywordToSearch} size="large"
      onChange={(e) => setKeywordToSearch(e.target.value)}
      placeholder='Enter A Keyword' sx={{width: '100%', mt: 0, }} /> 

      <Button onClick={() => {if (searchLimit - searchesMade > 0) {searchNewKeyword(keywordToSearch)}}}
      variant="contained" color="inherit" 
      sx={{fontSize: "15.5px", letterSpacing: '-0px', height: '55px', width: '155px', cursor: 'pointer'}}>
        Search {/* <Iconify icon="bx:search" sx={{fontSize: "10px", m: '5px'}}/> */}
      </Button>

      </Stack>
      </>)}


      {!isSearchMode && selectedList === 'Strategy' && 
      <Card sx={{backgroundColor: 'white', height: isStrategyOpen ? '500px' : '297.5px', width: '97.5%', p: '25px',
      borderRadius: '3.5px', marginBottom: '35px', border: '1.5px solid #e8e8e8' }}>
        
      <Stack direction="column" spacing={0} alignItems="left" justifyContent="center">
      
        <Stack direction="row" sx={{marginBottom: '20px'}} spacing={2} alignItems="start" justifyContent="space-between">

        <Typography sx={{ fontFamily: "Times New Roman", marginBottom: '15px',
          letterSpacing: '-0.45px',  fontWeight: 500, fontSize: '24.75px',}}>
          This Week&apos;s Content Plan
        </Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="fluent:settings-16-filled" />} 
        onClick={() => {}} sx={(theme) => ({backgroundColor: theme.palette.primary.black, height: 35})}>
          Long-Term Strategy
        </Button>

        </Stack>
      
        <Grid container spacing={2} sx={{marginBottom: 1.1}}>
          {strategyData.STRATEGY.TOPICS.map((topic, index) => (
            <Grid item xs={12} sm={6} key={index} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
              <StrategyItem 
                title={topic.title} 
                keywords={topic.keywords} 
                index={index} 
                openedTopic={openedTopic} 
                setOpenedTopic={setOpenedTopic} 
              />
            </Grid>
          ))}
        </Grid>
      
        {/* <Typography sx={{ fontFamily: "Times New", 
          letterSpacing: '-0.45px',  fontWeight: 200, fontSize: '24.75px',}}>
          Currently Ranking For 
        </Typography> */}

        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        width: 190, '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          Currently Ranking For
        </Button>
      
      </Stack>
        
      </Card>}


      {!isSearchMode && selectedList === 'Strategy' && <Grid container spacing={3} sx={{width: '100%'}}>
          {strategyData.TRENDING.map(({ keyword, data }, index) => {
            const isTrendingTracked = weeklyKeywords.some(weeklyKeyword => weeklyKeyword.keyword === keyword);
            return (
              <PostCard key={index} data={data} keyword={keyword} index={index} setWeeklyKeywords={setWeeklyKeywords} trackNewKeyword={trackNewKeyword} isTrending isTrendingTracked={isTrendingTracked} />
            );
          })}
      </Grid>}

      {!isSearchMode && selectedList === 'Tracked' && <Grid container spacing={3} sx={{width: '100%'}}>
        {weeklyKeywords.map(({ keyword, data }, index) => (
          <PostCard key={index} data={data} keyword={keyword} index={index} setWeeklyKeywords={setWeeklyKeywords} trackNewKeyword={trackNewKeyword} />
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

    </Container>
  );
}
