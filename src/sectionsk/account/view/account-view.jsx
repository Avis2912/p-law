import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { posts } from 'src/_mock/lists';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage, deleteObject, uploadString } from 'firebase/storage'; // Import necessary Firebase Storage functions
import { List, ListItem, ListItemText } from '@mui/material';


import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------



export default function AccountView() {

  const [profileSrc, setProfileSrc] = useState(null); // state for profile image
  const fileInputRef = useRef(); // reference to the file input
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [isDialogOpen2, setIsDialogOpen2] = useState(false); 
  const [brand, setBrand] = useState();

  const [userName, setUserName] = useState(brand ? brand.user_name : null);
  const [brandName, setBrandName] = useState(brand ? brand.brand_name : null);
  const [firmDescription, setFirmDescription] = useState("");
  const [indexedBlogs, setIndexedBlogs] = useState(["hey", "whats good", "hi", "ok", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]);

  const [userData, setUserData] = useState([]);
  const [selectedModel, setSelectedModel] = useState(2);
  const [imagesSettings, setImagesSettings] = useState('All');
  const [imagePfp, setImagePfp] = useState('');
  const [planName, setPlanName] = useState('');

  const storage = getStorage();
  const navigate = useNavigate(); 

  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setUserData(firmDoc.data().FIRM_INFO || []);
            await setFirmDescription(firmDoc.data().FIRM_INFO.DESCRIPTION || '');
            await setSelectedModel(firmDoc.data().SETTINGS.MODEL || 2);
            await setPlanName(firmDoc.data().SETTINGS.PLAN || '');
            await setImagePfp(firmDoc.data().FIRM_INFO.IMAGE || '');
            await setIndexedBlogs(firmDoc.data().BLOG_DATA.BIG_BLOG || {});
          } else {
            console.log('Error: Firm document not found.');
          }
        } 
      } catch (err) {console.log(err);}
    };
    getFirmData();
  }, []);


//   const handleImageUpload = async () => {
//   if (fileInputRef.current.files[0]) {
//     const file = fileInputRef.current.files[0];
    
//     // Create a storage reference
//     const storageRef = ref(storage, `brands/${auth.currentUser.email}`);
    
//     // Upload the file
//     await uploadBytes(storageRef, file);
    
//     // After upload, if you wish to set the new image URL to profileSrc state
//     const downloadURL = await getDownloadURL(storageRef);
//     setProfileSrc(downloadURL);
//   }
// }

const uploadProfilePicture = async () => {
  try {
    // Upload the profile image to Firebase Storage
    const storageRef = ref(storage, `brands/${auth.currentUser.email}/${auth.currentUser.email}`); // Setting the image name to user's email

    // Check if image already exists and delete it
    const previousImageRef = ref(storage, `brands/${auth.currentUser.email}/${auth.currentUser.email}`);
    await deleteObject(previousImageRef).catch(error => {
      // Handle any errors
      if (error.code !== 'storage/object-not-found') {
        console.error("Error deleting previous profile image:", error);
        throw error;
      }
    });

    await uploadString(storageRef, profileSrc, 'data_url');

    // After uploading, get the download URL for the uploaded image
    const imageURL = await getDownloadURL(storageRef);

    // Update Firestore's user document with the image URL (Optional, based on your requirement)
    const userDocRef = doc(db, 'brands', auth.currentUser.email);
    await updateDoc(userDocRef, {
      profileImage: imageURL
    });

  } catch (err) {
    console.log(err);
  }
}

const saveChanges = async () => {
  try {

    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
    const firmDocRef = doc(db, 'firms', userDoc.data().FIRM); 
    const updateData = {
      'SETTINGS.MODEL': selectedModel,
      'SETTINGS.IMAGES': imagesSettings,
      'FIRM_INFO.DESCRIPTION': firmDescription,
    };

    await updateDoc(firmDocRef, updateData); 
    navigate('/');

  } catch (err) {console.error("Error updating document:", err);}
}

  const handleClose = () => {setIsDialogOpen(false);};
  const handleClose2 = () => {setIsDialogOpen2(false);};

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileSrc(e.target.result);
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  

  return (
    
    <Container>
      
      <Stack className='heading' direction="row" alignItems="center" justifyContent="space-between" mb={2.5}>
      
      <style>
          @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
        </style>

      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
      letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}>         
      My Account</Typography>

      <Button onClick={() => saveChanges()}
      sx={{ marginLeft:'40px' }} variant="contained" color="inherit">
      🎉 Save Changes
      </Button>

      </Stack>
      
      <Stack className='divider' direction="row" spacing={2}>
          
      <Card sx={{ height: 615, width: '35%', display: 'flex', 
      flexDirection: 'column', alignItems: 'center', borderRadius: '11px' }}>
        
      <Card sx={{ height: 210, width: 210, mt: 9.525, boxShadow: 'none' }}>
            
      <input type="file"
      ref={fileInputRef}
      onChange={handleImageChange}
      style={{ display: 'none' }}
      accept="image/*"/>


    <Box 
    position="relative" 
    width={210} 
    height={210}
    onClick={handleUploadClick}
    cursor="pointer"
    sx={{
      borderRadius: '50%', // Apply a circular clipping mask
    }}>

    <Box 
        component="img"
        src={imagePfp}
        sx={{
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            borderRadius: '50%',
            backgroundColor: 'pink',
        }}
    />
    

      {/* <Iconify icon="solar:camera-bold" 
      sx={{ width: 30, height: 30, position: 'absolute', top: '87%', left: '83%',
      transform: 'translate(-50%, -50%)', color: 'grey', }} /> */}

    </Box>
        
    </Card>

      <TextField
      sx={{ width: '45%', mt: 4, textAlign: 'center', fontFamily: 'Old Standard TT' }}
      id="standard-multiline-flexible"
      label=""
      multiline
      maxRows={1}
      size="small"
      placeholder="Firm Name"
      defaultValue={brand ? brand.user_name : null}
      onChange={(e) => setUserName(e.target.value)}
      value={userData.NAME}
      />

    <TextField
      sx={{ width: '45%', mt: 2, mb: 2, textAlign: 'center', fontFamily: 'Old Standard TT' }}
      id="standard-multiline-flexible"
      label=""
      multiline
      maxRows={1}
      size="small"
      placeholder="HQ Location / State"
      defaultValue={brand ? brand.brand_name : null}
      onChange={(e) => setBrandName(e.target.value)}
      value={userData.LOCATION} />

      {/* <Button variant="contained" color="primary" onClick={() => alert("please Email us at pentra.legal@gmail.com! We'll get back to you ASAP.")}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg})}>
      Use Free Use Images
      </Button> */}

      <Typography fontSize="19px" fontWeight={100} mt={3} mb={1.75} fontFamily="DM Serif Display">
        Current Pentra Plan
      </Typography>


      <Button variant="contained" color="primary" onClick={() => setIsDialogOpen2(true)}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg})}>
      {planName} | Change Plan
      </Button>


    </Card>

    <Card sx={{ height: 615, width: '65%', borderRadius: '11px' }}>

      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={4.5} mx={5} mb={2}
      fontFamily="DM Serif Display">
      Firm Description
      </Typography>

      <TextField 
      sx = {{ marginLeft:'38px', width:'89%' }}
      id="outlined-multiline-flexible"
      label=""
      multiline
      minRows={3} maxRows={3}
      onChange={(e) => setFirmDescription(e.target.value)}
      defaultValue={firmDescription} />

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={3} mx={5} mb={2}
      fontFamily="DM Serif Display">
      Indexed Blogs
      </Typography>

      <List sx={{ width: '100%', height: '170px', maxWidth: '575px',
        bgcolor: 'white', overflow: 'auto', border: '0.1px solid #c2c1c0',
        marginLeft: '38px',borderRadius: '7px',
        paddingTop: '0px', paddingBottom: '0px',}}>

      {indexedBlogs.map((blog, index) => (
        <ListItem 
          key={index} 
          sx={{ borderBottom: indexedBlogs.length > 3 ? (index !== indexedBlogs.length - 1 && '0.1px solid #c2c1c0') : '0.1px solid #c2c1c0'
          , justifyContent: 'space-between'}}>          
          <ListItemText primary={blog.TITLE} sx={{fontWeight: '900'}}/>
          <Button variant="contained" color="primary" sx={(theme) => ({height: '27px', width: '28px', 
          backgroundColor: theme.palette.primary.navBg, marginLeft: '30px',
          borderRadius: '5px', fontSize: '14px'})} onClick={() => {
            const url = blog.LINK.startsWith('http://') || blog.LINK.startsWith('https://') ? blog.LINK : `http://${blog.LINK}`;
            window.open(url, '_blank');
          }}><Iconify icon="fluent:link-multiple-24-filled" /></Button>
        </ListItem>
      ))}

      </List>

      {/* <Stack direction="row" spacing={2} mb={0} mt={3.5} pl={5} justifyContent="space-between" alignItems="center" >

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={0} mx={5} mb={0} 
      fontFamily="DM Serif Display">
      Contact Link
      </Typography>

      </Stack> */}


      <Stack direction="row" spacing={2} mb={2.5} mt={5} pl={5} justifyContent="space-between" alignItems="center" >

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={3.25} mx={5} mb={2} 
      fontFamily="DM Serif Display">
      Image Options
      </Typography>

      <Stack direction="row" pr={4} spacing={2} justifyContent="left" alignItems="center" >
        <Button variant="contained" 
          onClick={() => {setImagesSettings('Free')}}
          sx={(theme) => ({backgroundColor: imagesSettings === 'Free' ? theme.palette.primary.navBg : '#DD8390'})}>
          Use Free Use Images Only
        </Button>

        <Button variant="contained" 
          onClick={() => setImagesSettings('All')}
          sx={(theme) => ({backgroundColor: imagesSettings === 'All' ? theme.palette.primary.navBg : '#DD8390'})}>
          Use All Web Images
        </Button>
      </Stack></Stack>


      <Stack direction="row" spacing={2} mb={2.5} mt={2.75} pl={5} justifyContent="space-between" alignItems="center" >

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={3} mx={5} mb={2} 
      fontFamily="DM Serif Display">
      Current Model
      </Typography>

      <Stack direction="row" pr={4} spacing={2} justifyContent="left" alignItems="center" >
        <Button variant="contained" 
          onClick={() => {setSelectedModel(1);}}
          sx={(theme) => ({backgroundColor: selectedModel === 1 ? theme.palette.primary.navBg : '#DD8390'
        , '&hover': {backgroundColor: 'yellow'}})}>
          Pentra Light 
        </Button>

        <Button variant="contained" 
          onClick={() => {setSelectedModel(2);}}
          sx={(theme) => ({backgroundColor: selectedModel === 2 ? theme.palette.primary.navBg : '#DD8390'})}>
          Pentra Balanced 
        </Button>

        <Button variant="contained" 
          onClick={() => planName !== 'Trial Plan' && setSelectedModel(3) || setIsDialogOpen(true)}
          sx={(theme) => ({backgroundColor: selectedModel === 3 ? theme.palette.primary.navBg : '#DD8390'})}>
          Pentra Ultra 
        </Button>
      </Stack></Stack>

      {/* <Typography fontSize="24px"
        fontWeight={100} mt={3} mx={5} mb={2}
        fontFamily="Old Standard TT"
        >🖋️  Default Message
      </Typography>
      
      <TextField 
      sx = {{ marginLeft:'38px', width:'89%' }}
      id="outlined-multiline-flexible"
      label=""
      multiline
      minRows={3}
      maxRows={3}
      onChange={(e) => setDefaultMessage(e.target.value)}
      defaultValue={brand ? brand.messages.default : null} /> */}

      </Card>


      <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Please Move To A Plan</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '33.5px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        The Pentra Ultra model is incredibly <br /> 
        expensive for us to run. Consequently, we  <br /> 
        are able to offer it only on a paid plan.
        </Typography>
        <Button variant="contained" onClick={() => {}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', cursor: 'default'})}>
        <Iconify icon="ic:email" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Reach out to us at pentra.hub@gmail.com
      </Button>
        </Card>
      </Dialog>

      <Dialog open={isDialogOpen2} onClose={handleClose2} 
      PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Pentra Full Suite</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '33.5px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        Please email us with a request for a plan. <br /> 
        We&apos;re quick to respond and will send you  <br /> 
        options that best fit {userData.NAME}.<br /> 
        </Typography>
        <Button variant="contained" onClick={() => {}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', cursor: 'default'})}>
        <Iconify icon="ic:email" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Reach out to us at pentra.hub@gmail.com
      </Button>
        </Card>
      </Dialog>



      </Stack>
    </Container>
  );
}
