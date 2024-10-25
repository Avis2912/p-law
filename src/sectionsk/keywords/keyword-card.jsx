import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { Editor, EditorState } from 'draft-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

import { LineChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Chart from 'react-apexcharts';

import { Snackbar } from '@mui/material';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import shadows from '@mui/material/styles/shadows';
// import { CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';

import zIndex from '@mui/material/styles/zIndex';
import { format, subMonths } from 'date-fns';
import { isEmpty } from 'lodash';


// ----------------------------------------------------------------------

export default function PostCard({ keyword, data, index, setWeeklyKeywords, isTrending=false }) {

  let isNew = false; let isNone = false;
  if (JSON.stringify(data) === JSON.stringify([-1, -1, -1, -1])) {isNew = true;}
  if (JSON.stringify(data) === JSON.stringify([0, 0, 0, 0])) {isNone = true;}
  const currentMonth = new Date();
  const monthlyData = [
    { month: format(subMonths(currentMonth, 3), 'MMMM'), value: data[0] },
    { month: format(subMonths(currentMonth, 2), 'MMMM'), value: data[1] },
    { month: format(subMonths(currentMonth, 1), 'MMMM'), value: data[2] },
    { month: format(currentMonth, 'MMMM'), value: data[3] },
  ];

  const cardColor = isTrending ? '#2c3747' : '#0072b1';
  
  const options = {
    chart: {
      id: 'basic-bar',
      toolbar: { show: false }
    },
    dataLabels: { enabled: false },
    markers: {
      size: 3.5,
      hover: { size: 7 }
    },
    xaxis: {
      categories: monthlyData.map(item => item.month),
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: { show: false }
    },
    yaxis: { labels: { show: false } },
    stroke: { curve: 'smooth', width: 3.25 },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        inverseColors: true,
        opacityFrom: 0.5,
        opacityTo: 0.3,
        stops: [0, 100]
      }
    },
    grid: { show: false },
    legend: { show: false }
  };

  const series = [
    {
      name: 'hits',
      data: monthlyData.map(item => item.value)
    }
  ];

  const deleteKeyword = async () => {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
    const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
    if (firmDoc.exists()) {
      const firmData = firmDoc.data();
      const newKeywords = firmData.WEEKLY_KEYWORDS.KEYWORDS.filter(kw => kw.keyword !== keyword); setWeeklyKeywords(newKeywords);
      await updateDoc(doc(db, 'firms', userDoc.data().FIRM), { 'WEEKLY_KEYWORDS.KEYWORDS': newKeywords });
    }
  }

  const latestPostLarge = index === -10;
  const latestPost = index === -10 || index === -20;
  
  const handleClick = () => {
    // window.location.href = `/campaignpage?id=${campaign.campaign_id}&name=${campaign.campaign_name}`
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 3 : 4}>
      <style>@import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);</style>
          
      {/* <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center',}}
      open={open} autoHideDuration={3000} onClose={handleCloseAlert} 
      message={<span style={{ width: '80px', height: '50px' }}>Copied!</span>}
      style={{ marginTop: '0px', zIndex: 9999999 }} /> */}

      <Card sx = {{ height: 202.5, borderRadius: '5.5px', border: '1.75px solid', borderColor: cardColor }} onClick={() => handleClick()}>
        
      <Stack sx={{width: '100%', zIndex: 1, height: 44.25, backgroundColor: cardColor, 
      justifyContent: "space-between", userSelect: 'none', position: 'absolute'}}>
        <Stack direction="row" spacing={2}>

        {isTrending && <Iconify icon="noto:fire" sx={{left: '10.25px', top: '9.85px', height: '22px', width: '22px', position: 'absolute', color: 'white', opacity: '0.9',}}
          onClick={async () => {}}/>}

        <Typography sx={{color: 'white', p: 1.2, pt: 1.0, pl: 1.75, fontSize: '18px', fontWeight: '800',
        fontFamily: 'sans-serif', display: 'flex', alignItems: 'center',}} >
        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: isTrending ? 9 : 0,
          width: '30ch', display: 'inline-block', fontFamily: 'DM Serif Display', letterSpacing: '0.35px'}}>
          {keyword}
        </span>
        </Typography> 
        </Stack>
        
        {!isTrending && <Iconify icon="uil:trash" sx={{right: '11.5px', top: '9.85px', height: '22px', width: '22px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {deleteKeyword()}}/>}

        {/* <Iconify icon={isCopied ? "mingcute:clipboard-fill" : "mingcute:clipboard-line"} 
          sx={{right: '13px', top: '11.5px', height: '26px', width: '26px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {setIsCopied(true); copyText(content);}}/> */}

      </Stack>

      <Stack sx={{width: '100%', zIndex: 0, height: 42.5, backgroundColor: 'white', borderTop: '0.0px solid grey', borderColor: 'grey',
      justifyContent: "space-between", userSelect: 'none', position: 'absolute', top: '44px'}}>
        <Stack direction="row" spacing={2}>
        <Typography sx={{color: 'grey', p: 1.2, pt: 1.1, pl: 1.75, fontSize: '18px', fontWeight: '1000',
        fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', textAlign: 'left'}} >
        {!isNew && !isNone && <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: '',
          width: '30ch', display: 'inline-block', fontFamily: 'DM Serif Display', letterSpacing: '0.35px'}}>
        {`${data[3] >= 10000 ? `${(data[3] / 1000).toFixed(1)}k` : data[3]} hits`}
        </span>}
        </Typography> 
        </Stack>
        {/* <Iconify icon="mdi:linkedin" sx={{mr: 0.45, mb: 0.15, height: '26px', width: '26px'}}/> */}

      </Stack>

      <Stack sx={{width: '100%', zIndex: 125, height: 17.5, backgroundColor: 'white', bottom: '0px',
      justifyContent: "space-between", userSelect: 'none', position: 'absolute'}} />

      {!isNew &&
      <Chart options={options} series={series} type="area" width={300} height={147} 
      style={{backgroundColor: 'white', marginTop: '50px',}} />}

      {isNew && 
      <Typography sx={{position: 'relative', top: '99.75px', userSelect: 'none', color: 'grey',
      fontSize: '27px', fontFamily: 'DM Serif Display', textAlign: 'center'}}>
        Updating Soon
      </Typography>}

      {isNone && 
      <Typography sx={{position: 'absolute', top: '100.75px', left: '86px', userSelect: 'none', color: 'grey',
      fontSize: '27px', fontFamily: 'DM Serif Display', textAlign: 'center'}}>
        No Searches
      </Typography>}
      
          
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  keyword: PropTypes.any,
  data: PropTypes.object,
  index: PropTypes.number,
  setWeeklyKeywords: PropTypes.func,
  isTrending: PropTypes.bool,
};
