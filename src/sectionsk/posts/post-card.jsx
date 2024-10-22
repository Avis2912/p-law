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

import { auth } from 'src/firebase-config/firebase';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { Snackbar } from '@mui/material';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import shadows from '@mui/material/styles/shadows';
// import { CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions


// ----------------------------------------------------------------------

export default function PostCard({ platform, content, index, isGen }) {

  const platformColors = {
    "LinkedIn": "#0072b1",
    "Facebook": "#3a7eab", 
    // "#1877f2",
    "Instagram": "#ba4a8a",
    // "#C13584",
  }

  const [isCopied, setIsCopied] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let imgRegex = /<image[^>]*src=['"]([^'"]*)['"][^>]*>/gi; const match = imgRegex.exec(content);
    if (match) {const imgLink = match[1]; setImgUrl(imgLink); console.log(imgLink);} 
    else {imgRegex = /<img[^>]*src=['"]([^'"]*)['"][^>]*>/gi; const match1 = imgRegex.exec(content);
    console.log(match1); if (match1) {setImgUrl(match1[1])};}
  }, [content]);

  const copyText = async (text) => { 
    const postableText = text.replace(/<\/?h[1-3]>|<\/?b>|<image[^>]*>|<\/?p>/gi, '').replace(/<br\s*\/?>/gi, '\n');
    await navigator.clipboard.writeText(postableText);
  };

  const downloadPic = async (url) => {
    console.log('GIVEN URL: ', url);
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'pentra-img.jpg'; // or any other filename you want
    document.body.appendChild(link);
    link.click(); document.body.removeChild(link);
    copyText(content);
  };

  const download = async (url) => {
    fetch(url).then(resp => resp.blob()).then(blob => {
      const link = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);
  
      link.download = 'pentra-img.jpg';
      link.href = blobUrl;
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
  }

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

      <Card sx = {{ height: 450, borderRadius: '6px', border: '2.0px solid', borderColor: platformColors[platform] }} onClick={() => handleClick()}>
        
      <Stack sx={{width: '100%', height: 50, backgroundColor: platformColors[platform], justifyContent: "space-between"}}>
        <Stack direction="row" spacing={2}>
        <Typography sx={{color: 'white', p: 1.2, pl: 1.75, fontSize: '22px', fontWeight: '800',
      fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', userSelect: 'none'}}>
          {platform === "LinkedIn" && <Iconify icon="mdi:linkedin" sx={{mr: 0.45, mb: 0.15, height: '26px', width: '26px'}}/> }
          {platform === "Facebook" && <Iconify icon="entypo-social:facebook" sx={{mr: 0.75, ml: -0.0, mb: 0.15, height: '22.25px', width: '22.25px'}}/> }
          {platform === "Instagram" && <Iconify icon="ant-design:instagram-filled" sx={{mr: 0.5, mb: 0.1, ml: -0.1, height: '24.5px', width: '24.5px'}}/> }
          {platform}
        </Typography> 
        </Stack>
        <Iconify icon="uil:image-download"
          sx={{right: '44.5px', top: '10.5px', height: '26px', width: '26px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {download(imgUrl);}}/>
        <Iconify icon={isCopied ? "mingcute:clipboard-fill" : "mingcute:clipboard-line"} 
          sx={{right: '13px', top: '11.5px', height: '26px', width: '26px', position: 'absolute', color: 'white', cursor: 'pointer', opacity: '0.9'}}
          onClick={async () => {setIsCopied(true); copyText(content);}}/>

      </Stack>

      <ReactQuill 
        value={content}
        modules={{ toolbar: false }}
        style={{ 
          width: '100%', 
          height: '396px', 
          marginBottom: '50px', 
          border: '0px solid #ccc',
          borderRadius: '0px', 
          backgroundColor: isGen ? 'lightgrey' : 'white',
          opacity: '0.85',
          transition: '0.75s ease',
        }}
      />

          
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
