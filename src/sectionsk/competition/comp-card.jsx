import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { CardActionArea, CardMedia } from '@mui/material';
import Chart from 'react-apexcharts';
// import { deleteList } from './view/delete-function'

import { db } from 'src/firebase-config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

import { format, subMonths } from 'date-fns';
import Iconify from 'src/components/iconify';

import NoneFound from './none-found';


export default function PostCard({ competitorName, indexedBlogs, orgData, 
  adData, spendData, jobData, reviewData, traffic, rankingFor, siteLink, isReplacing, index2 }) {

  const latestPostLarge = index2 === -10;
  const latestPost = index2 === -10 || index2 === -20;

  const [selectedOption, setSelectedOption] = useState(1);
  const [isElongated, setIsElongated] = useState(false);

  useEffect(() => {
    if (selectedOption === 2 || selectedOption === 0) {
      setIsElongated(true);
    } else {setIsElongated(false);}
  }, [selectedOption]);

  const currentMonth = new Date();
  const monthlyData = [
    { month: format(subMonths(currentMonth, 3), 'MMMM'), value: traffic[0]?.VISITS || 0 },
    { month: format(subMonths(currentMonth, 2), 'MMMM'), value: traffic[1]?.VISITS || 0 },
    { month: format(subMonths(currentMonth, 1), 'MMMM'), value: traffic[2]?.VISITS || 0 },
    { month: format(currentMonth, 'MMMM'), value: traffic[3]?.VISITS || 0 },
  ];

  const cardColor = '#0072b1';
  
  const options = {
    chart: {
      id: 'basic-bar',
      toolbar: { show: false },
      animations: { enabled: false },
    },
    dataLabels: { enabled: false },
    markers: {
      size: 4,
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
    stroke: { curve: 'straight' },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        inverseColors: true,
        opacityFrom: 1,
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

  // const adData = [
  //   { id: 1, imageUrl: 'https://tpc.googlesyndication.com/archive/simgad/16467954415080738021', title: 'Ad Title 1' },
  //   { id: 2, imageUrl: 'https://tpc.googlesyndication.com/archive/simgad/16730817389731017995', title: 'Ad Title 2' },
  //   { id: 3, imageUrl: 'https://via.placeholder.com/200', title: 'Ad Title 3' },
  //   { id: 4, imageUrl: 'https://via.placeholder.com/200', title: 'Ad Title 4' },
  //   { id: 5, imageUrl: 'https://via.placeholder.com/200', title: 'Ad Title 5' },
  //   { id: 6, imageUrl: 'https://via.placeholder.com/200', title: 'Ad TItle 6' },
  // ];

  function decodeHtmlEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text; return textArea.value;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 1 : 12} >
      <style> @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap) </style>
      
      <Card sx={{ height: isElongated ? '340px' : '280px', borderRadius: '5.5px',
      p: '23px', pt: '18px', transition: '0.3s all', border: '0.5px solid #ebebeb'}}>

      <Stack spacing={1.45} direction="row" sx={{display: 'flex', alignItems: 'center',}}>
        <img src={`https://www.google.com/s2/favicons?domain=${siteLink}&sz=256`} alt=''
        style={{ borderRadius: '50%', width: '32px', userSelect: 'none', 
        height: '32px', border: '1.5px solid black' }} />

        <Typography sx={{ fontSize: '32px', fontWeight: '400', userSelect: 'none',
        letterSpacing: '-0.5px', fontFamily: 'DM Serif Display',}}>
        {competitorName}
        </Typography>

      </Stack>

      <Stack spacing={1.55} direction="column" sx={{position: 'absolute',
      top: '81.5px', left: '25px'}}>


        <Button onClick={() => {setSelectedOption(1)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '280px',
        color: selectedOption === 1 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 1 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="lets-icons:chart-fill" sx={{mr: '5px', height: '21.5px', width: '21.5px'}} />
          Web Traffic This Month
        </Button>

        <Stack spacing={1.55} direction="row" sx={{display: 'flex', alignItems: 'center',}}>

        <Button onClick={() => {setSelectedOption(2)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: isElongated ? '280px' : '133px',
        color: selectedOption === 2 ? 'white' : theme.palette.primary.navBg, transition: 'width 0.3s',  
        backgroundColor: selectedOption === 2 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="icon-park-solid:google-ads" sx={{mr: '5px', height: '17.75px', width: '17.75px'}} />
          Ads
        </Button>

        {!isElongated && <Button onClick={() => {setSelectedOption(3)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '133px',
        color: selectedOption === 3 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 3 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="cib:blogger-b" sx={{mr: '5px', height: '17.75px', width: '17.75px'}} />
          Blogs
        </Button>}

        </Stack>

        {isElongated && <Stack spacing={1.55} direction="row" sx={{display: 'flex', alignItems: 'center',}}>

        <Button onClick={() => {setSelectedOption(3)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: isElongated ? '280px' : '0px',
        color: selectedOption === 3 ? 'white' : theme.palette.primary.navBg, transition: 'width 0.3s',  
        backgroundColor: selectedOption === 3 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="cib:blogger-b" sx={{mr: '5px', height: '17.75px', width: '17.75px'}} />
          Blogs
        </Button> </Stack>}

        <Stack spacing={1.55} direction="row" sx={{display: 'flex', alignItems: 'center',}}>

        <Button onClick={() => {setSelectedOption(4)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '133px',
        color: selectedOption === 4 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 4 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="majesticons:suitcase" sx={{mr: '5px', height: '20.25px', width: '20.25px'}} />
          Jobs
        </Button>

        <Button onClick={() => {setSelectedOption(5)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '133px',
        color: selectedOption === 5 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 5 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="devicon-plain:google" sx={{mr: '5px', height: '14.5px', width: '14.5px'}} />
          GMB
        </Button>

        </Stack>

      </Stack>

      {selectedOption === 1 && <>
      
      <Card sx={(theme) => ({ height: '240px', width: traffic[0]?.VISITS ? '455px' : '670px', borderRadius: '3.5px',
      top: '20px', left: '330px', p: '23px', pt: '18px', position: 'absolute', 
      backgroundColor: 'white', border: `1.0px solid ${theme.palette.primary.navBg}`,})}>

      {!traffic[0]?.VISITS && <NoneFound text="No Available Search Data" />}

      <Chart options={options} series={series} type="area" width={445} height={270} 
      style={{backgroundColor: 'white', position: 'absolute',
      left: '-1.5px', top: '-8px'}} />  

      <Card sx={(theme)=>({ height: '37.5px', width: 'auto', px: '15px', borderRadius: '0px', 
      borderBottomRightRadius: '2px', backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center', })}>
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      {traffic[0]?.VISITS ? `${traffic[0]?.VISITS} visits` :  `No Available Search Data`}  </Typography></Card>
      </Card>
      
      {traffic[0]?.VISITS && <Card sx={(theme) => ({ height: '240px', width: '195px', borderRadius: '5.5px',
      top: '20px', left: '806.5px', pt: '18px', position: 'absolute', 
      backgroundColor: 'white', border: `1.0px solid ${theme.palette.primary.navBg}`,})}>

      <Card sx={(theme)=>({ height: '37.5px', width: '194px', borderRadius: '0px', borderBottomRightRadius: '3.5px',
      backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>
        
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      Ranking Best For </Typography></Card>

      <List sx={(theme)=>({ width: '190px', height: '207.5px', 
        bgcolor: 'white', overflow: 'auto', position: 'absolute',
        top: '38px', left: '0px', pt: '0px', pb: '0px',
        p: '11px'})}>

      {rankingFor.map((item, index) => (
        <ListItem 
          key={index} 
          sx={(theme)=>({ height: 'auto',justifyContent: 'space-between', textAlign: 'center', userSelect: 'none',
          mb: '11px', borderRadius: '2.5px', p: '4.5px', backgroundColor: theme.palette.primary.lighter,})}>          
          <ListItemText primary={item.KEYWORD} sx={{p: '0px', fontSize: '16px', }}/>
        </ListItem>
      ))}

      </List>

      </Card>}
      
      </>}

      {selectedOption === 3 && <>
      
      {/* <Card sx={(theme)=>({ height: '240px', width: '195px', borderRadius: '5.5px',
      top: '20px', left: '330px', p: '23px', pt: '18px', position: 'absolute', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'white', border: `1.0px solid ${theme.palette.primary.navBg}`,})}>
      
      <Card sx={(theme)=>({ height: '37.5px', width: '100%', borderRadius: '0px', borderBottomRightRadius: '0px',
      backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex', userSelect: 'none',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      Website Audit </Typography>
      
      </Card>

      <Typography sx={{ fontSize: '28px', fontWeight: '400', userSelect: 'none', pt: '20px',
        letterSpacing: '-0.5px', fontFamily: 'DM Serif Display', textAlign: 'center'}}>
        Coming Soon
      </Typography>

      </Card> */}

      <List sx={(theme)=>({ width: '670px', //450px width, 510px left for website audit
        height: '240px', 
        bgcolor: 'white', overflow: 'auto', 
        marginLeft: '38px',borderRadius: '5.5px', position: 'absolute',
        top: '20px', left: '292px', pt: '0px', pb: '0px',
        border: `1.0px solid ${theme.palette.primary.navBg}`,})}>

      {indexedBlogs.length === 0 && <NoneFound text="No WordPress Blogs Found"/>}

      {indexedBlogs.map((blog, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: indexedBlogs.length > 3 ? (index !== indexedBlogs.length - 1 && '0.1px solid #c2c1c0') : '0.1px solid #c2c1c0'
          , justifyContent: 'space-between'}}>          
          <ListItemText primary={decodeHtmlEntities(blog.TITLE)} sx={{fontWeight: '900'}}/>
          <Button variant="contained" color="primary" sx={(theme) => ({minHeight: '20px', minWidth: '5px', 
          backgroundColor: theme.palette.primary.navBg, marginLeft: '15px',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = blog.LINK.startsWith('http://') || blog.LINK.startsWith('https://') ? blog.LINK : `http://${blog.LINK}`;
            window.open(url, '_blank');
          }}><Iconify icon="fluent:link-multiple-24-filled" sx={{minHeight: '19px', minWidth: '19px'}} /></Button>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', minWidth: '95px', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {formatDate(blog.DATE)}</Button>

        </ListItem>
      ))}

      </List></>}

      {selectedOption === 2 && (
        <Card sx={(theme) => ({
            height: isElongated && selectedOption === 2 ? '300px' : '240px',
            width: '670px', borderRadius: '5.5px', transition: '0.3s all',
            top: '20px', left: '330px',p: '23px', pt: '18px',
            position: 'absolute',backgroundColor: 'white',
            border: `1.0px solid ${theme.palette.primary.navBg}`,display: 'flex',
            flexDirection: 'column', overflow: 'hidden', })}
        >

          {adData.length === 0 && <NoneFound text="No Active Ads Found" lower/>}

          <Box sx={{ flexGrow: 1, overflow: 'auto', mt: '32px' }}>
            <Grid container spacing={4} sx={{ p: 2, pt: 3 }}>
              {adData.map((ad) => (
                <Grid item xs={6} key={ad.preview}>
                  <Card sx={{
                    display: 'flex', flexDirection: 'column',
                    borderRadius: '4px', width: '285px',
                    backgroundColor: 'lightgrey',height: 'auto'
                  }}>
                    <Box sx={{
                      width: '100%', paddingTop: '56.25%',  position: 'relative'
                    }}>
                      <CardMedia component="img" image={ad.preview} alt='Ad Preview'
                        sx={{
                          position: 'absolute', top: 0, left: 0,
                          width: '100%', height: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </Box>
                    {/* <Box sx={{ backgroundColor: 'white', p: 1, textAlign: 'center' }}>
                      {`${ad.title}`}
                    </Box> */}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Card sx={(theme) => ({
            position: 'absolute',
            height: '37.5px',
            width: 'auto',
            px: '18px',
            borderRadius: '0px',
            borderBottomRightRadius: '2.5px',
            backgroundColor: theme.palette.primary.navBg,
            display: 'flex',
            left: '0px',
            top: '0px',
            justifyContent: 'center',
            alignItems: 'center',
          })}>
            <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px' }}>
              {spendData === '' ? '$0 Estimated Spend' 
              : (spendData === '$0.00' ? 'No Spend Data Available' 
              : `${spendData} Estimated Spend`)}
            </Typography>
          </Card>

          {spendData !== '' && <Card sx={(theme) => ({
            position: 'absolute',
            height: '32.5px', width: 'auto',
            px: '12.5px', borderRadius: '4.5px',
            backgroundColor: theme.palette.primary.black, display: 'flex',
            right: '8px', top: '9px',
            justifyContent: 'center', alignItems: 'center',
          })}>
            <Iconify icon="material-symbols-light:ads-click" 
            sx={{ height: '17.5px', width: '17.5px', color: 'white', mr: '5px' }} />
            <Typography sx={{ fontSize: '13px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px' }}>
              Active Ads
            </Typography>
          </Card>}

        </Card>
      )}

      {selectedOption === 4 && <>
      
      <List sx={(theme)=>({ width: '670px', height: '240px', 
        bgcolor: 'white', overflow: 'auto', 
        marginLeft: '38px',borderRadius: '3.5px', position: 'absolute',
        top: '20px', left: '292px', pt: '0px', pb: '0px',
        border: `0.25px solid ${theme.palette.primary.navBg}`,})}>

      {jobData.length === 0 && <NoneFound text="No Active Jobs Found"/>}

      {jobData.map((job, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: '0.1px solid #c2c1c0',
          justifyContent: 'space-between'}}>          
          <ListItemText primary={job.TITLE} sx={{fontWeight: '900', height: '35.2px', display: 'flex', alignItems: 'center'}}/>
          
          {job.TYPE && <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.TYPE}</Button>}

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.POSTED}</Button>

          {job.LOCATION && <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.LOCATION}</Button>}

          <Iconify icon="fluent:link-multiple-24-filled" sx={({height: '31.5px', width: '45px', p: '5.75px', cursor: 'pointer',
          backgroundColor: 'darkred', marginLeft: '11px', '&:hover': { backgroundColor: 'darkred', }, color: 'white',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = job.LINK.startsWith('http://') || job.LINK.startsWith('https://') ? job.LINK : `http://${job.LINK}`;
            window.open(url, '_blank');
          }}/>

        </ListItem>
      ))}

      </List></>}
      

      {selectedOption === 5 && <>
      
      <List sx={(theme)=>({ width: '670px', height: '240px', 
        bgcolor: 'white', overflow: 'auto', 
        marginLeft: '38px',borderRadius: '3.5px', position: 'absolute',
        top: '20px', left: '292px', pt: '0px', pb: '0px',
        border: `0.25px solid ${theme.palette.primary.navBg}`,})}>

      {reviewData.length === 0 && <NoneFound text="No Google Reviews Found"/>}

      {reviewData.map((review, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: '0.1px solid #c2c1c0',
          justifyContent: 'space-between'}}>          

          <img src={review.PFP} style={{ width: 26, height: 26, marginRight: 13.5, borderRadius: 50 }} alt='' />

          <ListItemText primary={review.REVIEW} sx={{fontWeight: '900', height: '35.2px', display: 'flex', alignItems: 'center'}}/>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', minWidth: '30px', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {review.RATING}<Iconify icon="fe:star" sx={{
          minHeight: '16px', minWidth: '16px', ml: '2px', mb: '1.5px'}} /></Button>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {review.DATE || review.RATING}</Button>

        </ListItem>
      ))}

      </List></>}


      </Card>
      
      

    </Grid>
  );
}

PostCard.propTypes = {
  orgData: PropTypes.any,
  jobData: PropTypes.any,
  adData: PropTypes.any,
  spendData: PropTypes.any,
  traffic: PropTypes.any,
  rankingFor: PropTypes.any,
  indexedBlogs: PropTypes.any,
  reviewData: PropTypes.any,
  competitorName: PropTypes.string,
  siteLink: PropTypes.any,
  isReplacing: PropTypes.bool,
  index2: PropTypes.any,
};
