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
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions
import zIndex from '@mui/material/styles/zIndex';


// ----------------------------------------------------------------------

export default function PostCard({ platform, content, index, isGen }) {

  const data = [
    { month: 'January', value: 5000 },
    { month: 'February', value: 6000 },
    { month: 'March', value: 5500 },
    { month: 'April', value: 6580 },
  ];

  const cardColor = '#0072b1';
  
const options = {
  chart: {
    id: 'basic-bar',
    toolbar: { show: false }
  },
  dataLabels: { enabled: false },
  markers: {
    size: 4,
    hover: { size: 7 }
  },
  xaxis: {
    categories: data.map(item => item.month),
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
    crosshairs: { show: false }
  },
  yaxis: { labels: { show: false } },
  stroke: { curve: 'smooth' },
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
      data: data.map(item => item.value)
    }
  ];

  const [isCopied, setIsCopied] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  const copyText = async (text) => {
    const imgRegex = /<image[^>]*src=['"]([^'"]*)['"][^>]*>/gi; const match = imgRegex.exec(text);
    if (match) {const imgLink = match[1]; await setImgUrl(imgLink);} 
    const postableText = text.replace(/<\/?h[1-3]>|<\/?b>|<image[^>]*>/gi, '').replace(/<br\s*\/?>/gi, '\n');
    await navigator.clipboard.writeText(postableText);
    downloadPic(imgUrl);
  };

  const downloadPic = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'image.jpg'; // or any other filename you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const latestPostLarge = index === -10;
  const latestPost = index === -10 || index === -20;
  
  const handleClick = () => {
    // window.location.href = `/campaignpage?id=${campaign.campaign_id}&name=${campaign.campaign_name}`
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 3 : 4}>
          
      {/* <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center',}}
      open={open} autoHideDuration={3000} onClose={handleCloseAlert} 
      message={<span style={{ width: '80px', height: '50px' }}>Copied!</span>}
      style={{ marginTop: '0px', zIndex: 9999999 }} /> */}

      <Card sx = {{ height: 225, borderRadius: '8px', border: '2.5px solid', borderColor: cardColor }} onClick={() => handleClick()}>
        
      <Stack sx={{width: '100%', zIndex: 1, height: 50, backgroundColor: cardColor, 
      justifyContent: "space-between", userSelect: 'none', position: 'absolute'}}>
        <Stack direction="row" spacing={2}>
        <Typography sx={{color: 'white', p: 1.2, pt: 1.3, pl: 1.75, fontSize: '18px', fontWeight: '800',
        fontFamily: 'sans-serif', display: 'flex', alignItems: 'center',}} >
        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          width: '30ch', display: 'inline-block',}}>
          Keyword Example
        </span>
        </Typography> 
        </Stack>
        {/* <Iconify icon="mdi:linkedin" sx={{mr: 0.45, mb: 0.15, height: '26px', width: '26px'}}/> */}
        {/* <Iconify icon="uil:image-download"
          sx={{right: '44.5px', top: '10.5px', height: '26px', width: '26px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {setIsCopied(true); copyText(content);}}/>
        <Iconify icon={isCopied ? "mingcute:clipboard-fill" : "mingcute:clipboard-line"} 
          sx={{right: '13px', top: '11.5px', height: '26px', width: '26px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {setIsCopied(true); copyText(content);}}/> */}

      </Stack>

      <Stack sx={{width: '100%', zIndex: 125, height: 23.5, backgroundColor: 'white', bottom: '0px',
      justifyContent: "space-between", userSelect: 'none', position: 'absolute'}} />

      <Chart options={options} series={series} type="area" width={300} height={186} 
      style={{backgroundColor: 'white', marginTop: '25px',}} />


          
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  content: PropTypes.object,
  platform: PropTypes.object,
  index: PropTypes.number,
  isGen: PropTypes.bool,
};
