import Stack from '@mui/material/Stack';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { db, creator_avatars } from 'src/firebase-config/firebase';

import { posts } from 'src/_mock/lists';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'

import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------
  

export default function InfluencerView() {

 
  const queryParams = new URLSearchParams(window.location.search);
  const pentra_id = queryParams.get('pentra_id');
  
  
    const [influencer, setInfluencer] = useState();
    const [allCreators, setAllCreators] = useState();
  
  
    useEffect (() => {
      console.log("hey");
      const otherstuff = async () => {
        try {
          const creatorsData = collection(db, 'creators');
          const querySnapshot = await getDocs(creatorsData);
          const allCreatorsData = querySnapshot.docs;
          setAllCreators(allCreatorsData); // update the state
      
          const filteredCreators = allCreatorsData.filter(creator => creator.data().pentra_id === Number(pentra_id));
          const influencerData = filteredCreators[0].data();
          await setInfluencer(influencerData);
      
          console.log(influencerData);
          setFollowerCount(influencerData.followers.IG);
      
        } catch (error) {
          alert(error);
          console.log(error);
        }
      }
      

      otherstuff();

    }, [pentra_id])
  
    

  const [followerCount, setFollowerCount] = useState(0);
  const [engagement, setEngagement] = useState('A+'); // Default is for Instagram
  const [IG_stats, setIG_stats] = useState(true);
  const [TT_stats, setTT_stats] = useState(false);
  const [YT_stats, setYT_stats] = useState(false);

  

  // Handlers for social media button clicks
  const handleInstagramClick = () => {
    setFollowerCount(influencer.followers.IG);
    setEngagement('A+'); // Instagram follower count
    setIG_stats(true);
    setTT_stats(false);
    setYT_stats(false);
  };

  const handleYouTubeClick = () => {
    setFollowerCount(influencer.followers.YT);
    setEngagement('N/A');
    setYT_stats(true);
    setIG_stats(false);
    setTT_stats(false);
  };

  const handleTikTokClick = () => {
    setFollowerCount(influencer.followers.TT);
    setEngagement('N/A');    
    setTT_stats(true);
    setIG_stats(false);
    setYT_stats(false);
  };

  const [showEmail, setShowEmail] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(''); // To hold the input from the text field

  // Function to handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() !== '') { // Prevent empty messages
      setMessages([...messages, newMessage]);
      setNewMessage(''); // Clear the input field after sending the message
    }
  };

  // Function to capture input from the text field
  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  // Enter key handling
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const renderStyleIcon = (style, icon, padding) => {
    if (influencer && influencer.styles[style]) {
      return (
        <Box
          border="0px solid black"
          width="20px"
          height="35px"
          borderRadius="25px"
          borderColor="pink"
          justifyContent="center"
          alignItems="center"
          pl={padding}
          pt="0.65"
        >
          <Typography fontSize="15px">{icon}</Typography>
        </Box>
      );
    }
    return null;
  };

  const renderSocialLink = (platform, urlPart, icon) => {
    if (influencer && influencer.handles[platform] !== "") {
      return (
        <a
          href={`https://www.${urlPart}/${influencer.handles[platform]}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
        >
          <Iconify icon={icon} style={{ color: 'black', width: 32, height: 32 }} />
        </a>
      );
    }
    return null;
  };

  const renderGiftOption = (giftType, label) => {
    if (influencer && influencer.gifts[giftType]) {
      return (
        <Box 
          border="1px solid black"
          width="86px"
          height="35px"
          borderRadius="7px"
          borderColor="pink"
          justifyContent="center"
          alignItems="center"
          direction="row"
          pl={1.8}
          pt={0.85}
        >
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Iconify icon="mdi-instagram" style={{ color: 'black', width: 14.8, height: 20 }} />
            <Typography fontSize="12.5px" fontFamily="times new roman">{label}</Typography>
          </Stack>
        </Box>
      );
    }
    return null;
  };

  const renderPlatformOffering = (platform, label, icon, paddingLeft) => {
    if (influencer && influencer.gifts[platform]) {
      return (
        <Box 
          border="1px solid black"
          width="86px"
          height="35px"
          borderRadius="7px"
          borderColor="pink"
          justifyContent="center"
          alignItems="center"
          direction="row"
          pl={paddingLeft}
          pt={0.85}
        >
          <Stack direction="row" spacing={0.6} alignItems="center">
            <Iconify icon={icon} style={{ color: 'black', width: 15, height: 20 }} />
            <Typography fontSize="12.5px" fontFamily="times new roman">{label}</Typography>
          </Stack>
        </Box>
      );
    }
    return null;
  };

  const renderInfluencerOffers = () => {
    if (!influencer) return null;
  
    if (influencer.wantsGifts) {
      return <Typography sx={{ mb: 2.3, fontStyle: 'italic', fontFamily: 'old standard TT' }}>
                For a gift, I will post:
             </Typography>;
    } 
      return (
        <Stack>
          <Typography sx={{ mb: 2.3, fontStyle: 'italic', fontFamily: 'old standard TT' }}>
            I am looking for sponsors. My rates:
          </Typography>
          <Typography sx={{ mb: 2.3, fontStyle: 'italic', fontFamily: 'old standard TT' }}>
            {influencer.sponsor_rates}
          </Typography>
        </Stack>
      );
    
  };

  const renderInstagramButton = () => {
    if (!influencer || influencer.handles.IG === "") return null;
  
    return (
      <Button disableRipple onClick={handleInstagramClick} sx={{ 
        p: 0, // This ensures that the padding inside the button is removed.
        minWidth: '45px', // Explicitly setting a minimum width. Adjust as needed.
        width: '40px', // Explicitly setting the width.
        height: '50px', // Making a square button.
        borderRadius: '0%', 
        borderBottom: 3,
        borderBottomColor: IG_stats ? 'red' : 'white',
        '&:hover': {
          backgroundColor: 'transparent', // This will make the background color unchanged on hover
          // Preventing the click effect
          boxShadow: 'none',
        },
        '&:active': { 
          boxShadow: 'none',
          backgroundColor: 'transparent', // This will make the background color unchanged on active/click
        },
        // Removing the default button material touch ripple effect
        MuiTouchRipple: { 
          display: 'none', 
        }, }}>
        <Iconify icon="mdi-instagram" style={{ color: 'black', width: 34, height: 34 }} />
      </Button>
    );
  };
  
  const renderTikTokButton = () => {
    if (!influencer || influencer.handles.TT === "") return null;
  
    return (
      <Button disableRipple onClick={handleTikTokClick} sx={{
        
        p: 0, // This ensures that the padding inside the button is removed.
        minWidth: '45px', // Explicitly setting a minimum width. Adjust as needed.
        width: '50px', // Explicitly setting the width.
        height: '50px', // Making a square button.
        borderRadius: '0%', 
        borderBottom: 3,
        borderBottomColor: TT_stats ? 'red' : 'white',
        '&:hover': {
          backgroundColor: 'transparent', // This will make the background color unchanged on hover
          boxShadow: 'none', }

      }}>
        <Iconify icon="ic:baseline-tiktok" style={{ color: 'black', width: 44, height: 44 }} />
      </Button>
    );
  };
  
  const renderYouTubeButton = () => {
    if (!influencer || influencer.handles.YT === "") return null;
  
    return (
      <Button disableRipple onClick={handleYouTubeClick} sx={{
        p: 0, // This ensures that the padding inside the button is removed.
        minWidth: '45px', // Explicitly setting a minimum width. Adjust as needed.
        width: '50px', // Explicitly setting the width.
        height: '50px', // Making a square button.
        borderRadius: '0%', 
        borderBottom: 3,
        borderBottomColor: YT_stats ? 'red' : 'white',
        '&:hover': {
          backgroundColor: 'transparent', // This will make the background color unchanged on hover
          boxShadow: 'none', // Preventing the click effect
        },
        '&:active': { 
          boxShadow: 'none',
          backgroundColor: 'transparent', // This will make the background color unchanged on active/click
        },
        // Removing the default button material touch ripple effect
        MuiTouchRipple: { 
          display: 'none', 
        }
      }}>
        <Iconify icon="mdi-youtube" style={{ color: 'black', width: 44, height: 44 }} />
      </Button>
    );
  };

  // ---------------------------------------------------------

  return (
    
    <Container>
      
      <Stack className='heading' direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h3">{influencer ? influencer.name : "loading"}</Typography>
        <Button sx={{ marginLeft:'40px' }} variant="contained" color="inherit">
            Add To List
          </Button>
      </Stack>
      
      <Stack className='divider' direction="row" spacing={2}>

        {/* PROFILE CARD */}
          
      <Card sx={{ height: 600, width: '35%' }}>

<Stack sx={{ pl: 0, mb: 0, mt: 1.2, mr: 2.6 }} direction="row" spacing={1} alignItems="right" justifyContent="space-between">

{/* SHOW EMAIL */}
<Stack direction="row" spacing={3}>
<Box border="0px solid black" width="20px" 
height="35px" borderRadius="25px" borderColor="pink"
justifyContent="center" alignItems="center" onClick={() => setShowEmail(!showEmail)}
pl={1.65} pt={0.5}><Iconify color="grey" icon={showEmail ? "material-symbols:stacked-email-outline" : "material-symbols:stacked-email"} /></Box>

{
  influencer && showEmail && (
    <Box>
      <Typography sx={{ fontFamily: "old standard tt" }}>
        {influencer.email}
      </Typography>
    </Box>
  )
}

</Stack>

{/* INFLUENCER STYLES */}
<Stack sx={{ pl: 0, mb: 0, mt: 1.2, mr: 2.6 }} direction="row" spacing={1} alignItems="right" justifyContent="right">

  {renderStyleIcon('makeup', '💄', '1.25')}
  {renderStyleIcon('skincare', '🧴', '1.2')}
  {renderStyleIcon('fashion', '👠', '1.1')}
  {renderStyleIcon('lifestyle', '🌱', '1.1')}

</Stack> 
</Stack>

<Card sx={{height: '100%', display: 'flex', boxShadow: 'none', flexDirection: 'column', alignItems: 'center'}}>

        <Card sx={{ height: 170, width: 170, mt: 0, boxShadow: 'none' }}>
        {influencer ? (
      <Box
      component="img"
      alt= "profile picture"
      src={creator_avatars[`${influencer.pentra_id}`]}
      sx={{
        top: 0,
        width: 170,
        height: 170,
        objectFit: 'cover',
        position: 'absolute',
        borderRadius: '50%', // Apply a circular clipping mask
      }}
    />) : null}
        </Card>

        {/* INFLUENCER NAME */}

        <Stack direction="row" spacing={1} mt={2.5} mb={1.5}>

        <Typography fontSize="24px"
           fontWeight={100} mt={3} mx={5} mb={2}
           fontFamily="Old Standard TT"
           cursor="pointer"
           >{influencer ? influencer.name : "loading"}
          </Typography>

          <Stack direction="row" spacing={0.5}>
          {renderSocialLink('IG', 'instagram.com', 'mdi-instagram')}
          {renderSocialLink('TT', 'tiktok.com', 'ic:baseline-tiktok')}
          {renderSocialLink('YT', 'youtube.com', 'mdi-youtube')}
            </Stack>
            </Stack>

  {renderInfluencerOffers()}

      <Stack sx={{ pl: 0, mb: 1 }} direction="row" spacing={1} alignItems="center" justifyContent="center">


  {renderGiftOption('IG_reel', 'REEL')}
  {renderGiftOption('IG_story', 'STORY')}
  {renderGiftOption('IG_post', 'POST')}
        
      </Stack>

      <Stack sx={{ pl: 0, mb: 3 }} direction="row" spacing={1} alignItems="center" justifyContent="center">

      {renderPlatformOffering('tiktok', 'TIKTOK', "ic:baseline-tiktok", 1.2)}
  {renderPlatformOffering('YT_video', 'VIDEO', "mdi-youtube", 1.33)}
  {renderPlatformOffering('other', 'OTHER', "", 2.6)} 

      
        
      </Stack>


      {/* INFLUENCER STATS */}
      <Stack sx={{ width: 40, pl: 0, mb: 2 }} direction="row" spacing={1.5} alignItems="center" justifyContent="center">
  
      {renderInstagramButton()}
      {renderTikTokButton()}
      {renderYouTubeButton()}

</Stack>


          <Stack sx={{ pl: 1.3, mb: 2 }} direction="row" spacing={5} alignItems="center" justifyContent="center">
            <Stack justifyContent="center" alignItems="center">
          <Typography fontSize="28px"
           fontWeight={100} mx={0} mb={0}
           fontFamily="Old Standard TT"
           >{followerCount}
          </Typography>
          <Typography fontSize="15px"
           fontWeight={100} mx={0} 
           fontFamily="Old Standard TT"
           >Followers
          </Typography>
          </Stack>

          <Stack justifyContent="center" alignItems="center">
          <Typography fontSize="28px"
           fontWeight={100} mx={0} mb={0}
           fontFamily="Old Standard TT"
           >{engagement}
          </Typography>
          <Typography fontSize="15px"
           fontWeight={100} mx={0} 
           fontFamily="Old Standard TT"
           >Engagement
          </Typography>
          </Stack>
        </Stack>

      
      </Card>
      
</Card>




          <Card sx={{ height: 600, width: '65%' }}>
 
          <Card sx = {{ width: '100%', height: 470}}>
     <></>

            </Card>

          <Card sx={{ width: '100%', height: '130px', bgcolor: '#fffafa', borderRadius: '0 0 4px 4px'  }}>
      {/* The Box component here works as a flex container for the content inside the Card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          '& > *': { // Targeting all immediate children of the Box
            flex: '1 0 auto', // This means "don't shrink, don't grow, and use auto basis"
          },
        }}
        
      >
          <Stack spacing={2} direction="row" justifyContent="center" alignItems="center" >
          
          

          <TextField 
      sx={{ 
        width: '80%', 
        '& .MuiOutlinedInput-root': { // targeting the outline of the input
          '& fieldset': { // targeting the fieldset element
            borderColor: 'primary.light', // assigning the color from the theme
          },
          '&:hover fieldset': {
            borderColor: 'primary.dark', // similar color manipulation for hover state
          },
          '&.Mui-focused fieldset': { // targeting the fieldset when input is focused
            borderColor: 'primary.main', // assigning a color when the field is in focus
          },
        },
      }}
      id="outlined-multiline-flexible"
      label=""
      multiline
      minRows={2}
      maxRows={3}
      variant="outlined" // ensure the variant is outlined to have a border to style
      mt={10}
    />
                    
          <Stack spacing={1}>
          
          <Button
        sx={{
          width: '42px', // Specified width
          minWidth: '90px', // Ensures the minimum width is respected
          height: '38px',
          backgroundColor: 'primary.dark',
          color: 'white',
          borderRadius: '10%',
          flexGrow: 0, // Added to prevent button growth
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
        fontSize="28px"
        fontWeight={0}
        mt={5}
        mb={2}
        fontFamily="Old Standard TT"
      >
        Send
      </Button>

                    <Stack
      direction="row"
      spacing={1}
      sx={{
        justifyContent: 'center', // Centers the content horizontally
        flexWrap: 'nowrap', // Prevents the buttons from wrapping
      }}
    >
      <Button
        sx={{
          width: '42px', // Specified width
          minWidth: '30px', // Ensures the minimum width is respected
          height: '30px',
          backgroundColor: 'white', // Set background color to white
          color: 'primary.light', // Set text color to primary color
          border: '1px solid', // Specify border thickness
          borderColor: 'primary.main', // Set border color to primary color
          borderRadius: '10%',
          flexGrow: 0, // Added to prevent button growth
          '&:hover': {
            backgroundColor: 'primary.main', // Optional: you can adjust for hover state color (lighter shade of primary color)
            // Remove the line below if you don't want to change the text color on hover
            color: 'white',
          },
        }}
        fontSize="24px"
        fontWeight={100}
        mt={5}
        mb={2}
        fontFamily="Old Standard TT"
      >
        🎁
      </Button>

      <Button
        sx={{
          width: '42px', // Specified width
          minWidth: '30px', // Ensures the minimum width is respected
          height: '30px',
          backgroundColor: 'white', // Set background color to white
          color: 'primary.main', // Set text color to primary color
          border: '1.0px solid', // Specify border thickness
          borderColor: 'primary.main', // Set border color to primary color
          borderRadius: '10%',
          flexGrow: 0, // Added to prevent button growth
          '&:hover': {
            backgroundColor: 'primary.main', // Optional: you can adjust for hover state color (lighter shade of primary color)
            // Remove the line below if you don't want to change the text color on hover
            color: 'white',
          },
        }}
        fontSize="24px"
        fontWeight={100}
        mt={5}
        mb={2}
        fontFamily="Old Standard TT"
      >
        💸
      </Button>
    </Stack>

                    </Stack>
                    </Stack>  
                    </Box>

            </Card>



          </Card>


      </Stack>
      
    </Container>
  );
}
