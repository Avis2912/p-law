import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect } from 'react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------

export default function BlogView() {
  const [brandCampaigns, setBrandCampaigns] = useState([]);

  const [blogDescription, setBlogDescription] = useState('');
  const [blogKeywords, setBlogKeywords] = useState('');

  const [isNewPost, setIsNewPost] = useState(false);

  
  useEffect(() => {
    const brandsData = collection(db, 'brands');
    const getBrandCampaigns = async () => {
      try {
        const data = await getDocs(brandsData);
        const userDoc = data.docs.find((docc) => docc.id === auth.currentUser.email);
        if (userDoc) {
          await setBrandCampaigns(userDoc.data().campaigns || []);
        } else {
          alert('Error: User document not found.');
        }
      } catch (err) {
        alert(err);
      }
    };

    getBrandCampaigns();
  }, []);

  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`;

  const handleClickRoute = () => {
    setIsNewPost(!isNewPost);
    // window.location.href = "/newcampaign";
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h3">          
        {isNewPost ? 'Create New Legal Posts' : 'Weekly Social Media Posts'}
        </Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleClickRoute()}>
          {isNewPost ? 'Close Post Creator' : 'Create New Post'}
        </Button>
      </Stack>

      {isNewPost ? <>
      <Stack mb={3} direction="row" alignItems="center" justifyContent="space-between"
      sx={{}} spacing={2}>
    
      <Stack direction="row" spacing={2} sx={{width: 'calc(100% - 150px)'}}>
      <TextField
       value={blogDescription}
       onChange={(e) => setBlogDescription(e.target.value)}
       placeholder='Post Description'
       sx={{width: '70%'}} />

      <TextField
       value={blogKeywords}
       onChange={(e) => setBlogKeywords(e.target.value)}
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

      <Grid container spacing={3} sx={{width: '100%'}}>
      {brandCampaigns.slice().reverse().map((post, index) => <PostCard key={post.campaign_id} campaign={post} index={index} />)}
      </Grid>
    </Container>
  );
}
