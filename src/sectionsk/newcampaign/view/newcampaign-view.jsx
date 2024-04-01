import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/lab';
import { useState, useRef} from 'react';
// import { auth } from 'src/firebase-config/firebase';

import CreatorCard from 'src/sectionsk/creators/creator-card';
import ProductSort from 'src/sectionsk/newcampaign/product-sort';
import FollowerSort from 'src/sectionsk/newcampaign/follower-sort';
import PlatformSort from 'src/sectionsk/newcampaign/platform-sort';
import EngagementSort from 'src/sectionsk/newcampaign/engagement-sort';
import StyleSort from 'src/sectionsk/newcampaign/style-sort';

import { auth, db } from 'src/firebase-config/firebase';
import { getDocs, getDoc, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import { ref, uploadString, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions

import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'

import Iconify from 'src/components/iconify';

// import PostCard from '../post-card';
// import PostSort from '../post-sort';
// import PostSearch from '../post-search';


// ----------------------------------------------------------------------

const renderBrandPfp = (
  <Box
    component="img"
    alt= "profile picture"
    src = '/assets/images/avatars/avatar_20.jpg'
    sx={{
      top: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'absolute',
      borderRadius: '0%', // Apply a circular clipping mask
    }}
  />
);

const defaultProfileSrc = '/assets/images/avatars/bg1.png';


export default function AccountView() {


  const [brandCampaigns, setBrandCampaigns] = useState([]);
  const [newCampaign, setNewCampaign] = useState(null);

  const brandsData = collection(db, 'brands');

  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`;


  // ...
  
  const publishCampaign = async () => {
    // Check if the required fields are empty
    if (!campaign_name || !campaign_description || !campaign_end_date || profileSrc === '/assets/images/avatars/bg1.png') {
      alert("Name, Description, Date, and Image are required fields");
      return;
    }
  
    // Rest of the code for publishing the campaign
    const newCampaignData = {
      campaign_filters: {
        engagement,
        followers,
        locations,
        styles,
        platforms,
      },
      campaign_respondees: [],
      campaign_id: Math.floor(10000000 + Math.random() * 90000000),
      campaign_name,
      campaign_status: true,
      campaign_date: formattedDate,
      campaign_end_date,
      campaign_description,
    };
  
    try {
      // Upload the image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `brands/${auth.currentUser.email}/${newCampaignData.campaign_id}`);
      await uploadString(storageRef, profileSrc, 'data_url');
  
      const userDocRef = doc(db, 'brands', auth.currentUser.email);
  
      // Fetch the existing campaigns for the user
      const userDocSnap = await getDoc(userDocRef);
      const existingCampaigns = userDocSnap.data().campaigns || []; // Default to an empty array if no campaigns
  
      // Append the new campaign to the fetched campaigns
      const combinedCampaigns = [...existingCampaigns, newCampaignData];
  
      // Update Firestore with the combined campaigns
      await updateDoc(userDocRef, {
        campaigns: combinedCampaigns,
      });
      setBrandCampaigns(combinedCampaigns); // Update local state with the combined campaigns
      setNewCampaign('');
    } catch (err) {
      alert(err);
    }
  
    window.location.href = '/campaigns';
  };
  
  

  const hiddenInputRef = useRef(); // Create a ref for the hidden input

  const [campaign_name, setCampaign_name] = useState('');
  const [campaign_description, setCampaign_description] = useState('');
  const [campaign_end_date, setCampaign_end_date] = useState('');
  
  const [engagement, setEngagement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [styles, setStyles] = useState([]);



  const campaign_date = () => {

  }

  const handleButtonClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.click(); // Trigger the hidden input's click, which will open the DatePicker
    }
  };

  const [profileSrc, setProfileSrc] = useState(defaultProfileSrc); // state for profile image
  const fileInputRef = useRef(); // reference to the file input

  const handleDateChange = (date) => {
   //  setSelectedDate(date);
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileSrc(e.target.result); // Upon loading the file, set the profileSrc state
      reader.readAsDataURL(event.target.files[0]); // Read the uploaded file as Data URL
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger the file input's click event
  };


  return (
    
    <Container>
      
      <Stack className='heading' direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h3"> New Campaign </Typography>
        <Button sx={{ marginLeft:'40px' }} variant="contained" color="inherit"
        onClick={() => publishCampaign()}>
            Publish Campaign 🎉
          </Button>
      </Stack>
      
      <Stack className='divider' direction="row" spacing={2}>
          
      <Card sx={{ height: 600, width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
      <Card sx={{ height: 400, width: 300, mt: 6, mb: 3, boxShadow: 'none', justifyContent: "center" }}>
            <Box
              component="img"
              alt="profile picture"
              src={profileSrc}
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

          <Button variant="contained" color="primary" onClick={handleUploadClick}>
            Upload Image
          </Button>

        <Typography fontSize="14px" fontWeight={100} mt={2} mb={2} fontFamily="Old Standard TT">
          ideally 300 x 400
        </Typography>

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
          placeholder='2-5 words' 
          onChange={e => setCampaign_name(e.target.value)}/>

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
          onChange={e => setCampaign_description(e.target.value)}
          placeholder='A 20-50 word product / campaign description' />


<Stack direction="row" spacing={2} mt={4} mx={5} alignItems="center">
         
         <Typography fontSize="24px"
           fontWeight={100} mt={3} mx={5} mb={2}
           fontFamily="Old Standard TT"
           >End Date
           </Typography>

          <TextField sx={{ width: "20%" }} 
          onChange={e => setCampaign_end_date(e.target.value)}
          placeholder="11/11/23" size="small" /> 

        </Stack>



          <Typography fontSize="24px"
           fontWeight={100} mt={4} mx={5} mb={2.5}
           fontFamily="Old Standard TT"
           >Filters (optional)
          </Typography>

          <Stack spacing={1} ml={4} direction="column" alignItems="left" justifyContent="space-between">
    
        <Stack direction="row" spacing={2}>
      
        <ProductSort onChange={values => setLocations(values)} />
<FollowerSort onChange={values => setFollowers(values)} />
<PlatformSort onChange={values => setPlatforms(values)} />
<EngagementSort onChange={values => setEngagement(values)} />
<StyleSort onChange={values => setStyles(values)} />


        </Stack>

        <Stack direction="row" spacing={2} />
        


      
        </Stack>


          </Card>

      </Stack>
      
    </Container>
  );
}
