import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
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
    window.location.href = "/newcampaign";
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h3">All Campaigns</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />} onClick={() => handleClickRoute()}>
          New Campaign
        </Button>
      </Stack>

      <Grid container spacing={3}>
      {brandCampaigns.slice().reverse().map((post, index) => <PostCard key={post.campaign_id} campaign={post} index={index} />)}
      </Grid>
    </Container>
  );
}
