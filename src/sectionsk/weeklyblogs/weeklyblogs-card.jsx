import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'; 

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

  const navigate = useNavigate();
  const platformColors = {
    "LinkedIn": "#0072b1",
    "Facebook": "#3a7eab", 
    // "#1877f2",
    "Instagram": "#ba4a8a",
    // "#C13584",
  }

  const [isCopied, setIsCopied] = useState(false);

  const [blogTitle, setBlogTitle] = useState('');
  const [blogDesc, setBlogDesc] = useState('');
  const [blogImg, setBlogImg] = useState(null);

  useEffect(() => {
    
    const h1Match = content.match(/<h1>(.*?)<\/h1>/i);
    const pMatch = content.match(/<p>(.*?)<\/p>/i);
    let imgMatch = content.match(/<img[^>]+src="(.*?)"[^>]*>/i);
    console.log('imgMatch0', imgMatch);
    if (!imgMatch) {imgMatch = content.match(/<image[^>]+src="(.*?)"[^>]*>/i);}    
    console.log('imgMatch', imgMatch);
    if (h1Match) setBlogTitle(h1Match[1]);
    if (pMatch) setBlogDesc(pMatch[1]);
    if (imgMatch) setBlogImg(imgMatch[1]);
    
  }, [content]);


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

      <Card sx = {{ height: '397.5px', borderRadius: '8px', border: '2px solid', borderColor: 'darkred', backgroundColor: 'white', cursor: 'pointer',
       padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}
       onClick={() => handleClick()}>
    
      <Card sx={{position: 'absolute', width: '90%', height: '175px', backgroundColor: 'bisque',
      top:'16px', borderRadius: '8px', backgroundImage: `url(${blogImg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',  }} />

      <Card sx={{position: 'absolute', width: '90%', height: '125px', backgroundColor: 'transparent',
      top:'210px', borderRadius: '2px', boxShadow: 'none', }}> 

      <Typography sx={{ fontFamily: 'DM Serif Display', letterSpacing: '-0.5', fontWeight: '500', fontSize: "26px",
      lineHeight: '30px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {blogTitle}</Typography>
      <Typography variant="subtitle2" sx={{ fontFamily: '', letterSpacing: '-0.4', fontWeight: '500', fontSize: "15px",
      lineHeight: '22px', marginTop: '10px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {blogDesc}</Typography>
      </Card>

            
      <Button variant="contained" startIcon={<Iconify icon="iconoir:post" />}
      sx={(theme) => ({position: 'absolute', top: '340px', width: '90%', height: '38px', borderRadius: '5px',
      fontSize: '15px', fontWeight: '700', backgroundColor: theme.palette.primary.navBg, '&hover': {backgroundColor: theme.palette.primary.navBg}})}
      onClick={() => navigate(`/blog?blogID=${index}`)}>
      Start Working</Button>


    {/* 
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
      /> */}

          
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
