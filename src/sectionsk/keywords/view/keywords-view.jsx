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
import BasicTooltip from 'src/components/BasicTooltip';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect, useCallback } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';

import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import ComingSoon from 'src/components/ComingSoon';
import PostCard from '../keyword-card';
import StrategyItem from './strategy-item';
import LongTermItem from './long-term-item';

// eslint-disable-next-line import/no-relative-packages
import createWeeklyStrat from '../../../../functions/src/Weekly/createWeeklyStrat';


// ----------------------------------------------------------------------

export default function BlogView() {

  const [keywordToSearch, setKeywordToSearch] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchesMade, setSearchesMade] = useState(0);
  const [searchLimit, setSearchLimit] = useState(5);

  const [isNewPost, setIsNewPost] = useState(false);
  const [genPostPlatform, setGenPostPlatform] = useState(null);

  const [isKeyWordUpdateTime, setIsKeywordUpdateTime] = useState(false);
  const [isStrategyUpdateTime, setIsStrategyUpdateTime] = useState(false);
  const [planName, setPlanName] = useState('');
  
  const [weeklyKeywords, setWeeklyKeywords] = useState([]);
  const [firmName, setFirmName] = useState(null);
  const [firmDescription, setFirmDescription] = useState(null);
  const [selectedList, setSelectedList] = useState('Strategy');
  const [isStrategyOpen, setIsStrategyOpen] = useState(false);

  const [searchResults, setSearchResults] = useState([
  // { KEYWORD: 'Campaign Manager', TRAFFIC: '3300', COMPETITION: 'LOW', PREVDATA: [-1, -1, -1, -1] },
  ]);

  const [isLongTermOpen, setIsLongTermOpen] = useState(false);
  const [longTermKeywords, setLongTermKeywords] = useState([]);
  const [expandedButtons, setExpandedButtons] = useState({});

  const [strategyData, setStrategyData] = useState({
    STRATEGY: {
      TOPICS: [
        { title: 'Public Relationship Specialist', 
          keywords: [
          {keyword: 'PR Specialist in Texas', data: [600, 1400, 1600, 1900], competition: 'LOW'},
          {keyword: 'PR Specialist in California', data: [1200, 1700, 1900, 2200], competition: 'MEDIUM'},
          {keyword: 'NYC PR Specialists', data: [2000, 2200, 2400, 3500], competition: 'HIGH'},
          {keyword: 'PR Specialist in Chicago', data: [500, 2700, 2900, 3200], competition: 'LOW'},
          {keyword: 'PR Specialist in Houston', data: [3500, 3200, 3400, 3700], competition: 'HIGH'},
          {keyword: 'PR Specialist in San Francisco', data: [200, 1400, 1600, 1900], competition: 'LOW'},
        ],
          news: [],
          reasons: [
            {reason: 'High demand for PR Specialists in NYC'}, 
            {reason: 'Low competition for PR Specialists in Texas'},
            {reason: 'Medium competition for PR Specialists in California'},
            {reason: 'High competition for PR Specialists in Houston'},
          ],
      },
        { title: 'Policy Analyst', keywords: [
          {keyword: 'Policy Analyst in TX', data: [600, 1400, 1600, 1900], competition: 'LOW'},
          {keyword: 'Policy Analyst in CA', data: [1200, 1700, 1900, 2200], competition: 'MEDIUM'},
          {keyword: 'NYC Policy Analyst', data: [2000, 2200, 2400, 3500], competition: 'HIGH'},
          {keyword: 'Policy Analyst in Chicago', data: [500, 2700, 2900, 3200], competition: 'LOW'},
          {keyword: 'Policy Analyst in Houston', data: [3500, 3200, 3400, 3700], competition: 'HIGH'},
          {keyword: 'Policy Analyst in San Francisco', data: [200, 1400, 1600, 1900], competition: 'LOW'},
        ],
        news: [],
        reasons: [
          {reason: 'High demand for PR Specialists in NYC'}, 
          {reason: 'Low competition for PR Specialists in Texas'},
          {reason: 'Medium competition for PR Specialists in California'},
          {reason: 'High competition for PR Specialists in Houston'},
        ],
      },
        { title: 'Fundraising Coordinator', keywords: [
          {keyword: 'Fundraising Coordinator in TX', data: [600, 1400, 1600, 1900], competition: 'LOW'},
          {keyword: 'Fundraising Coordinator in CA', data: [1200, 1700, 1900, 2200], competition: 'MEDIUM'},
          {keyword: 'NYC Fundraising Coordinator', data: [2000, 2200, 2400, 3500], competition: 'HIGH'},
          {keyword: 'Fundraising Coordinator in Chicago', data: [500, 2700, 2900, 3200], competition: 'LOW'},
          {keyword: 'Fundraising Coordinator in Houston', data: [3500, 3200, 3400, 3700], competition: 'HIGH'},
          {keyword: 'Fundraising Coordinator in San Francisco', data: [200, 1400, 1600, 1900], competition: 'LOW'},
         ],
         news: [],
         reasons: [
           {reason: 'High demand for PR Specialists in NYC'}, 
           {reason: 'Low competition for PR Specialists in Texas'},
           {reason: 'Medium competition for PR Specialists in California'},
           {reason: 'High competition for PR Specialists in Houston'},
         ],
        },
         { title: 'Campaign Manager', keywords: [
          {keyword: 'Campaign Manager in TX', data: [600, 1400, 1600, 1900], competition: 'LOW'},
          {keyword: 'Campaign Manager in CA', data: [1200, 1700, 1900, 2200], competition: 'MEDIUM'},
          {keyword: 'NYC Campaign Manager', data: [2000, 2200, 2400, 3500], competition: 'HIGH'},
          {keyword: 'Campaign Manager in Chicago', data: [500, 2700, 2900, 3200], competition: 'LOW'},
          {keyword: 'Campaign Manager in Houston', data: [3500, 3200, 3400, 3700], competition: 'HIGH'},
          {keyword: 'Campaign Manager in San Francisco', data: [200, 1400, 1600, 1900], competition: 'LOW'},
         ],
         news: [
          {title: 'Baylor University Shuts Down', url: 'https://www.baylor.edu/'},
          {title: 'Texas A&M Wins Big', url: 'https://www.tamu.edu/'},
         ],
         reasons: [
           {reason: 'High demand for PR Specialists in NYC'}, 
           {reason: 'Low competition for PR Specialists in Texas'},
           {reason: 'Medium competition for PR Specialists in California'},
           {reason: 'High competition for PR Specialists in Houston'},
         ],
        },
      ],
      RANKING_FOR:[
        { keyword: 'Public Relations Specialist', data: [600, 1400, 1600, 1900] },
        { keyword: 'Policy Analyst', data: [1200, 1700, 1900, 2200] },
        { keyword: 'Fundraising Coordinator', data: [2000, 2200, 2400, 3500] },
        { keyword: 'Campaign Manager', data: [500, 2700, 2900, 3200] },
        { keyword: 'Political Consultant', data: [3500, 3200, 3400, 3700] },
        { keyword: 'Public Relations Specialist', data: [200, 1400, 1600, 1900] },
      ],
      LONG_TERM: [
        { showup_for: 'Campaign Manager in Houston TX' },
        { showup_for: 'Political Consultant in San Francisco CA' },
        { showup_for: 'Fundraising Coordinator in New York NY' },
        { showup_for: 'Public Relations Specialist in Chicago IL' },
      ]
    },
    TRENDING: [
        { keyword: 'Public Relations Specialist', data: [600, 1400, 1600, 1900] },
        { keyword: 'Policy Analyst', data: [1200, 1700, 1900, 2200] },
        { keyword: 'Fundraising Coordinator', data: [2000, 2200, 2400, 3500] },
        { keyword: 'Campaign Manager', data: [500, 2700, 2900, 3200] },
        { keyword: 'Political Consultant', data: [3500, 3200, 3400, 3700] },
        { keyword: 'Public Relations Specialist', data: [200, 1400, 1600, 1900] },
    ], 
    LAST_DATE: '10/25/24',
  });

  const [openedTopic, setOpenedTopic] = useState(null);

  const updateDays = 14;
  const competitionLevels = { LOW: 'Low Competition', MEDIUM: 'Avg Competition', HIGH: 'High Competition' };
  const [isClicked, setIsClicked] = useState([]);

  useEffect(() => {
    if (openedTopic !== null) {setIsStrategyOpen(true);} else {setIsStrategyOpen(false);}
  }, [openedTopic]);

  useEffect(() => {
    setLongTermKeywords(strategyData.STRATEGY.LONG_TERM);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const getWeeklyStratCreationType = () => {
      const isBrandNew = !strategyData.LONG_TERM || strategyData.LONG_TERM.length === 0 || !strategyData.LAST_DATE;
      if (isBrandNew) return 'Brand New';
  
      const isMonthlyRefreshTime = (() => {
        const lastDate = new Date(strategyData.LAST_DATE);
        const currentDate = new Date();
        return lastDate.getMonth() === (currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1) && lastDate.getFullYear() === (currentDate.getMonth() === 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear());
      })();
      if (isMonthlyRefreshTime) return 'Monthly';
  
      const getWeekOfMonth = date => Math.ceil((date.getDate() + new Date(date.getFullYear(), date.getMonth(), 1).getDay() - 1) / 7);
  
      const isWeeklyRefreshTime = (() => {
        const lastDate = new Date(strategyData.LAST_DATE);
        return getWeekOfMonth(lastDate) !== getWeekOfMonth(new Date());
      })();
      if (isWeeklyRefreshTime) return 'Weekly';
  
      return 'No Update';
    };
  
    const fetchData = async () => {
      const updateStatus = await getWeeklyStratCreationType();
      if (updateStatus !== 'No Update') {
        createWeeklyStrat(firmName, updateStatus);
      }
    };
  
    fetchData();
  }, [strategyData, firmName]);

  const itemIndexList = {1: 'First Week', 2: 'Second Week', 3: 'Third Week', 4: 'Fourth Week',};

  const getCurrentWeekOfMonth = () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    if (dayOfMonth <= 7) {return 1;
    } else if (dayOfMonth <= 14) {return 2;
    } else if (dayOfMonth <= 21) {return 3;
    } else {return 4;}
  };
  
  const currentWeek = getCurrentWeekOfMonth();
  const isCurrentWeek = currentWeek === openedTopic + 1;
  const weekName = isCurrentWeek ? 'This Week' : itemIndexList[openedTopic+1];
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  const saveLongTermGoals = async () => {
    if (!isLongTermOpen) {setIsLongTermOpen(true); return;}
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
      if (firmDoc.exists()) {await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'STRATEGY.STRATEGY.LONG_TERM': longTermKeywords });}
      else {console.log('ERR: Firm document not found.');}
      setIsLongTermOpen(false);
  }


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
    async function getFirmData() {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            const lastDateParts = firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            await setPlanName(firmDoc.data().SETTINGS.PLAN);
            await setSearchLimit(firmDoc.data().WEEKLY_KEYWORDS.LIMIT || 15);
            await setSearchesMade(firmDoc.data().WEEKLY_KEYWORDS.SEARCH_COUNT || 0);
            
            if (firmDoc.data().STRATEGY?.STRATEGY?.TOPICS) {
              await setStrategyData(firmDoc.data().STRATEGY || {});
            }
            
            if (typeof firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS === 'string') {
              writeWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS);
              console.log('WRITING KEYWORDS 0');
            } else {
              await setWeeklyKeywords(firmDoc.data().WEEKLY_KEYWORDS.KEYWORDS || []);
            }
  
            if (firmDoc.data().WEEKLY_KEYWORDS.LAST_DATE === "") {
              return;
            }
            if (diffDays >= 1) {
            } else {
              setIsKeywordUpdateTime(true);
              writeWeeklyKeywords();
              console.log('WRITING KEYWORDS');
              setWeeklyKeywords([]);
              await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.LAST_DATE': "" });
            }
  
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
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    getFirmData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (isKeyWordUpdateTime) {setWeeklyKeywords([]); return;}; 
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
  const icons = [
    // 'material-symbols-light:chess', 
    // 'streamline:artificial-intelligence-spark-solid',
    'fa-solid:chess-king',
    'clarity:bullseye-line'];

  return (
    <Container>
      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={isSearchMode ? 0.25 : 0.5}>

        <PageTitle title={isSearchMode ? 'Search New Keywords' : (selectedList === 'Strategy' ? 'Firm Content Strategy' : 'Tracking Keywords')} />
        
        <Stack direction="row" spacing={2} mb={2.25}>


       {!isSearchMode && (<>
        <Button variant="contained" onClick={() => {}}
        sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600',
        '&:hover': {backgroundColor: theme.palette.primary.navBg,}})}>
          {!isKeyWordUpdateTime ? (selectedList === 'Strategy' ? `Strategy Updated This Week` : `Updated This Week`) : 'Update In Progress'}
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
                startIcon={<Iconify icon={icons[index]} 
                sx={{ height: label === 'Strategy' ? 13.25 : 16.5, width: label === 'Strategy' ? 13.25 : 16.5, }} marginRight="-1.75px" />}
                style={{
                  width: 123, color: selectedList === label ? 'white' : '#242122',
                  backgroundColor: selectedList === label ? '#242122' : 'transparent',
                  fontWeight: 700, transition: 'all 0.25s ease-out', borderRadius: 0,
                  borderTopLeftRadius: index === 0 ? 6 : 0, borderBottomLeftRadius: index === 0 ? 6 : 0,
                  borderTopRightRadius: index === buttonLabels.length - 1 ? 6 : 0, borderBottomRightRadius: index === buttonLabels.length - 1 ? 6 : 0,
                  border: '0px solid #242122', borderRightWidth: index === buttonLabels.length - 1 ? 0 : 0.5,
                  cursor: 'pointer', fontSize: 15, letterSpacing: '-0.25px',
                }}
                onClick={() => {setSelectedList(label); if (label === 'Strategy') {setIsSearchMode(false);}}}
              >
                {label}
              </Button>
            ))}
          </div>
        </Stack>

      </Stack></Stack>

      {isKeyWordUpdateTime && <Creating text='Updating All SEO Data' imgUrl='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-10-23_202020994.png?alt=media&token=799383a7-7d68-4c2d-8af2-835616badb7b' />}
      {isStrategyUpdateTime && <Creating text='Updating Strategy Data' imgUrl='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-10-23_202020994.png?alt=media&token=799383a7-7d68-4c2d-8af2-835616badb7b' />}

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
      <Card sx={{backgroundColor: 'white', height: isLongTermOpen ? '240px' : (isStrategyOpen ? '477px' : '345.5px'), width: '97.5%', p: '25px',
      borderRadius: '5.5px', marginBottom: '25px', border: '2.25px solid #f0f0f0', transition: '0.35s ease' }}>
        
      <Stack direction="column" spacing={0} alignItems="left" justifyContent="center">
      
        <Stack direction="row" sx={{marginBottom: openedTopic !== null ? '16.5px' : '18px'}} spacing={2} alignItems="start" justifyContent="space-between">

        {/* <Iconify icon="fa-solid:chess-king" height={21} width={21} sx={{ ml: 8.5, position: 'absolute', top: 30, color: 'black', cursor: 'pointer' }} /> */}

        <Typography sx={{ fontFamily: "Times New Roman", marginBottom: '15px',
          letterSpacing: '-0.95px',  fontWeight: 500, fontSize: '24.25px', userSelect: 'none'}}>
          {isLongTermOpen ? `Long Term, I Want To Rank Highest For` 
          :
          <span style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            {openedTopic !== null ? `${weekName}'s Content Topics` : `${currentMonthName}'s Weekly Content Plan`}
            <BasicTooltip title="Draws from market, long-term goals, & news">
            <Iconify icon="mdi:sword-fight" height={24} width={24} sx={{ ml: 8.5, position: 'absolute', top: 30, color: 'gray', cursor: 'pointer' }} />
            <Iconify icon="arcticons:emoji-web" height={23} width={23} sx={{ ml: 1, position: 'absolute', top: 31, color: 'gray', cursor: 'pointer' }} />
            <Iconify icon="arcticons:my-brain" height={23} width={23} sx={{ ml: 4.70, position: 'absolute', top: 31, color: 'gray', cursor: 'pointer' }} />
            </BasicTooltip>
          </span>}
        </Typography>


        <Button variant="contained" onClick={() => {}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.blue, cursor: 'default', 
          fontWeight: '600', '&:hover': { backgroundColor: theme.palette.primary.blue,},
          position: 'absolute', top: 24, right: 25, maxHeight: 35})}>
            Beta
        </Button>

        {!isStrategyOpen && <Button variant="contained" color="inherit" startIcon={<Iconify icon={isLongTermOpen ? "lets-icons:save-fill" : "fluent:settings-16-filled"}/>} 
        onClick={() => {saveLongTermGoals()}} sx={(theme) => ({backgroundColor: theme.palette.primary.black, 
        height: 35, position: 'absolute', top: 24, right: 104})}>
          {isLongTermOpen ? `Save AI Settings` : `Long-Term Strategy`}
        </Button>}

        {isStrategyOpen && <Button variant="contained" color="inherit" startIcon={<Iconify icon="ion:caret-back" />} 
        onClick={() => {setIsStrategyOpen(false); setOpenedTopic(null)}} sx={(theme) => ({backgroundColor: theme.palette.primary.black, 
        height: 35, position: 'absolute', top: 22.5, right: 25})}>
          Back To Monthly Plan
        </Button>}

        </Stack>
      
        {!isLongTermOpen && <>
          <Grid container columnSpacing={2.5} rowSpacing={1.55} sx={{marginBottom: 1.3}} >
            {strategyData.STRATEGY.TOPICS.map((topic, index) => (
              <Grid item xs={12} sm={openedTopic === null ? 6 : 12} key={index} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
                <StrategyItem 
                  title={topic.title} 
                  keywords={topic.keywords} 
                  index={index} 
                  openedTopic={openedTopic} 
                  setOpenedTopic={setOpenedTopic} 
                  reasons={topic.reasons}
                  news={topic.news}
                />
              </Grid>
          ))}
        </Grid>
  
        <Stack direction="row" spacing={2} alignItems="center">


        <Stack spacing={2}>


          {!isStrategyOpen && <div direction="row" spacing={2} className="flex flex-wrap gap-2">
            <Button variant="contained" onClick={() => {}}
              sx={(theme) => ({
                backgroundColor: theme.palette.primary.navBg, height: 35,
                cursor: 'default', fontWeight: '600', boxShadow: 'none', marginRight: '14px',
                borderRadius: '7px', width: 182, '&:hover': { backgroundColor: theme.palette.primary.navBg },
                marginBottom: '15px'
              })}
            >
              Currently Ranking For
            </Button>
            
            {strategyData.STRATEGY.RANKING_FOR.slice(0, 7).map((item, index) => (
               <Button 
                variant="contained" 
                key={`${index}`}
                sx={(theme) => ({
                  backgroundColor: theme.palette.primary.lighter,
                  cursor: 'pointer',
                  fontWeight: '600',
                  color: theme.palette.primary.navBg,
                  boxShadow: 'none',
                  borderRadius: '7px',
                  marginRight: '14px',
                  transition: 'all 0.7s ease',
                  width: 'auto',
                  '& .additional-content': {
                    opacity: 0,
                    width: 0,
                    overflow: 'hidden',
                    transition: 'all 0.7s ease',
                    display: 'inline-block',
                  },
                  '&:hover': { 
                    backgroundColor: theme.palette.primary.lighter,
                    boxShadow: 'none',
                    width: 'auto',
                    '& .additional-content': {
                      opacity: 1,
                      width: 'auto',
                      marginLeft: '5px',
                    }
                  },
                  marginBottom: '15px'
                })}
              >
                {item.KEYWORD}
                <span className="additional-content" style={{ fontWeight: 'bold' }}>
                  {item?.MONTHLY_SEARCHES ? item?.MONTHLY_SEARCHES[0]?.search_volume : 'N/A'}/mo
                </span>
              </Button>
            ))}
        </div>}

        </Stack>

        </Stack> </>}

        {isLongTermOpen && <Grid container columnSpacing={3} rowSpacing={1.75} sx={{marginBottom: 1.3}} >
          {strategyData.STRATEGY.TOPICS.map((topic, index) => (
            <Grid item xs={12} sm={openedTopic === null ? 6 : 12} key={index} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
              <LongTermItem 
                index={index} 
                isLongTermOpen={isLongTermOpen}
                longTermKeywords={longTermKeywords}
                setLongTermKeywords={setLongTermKeywords}
              />
            </Grid>
          ))}
        </Grid>}
      
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
      borderRadius: '5.5px', border: '0.8px solid gray', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
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
