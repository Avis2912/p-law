import PropTypes from 'prop-types';
import React, { useState } from 'react';

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
import { CardActionArea } from '@mui/material';
import Chart from 'react-apexcharts';

// import { deleteList } from './view/delete-function'

import { format, subMonths } from 'date-fns';
import Iconify from 'src/components/iconify';

import { db } from 'src/firebase-config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function PostCard({ competitorName, indexedBlogs, orgData, jobData, traffic, rankingFor, siteLink, index2 }) {

  const latestPostLarge = index2 === -10;
  const latestPost = index2 === -10 || index2 === -20;

  const [selectedOption, setSelectedOption] = useState(1);

  const currentMonth = new Date();
  const monthlyData = [
    { month: format(subMonths(currentMonth, 3), 'MMMM'), value: traffic[0] },
    { month: format(subMonths(currentMonth, 2), 'MMMM'), value: traffic[1] },
    { month: format(subMonths(currentMonth, 1), 'MMMM'), value: traffic[2] },
    { month: format(currentMonth, 'MMMM'), value: traffic[3] },
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

  const cardClick = async () => {
    // DROP IT DOWN
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 1 : 12} >
      <style> @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap) </style>
      
      <Card sx={{ height: '280px', borderRadius: '5.5px',
      p: '23px', pt: '18px'}}>

      <Stack spacing={1.45} direction="row" sx={{display: 'flex', alignItems: 'center',}}>
        <img src={`https://www.google.com/s2/favicons?domain=${siteLink}&sz=256`} alt=''
        style={{ borderRadius: '50%', width: '32px', userSelect: 'none', 
        height: '32px', border: '1.5px solid black' }} />

        <Typography sx={{ fontSize: '32px', fontWeight: '400', userSelect: 'none',
        letterSpacing: '-0.5px', fontFamily: 'DM Serif Display',}}>
        {competitorName}
        </Typography>

        {/* <Iconify icon="bx:link" onClick={()=>{}} style={{ cursor: 'pointer',
        width: '32px', height: '32px', marginRight: '20px' }} /> */}
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
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '133px',
        color: selectedOption === 2 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 2 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="cib:blogger-b" sx={{mr: '5px', height: '17.75px', width: '17.75px'}} />
          Ads
        </Button>

        <Button onClick={() => {setSelectedOption(3)}} variant="contained" color="inherit" 
        sx={(theme) => ({fontSize: '16.5px', height: '47.5px', width: '133px',
        color: selectedOption === 3 ? 'white' : theme.palette.primary.navBg, 
        backgroundColor: selectedOption === 3 ? theme.palette.primary.navBg : theme.palette.primary.lighter,
        '&:hover': {color: 'white', backgroundColor: theme.palette.primary.navBg, boxShadow: 'none'},
        letterSpacing: '-0.5px', borderRadius: '5.5px', boxShadow: 'none'})}>
        <Iconify icon="cib:blogger-b" sx={{mr: '5px', height: '17.75px', width: '17.75px'}} />
          Blogs
        </Button>

        </Stack>

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
        <Iconify icon="bxs:business" sx={{mr: '5px', height: '19px', width: '19px'}} />
          Org
        </Button>

        </Stack>

      </Stack>

      {selectedOption === 1 && <>
      
      <Card sx={(theme) => ({ height: '240px', width: '465px', borderRadius: '5.5px',
      top: '20px', left: '330px', p: '23px', pt: '18px', position: 'absolute', 
      backgroundColor: 'white', border: `2.75px solid ${theme.palette.primary.navBg}`,})}>

      <Chart options={options} series={series} type="area" width={450} height={255} 
      style={{backgroundColor: 'white', position: 'absolute',
      left: '-1.5px', top: '-8px'}} />  

      <Card sx={(theme)=>({ height: '37.5px', width: '95px', borderRadius: '0px', borderBottomRightRadius: '5.5px',
      backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center', })}>
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      {`${traffic[traffic.length-1]}`} hits </Typography></Card>
      </Card>
      
      <Card sx={(theme) => ({ height: '240px', width: '195px', borderRadius: '5.5px',
      top: '20px', left: '815px', pt: '18px', position: 'absolute', 
      backgroundColor: 'white', border: `2.75px solid ${theme.palette.primary.navBg}`,})}>

      <Card sx={(theme)=>({ height: '37.5px', width: '194px', borderRadius: '0px', borderBottomRightRadius: '3.5px',
      backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      Ranking Best For </Typography></Card>

      <List sx={(theme)=>({ width: '190px', height: '207.5px', 
        bgcolor: 'white', overflow: 'auto', position: 'absolute',
        top: '38px', left: '0px', pt: '0px', pb: '0px',
        p: '11px'})}>

      {rankingFor.map((word, index) => (
        <ListItem 
          key={index} 
          sx={(theme)=>({ height: 'auto',justifyContent: 'space-between', textAlign: 'center', userSelect: 'none',
          mb: '11px', borderRadius: '2.5px', p: '4.5px', backgroundColor: theme.palette.primary.lighter,})}>          
          <ListItemText primary={word} sx={{p: '0px', fontSize: '16px', }}/>
        </ListItem>
      ))}

      </List>

      </Card>
      
      </>}

      {selectedOption === 3 && <>
      
      <Card sx={(theme)=>({ height: '240px', width: '195px', borderRadius: '5.5px',
      top: '20px', left: '330px', p: '23px', pt: '18px', position: 'absolute', 
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'white', border: `2.75px solid ${theme.palette.primary.navBg}`,})}>
      
      <Card sx={(theme)=>({ height: '37.5px', width: '190px', borderRadius: '0px', borderBottomRightRadius: '0px',
      backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex', userSelect: 'none',
      left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>
      <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
      Website Audit </Typography>
      
      </Card>

      <Typography sx={{ fontSize: '28px', fontWeight: '400', userSelect: 'none', pt: '18px',
        letterSpacing: '-0.3px', fontFamily: 'DM Serif Display', textAlign: 'center'}}>
        Coming Soon
      </Typography>

      {/* <List sx={(theme)=>({ width: '190px', height: 'auto', 
        bgcolor: 'white', overflow: 'auto', position: 'absolute',
        top: '38px', left: '0px', pt: '0px', pb: '0px',
        p: '11px'})}>

      {indexedBlogs.map((blog, index) => (
        <ListItem 
          key={index} 
          sx={(theme)=>({ height: 'auto',justifyContent: 'space-between', textAlign: 'center', userSelect: 'none',
          mb: '11px', borderRadius: '2.5px', p: '4.5px', backgroundColor: theme.palette.primary.lighter,})}>          
          <ListItemText primary='Keyword' sx={{p: '0px', fontSize: '16px', }}/>
        </ListItem>
      ))}

      </List> */}

      </Card>


      <List sx={(theme)=>({ width: '460px', height: '240px', 
        bgcolor: 'white', overflow: 'auto', 
        marginLeft: '38px',borderRadius: '5.5px', position: 'absolute',
        top: '20px', left: '510px', pt: '0px', pb: '0px',
        border: `2.75px solid ${theme.palette.primary.navBg}`,})}>

      {indexedBlogs.map((blog, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: indexedBlogs.length > 3 ? (index !== indexedBlogs.length - 1 && '0.1px solid #c2c1c0') : '0.1px solid #c2c1c0'
          , justifyContent: 'space-between'}}>          
          <ListItemText primary={blog.TITLE} sx={{fontWeight: '900'}}/>
          <Button variant="contained" color="primary" sx={(theme) => ({height: '27px', width: '28px', 
          backgroundColor: theme.palette.primary.navBg, marginLeft: '15px',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = blog.LINK.startsWith('http://') || blog.LINK.startsWith('https://') ? blog.LINK : `http://${blog.LINK}`;
            window.open(url, '_blank');
          }}><Iconify icon="fluent:link-multiple-24-filled" /></Button>
        </ListItem>
      ))}

      </List></>}

      {(selectedOption === 2|| selectedOption === 5) && <><Card sx={(theme) => ({ height: '240px', width: '680px', borderRadius: '5.5px',
      top: '20px', left: '330px', p: '23px', pt: '18px', position: 'absolute', 
      backgroundColor: 'white', border: `2.75px solid ${theme.palette.primary.navBg}`,
      display: 'flex', justifyContent: 'center', alignItems: 'center'})}>
        <Typography sx={{ fontSize: '34px', fontWeight: '400', userSelect: 'none',
        letterSpacing: '-0.3px', fontFamily: 'DM Serif Display',}}>
        Coming Soon
        </Typography>
      </Card></>}

      {selectedOption === 4 && <>
      
      <List sx={(theme)=>({ width: '680px', height: '240px', 
        bgcolor: 'white', overflow: 'auto', 
        marginLeft: '38px',borderRadius: '5.5px', position: 'absolute',
        top: '20px', left: '292px', pt: '0px', pb: '0px',
        border: `2.75px solid ${theme.palette.primary.navBg}`,})}>

      {jobData.map((job, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: '0.1px solid #c2c1c0',
          justifyContent: 'space-between'}}>          
          <ListItemText primary={job.TITLE} sx={{fontWeight: '900', height: '32.5px', display: 'flex', alignItems: 'center'}}/>
          
          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.TYPE}</Button>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.POSTED}</Button>

          <Button variant="contained" color="primary" sx={(theme) => ({height: '32px', width: 'auto', cursor: 'default', boxShadow: 'none',
          backgroundColor: theme.palette.primary.lighter, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.lighter, boxShadow: 'none'},
          borderRadius: '5px', fontSize: '14px', color: theme.palette.primary.navBg})}>
          {job.LOCATION}</Button>

          {/* <Button variant="contained" color="primary" sx={(theme) => ({height: '30px', maxWidth: '10px', p: '0px',
          backgroundColor: theme.palette.primary.navBg, marginLeft: '10px', '&:hover': { backgroundColor: theme.palette.primary.navBg, },
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = job.LINK.startsWith('http://') || job.LINK.startsWith('https://') ? job.LINK : `http://${job.LINK}`;
            window.open(url, '_blank');
          }} /> */}

          <Iconify icon="fluent:link-multiple-24-filled" sx={({height: '31.5px', width: '45px', p: '5.75px', cursor: 'pointer',
          backgroundColor: 'darkred', marginLeft: '11px', '&:hover': { backgroundColor: 'darkred', }, color: 'white',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = job.LINK.startsWith('http://') || job.LINK.startsWith('https://') ? job.LINK : `http://${job.LINK}`;
            window.open(url, '_blank');
          }}/>

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
  traffic: PropTypes.any,
  rankingFor: PropTypes.any,
  indexedBlogs: PropTypes.any,
  competitorName: PropTypes.string,
  siteLink: PropTypes.any,
  index2: PropTypes.any,
};
