import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/lab';
import { useState, useRef, useEffect } from 'react';

import LocationSort from 'src/sectionsk/updatecampaign/product-sort';
import FollowerSort from 'src/sectionsk/updatecampaign/follower-sort';
import PlatformSort from 'src/sectionsk/updatecampaign/platform-sort';
import EngagementSort from 'src/sectionsk/updatecampaign/engagement-sort';
import StyleSort from 'src/sectionsk/updatecampaign/style-sort';
import { db, auth } from 'src/firebase-config/firebase';

import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions


// import { posts } from 'src/_mock/lists';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------


export default function AccountView() {

  const queryParams = new URLSearchParams(window.location.search);
  const campaign_id = queryParams.get('id');

  const [selectedDate, setSelectedDate] = useState(new Date());
  const hiddenInputRef = useRef(); // Create a ref for the hidden input

  const [pfp, setPfp] = useState('/assets/images/avatars/bg1.png');

  const [campaign, setCampaign] = useState([]);

  const brandsData = collection(db, 'brands');



  useEffect(() => {
    const getBrandCampaigns = async () => {
      try {
        const data = await getDocs(brandsData);
        const userDoc = data.docs.find((docc) => docc.id === auth.currentUser.email);
        
        const campaigns = userDoc.data().campaigns;
        const campaignFr = campaigns.find(c => c.campaign_id === campaign_id);
  
             if (userDoc) {
          await setCampaign(campaignFr);
  
        } else {
          alert('Error: User document not found.');
        }
      } catch (err) {
        alert(err);
      }
    };
  
    const getPfp = async () => {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `brands/${auth.currentUser.email}/${campaign_id}`);
        const downloadUrl = await getDownloadURL(storageRef);
        setPfp(downloadUrl);
        return null;
      } catch (err) {
        console.error('Error fetching image:', err);
        return ''; // Return an empty string if there's an error
      }
    };
    getPfp();
    getBrandCampaigns();
  }, [brandsData, campaign_id])

  const handleButtonClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.click(); // Trigger the hidden input's click, which will open the DatePicker
    }
  };

  const fileInputRef = useRef(); // reference to the file input

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setPfp(e.target.result); // Upon loading the file, set the profileSrc state
      reader.readAsDataURL(event.target.files[0]); // Read the uploaded file as Data URL
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger the file input's click event
  };

  const saveCampaign = () => {
  window.location.href = "/campaigns"
 
  };


  const endCampaign = async () => {
      if (!auth.currentUser) {
        alert('No authenticated user found.');
        return;
      }
    
      const userDocRef = doc(db, 'brands', auth.currentUser.email);
    
      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userCampaigns = userDocSnap.data().campaigns;
          const updatedCampaigns = userCampaigns.map((c) => {
            // Find the campaign with the matching campaign_id and update its status
            if (c.campaign_id === campaign?.campaign_id) {
              return { ...c, campaign_status: false }; // Change campaign_status to false
            }
            return c; // Return the campaign unchanged if it's not the one we're looking for
          });
    
          // Update the user document with the updated campaigns array
          await updateDoc(userDocRef, {
            campaigns: updatedCampaigns
          });
    
          // Redirect to the campaigns page
          window.location.href = "/campaigns";
        } else {
          alert('Brand document not found.');
        }
      } catch (err) {
        console.error("Error ending campaign: ", err);
        alert('Failed to end campaign.');
      }
    };
    

  return (
    
    <Container>
      
      <Stack className='heading' direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h3">{campaign?.campaign_name} Campaign</Typography>
        <Stack direction="row" spacing={2}>
        <Button sx={{ marginLeft:'40px' }} variant="contained" color="primary"
        onClick={() => endCampaign()}>
            End Campaign
          </Button>
        {/* <Button sx={{ marginLeft:'40px' }} variant="contained" color="inherit"
        onClick={() => endCampaign()}>
            Save Changes 🎉
          </Button> */}
          </Stack>
      </Stack>
      
      <Stack className='divider' direction="row" spacing={2}>
          
      <Card sx={{ height: 600, width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
      <Card sx={{ height: 400, width: 300, mt: 11, mb: 3, boxShadow: 'none', justifyContent: "center" }}>
            <Box
              component="img"
              alt="profile picture"
              src={pfp}
              sx={{
                top: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                borderRadius: '0%', // Adjust based on preference
              }}
            />
          </Card>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }} // Hide the default file input
            accept="image/*" // Optional: Set the accepted file types
          />

          {/* <Button variant="contained" color="primary" onClick={handleUploadClick}>
             Update Image
          </Button>

        <Typography fontSize="14px" fontWeight={100} mt={2} mb={2} fontFamily="Old Standard TT">
          ideally 300 x 400
        </Typography> */}

      </Card>




          <Card sx={{ height: 600, width: '65%' }}>

          <Typography fontSize="24px"
           fontWeight={100} mt={7.5} mx={5} mb={2}
           fontFamily="Old Standard TT"
           >Product Name
          </Typography>

          <TextField 
          sx = {{ marginLeft:'38px', width:'89%' }}
          id="outlined-multiline-flexible"
          label=""
          multiline
          minRows={1}
          maxRows={1}
          value={campaign?.campaign_name}
          placeholder='2-5 words' />

          <Typography fontSize="24px"
           fontWeight={100} mt={4} mx={5} mb={2}
           fontFamily="Old Standard TT"
           >Product Description
          </Typography>

          <TextField 
          sx = {{ marginLeft:'38px', width:'89%' }}
          id="outlined-multiline-flexible"
          label=""
          multiline
          minRows={2}
          maxRows={2}
          width="50%"
          value={campaign ? campaign.campaign_description : null}
          placeholder='A 20-50 word product / campaign description' />


<Stack direction="row" spacing={2} mt={4} mx={5} alignItems="center">
         
         <Typography fontSize="24px"
           fontWeight={100} mt={3} mx={5} mb={2}
           fontFamily="Old Standard TT"
           >End Date
           </Typography>

          <TextField sx={{ width: "20%" }} 
          placeholder="11/11/23" size="small"
          value={campaign ? campaign.campaign_end_date : null} /> 


        </Stack>



          <Typography fontSize="24px"
           fontWeight={100} mt={4} mx={5} mb={2.5}
           fontFamily="Old Standard TT"
           >Filters (optional)
          </Typography>

          <Stack spacing={1} ml={4} direction="column" alignItems="left" justifyContent="space-between">
    
        <Stack direction="row" spacing={2}>
      
        {
  campaign?.campaign_filters 
    ? <LocationSort values={campaign?.campaign_filters.locations || ['Global']} />
    : null
}
{
  campaign?.campaign_filters && campaign?.campaign_filters.followers
    ? <FollowerSort values={campaign?.campaign_filters.followers} />
    : null
}

{
  campaign?.campaign_filters && campaign?.campaign_filters.platforms
    ? <PlatformSort values={campaign?.campaign_filters.platforms} />
    : null
}

{
  campaign?.campaign_filters && campaign?.campaign_filters.engagement
    ? <EngagementSort values={campaign?.campaign_filters.engagement} />
    : null
}

{
  campaign?.campaign_filters && campaign?.campaign_filters.styles
    ? <StyleSort values={campaign?.campaign_filters.styles} />
    : null
}

        </Stack>

        <Stack direction="row" spacing={2} />
        


      
        </Stack>


          </Card>

      </Stack>
      
    </Container>
  );
}
