import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useRef, useState, useEffect } from 'react';
import { posts } from 'src/_mock/lists';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box'

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage, deleteObject, uploadString } from 'firebase/storage'; // Import necessary Firebase Storage functions


import Iconify from 'src/components/iconify';

import PostCard from '../post-card';
import PostSort from '../post-sort';
import PostSearch from '../post-search';

// ----------------------------------------------------------------------



export default function AccountView() {

  const [profileSrc, setProfileSrc] = useState(null); // state for profile image
  const fileInputRef = useRef(); // reference to the file input

  const [brand, setBrand] = useState();

  const [userName, setUserName] = useState(brand ? brand.user_name : null);
  const [brandName, setBrandName] = useState(brand ? brand.brand_name : null);
  const [giftMessage, setGiftMessage] = useState(brand ? brand.messages.gift : null);
  const [sponsorMessage, setSponsorMessage] = useState(brand ? brand.messages.sponsor : null);
  const [defaultMessage, setDefaultMessage] = useState(brand ? brand.messages.default : null);

  const [userData, setUserData] = useState([]);

  const storage = getStorage();
  

  useEffect(() => {
    const firmDatabase = collection(db, 'firms');
    const getFirmData = async () => {
      try {
        const data = await getDocs(firmDatabase);
        const userDoc = data.docs.find((docc) => docc.id === 'testlawyers');
        if (userDoc) {
          await setUserData(userDoc.data().FIRM_INFO || []); console.log(userDoc.data().FIRM_INFO);
        } else {
          alert('Error: User document not found.');
        }
      } catch (err) {
        console.log(err);
      }
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

    // if (fileInputRef.current?.files[0]) {await uploadProfilePicture();}

    const userDocRef = doc(db, 'brands', auth.currentUser.email);
    const updateData = {};

    if (userName !== null) {
      updateData.user_name = userName;
    }

    if (brandName !== null) {
      updateData.brand_name = brandName;
    }

    if (giftMessage !== null) {
      updateData.messages.gift = giftMessage;
    }

    // if (sponsorMessage !== null) {
    //   updateData.messages.sponsor = sponsorMessage;
    // }

    // if (defaultMessage !== null) {
    //   updateData.messages.default = defaultMessage;
    // }

    await updateDoc(userDocRef, updateData);

    window.location.href = '/'; // or use your routing logic here

  } catch (err) {
    console.error("Error updating document:", err);
    console.log('Error: Unable to save changes.');
  }
}

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
          
      <Card sx={{ height: 600, width: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
      <Card sx={{ height: 210, width: 210, mt: 10, boxShadow: 'none' }}>
            
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
        // alt="profile picture"
        // src={profileSrc}
        src="https://firebasestorage.googleapis.com/v0/b/pentra-beauty.appspot.com/o/Gemini_Generated_Image_w2bk6ew2bk6ew2bk.jpeg?alt=media&token=555ce545-de49-4e1f-becf-9b985933a117"
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
      sx={{ width: '45%', mt: 2, textAlign: 'center', fontFamily: 'Old Standard TT' }}
      id="standard-multiline-flexible"
      label=""
      multiline
      maxRows={1}
      size="small"
      placeholder="Location / State"
      defaultValue={brand ? brand.brand_name : null}
      onChange={(e) => setBrandName(e.target.value)}
      value={userData.NAME} />

      <Typography fontSize="20px" fontWeight={100} mt={3} mb={1.75} fontFamily="Old Standard TT">
        Current Pentra Plan
      </Typography>


      <Button variant="contained" color="primary" onClick={() => alert("please Email us at pentra.legal@gmail.com! We'll get back to you ASAP.")}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg})}>
      {userData.PLAN} | Change Plan
      </Button>

    </Card>

    <Card sx={{ height: 600, width: '65%' }}>

      <style>
        @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
      </style>

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={5} mx={5} mb={2}
      fontFamily="DM Serif Display">
      Firm Description
      </Typography>

      <TextField 
      sx = {{ marginLeft:'38px', width:'89%' }}
      id="outlined-multiline-flexible"
      label=""
      multiline
      minRows={3}
      maxRows={3}
      onChange={(e) => setGiftMessage(e.target.value)}
      defaultValue={userData.DESCRIPTION} />

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={3} mx={5} mb={2}
      fontFamily="DM Serif Display">
      Indexed Blogs
      </Typography>

      <TextField 
      sx = {{ marginLeft:'38px', width:'89%' }}
      id="outlined-multiline-flexible"
      label=""
      multiline
      minRows={8}
      width="50%"
      onChange={(e) => setSponsorMessage(e.target.value)}
      defaultValue={brand ? brand.messages.sponsor : null} />

      <Stack direction="row" spacing={2} mb={2.5} mt={4} pl={5} justifyContent="space-between" alignItems="center" >

      <Typography fontSize="24px" letterSpacing={0.25}
      fontWeight={100} mt={3} mx={5} mb={2} 
      fontFamily="DM Serif Display">
      Current Model
      </Typography>

      <Stack direction="row" pr={4} spacing={2} justifyContent="left" alignItems="center" >
      <Button variant="contained" color="primary" onClick={() => alert("please Email us at pentra.legal@gmail.com! We'll get back to you ASAP.")}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg})}>
      Pentra Light </Button>

      <Button variant="contained" color="primary" onClick={() => alert("please Email us at pentra.legal@gmail.com! We'll get back to you ASAP.")}
      sx={(theme) => ({backgroundColor: `#DD8390`})}>
      Pentra Medium </Button>

      <Button variant="contained" color="primary" onClick={() => alert("please Email us at pentra.legal@gmail.com! We'll get back to you ASAP.")}
      sx={(theme) => ({backgroundColor: '#DD8390'})}>
      Pentra Opus </Button>

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

      </Stack>
    </Container>
  );
}
