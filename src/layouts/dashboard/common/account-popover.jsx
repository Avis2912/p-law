import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import PropTypes from 'prop-types';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// import { account } from 'src/_mock/account';

import { signOut } from "firebase/auth";
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    path: '/',
  },
  {
    label: 'My Profile',
    icon: 'eva:person-fill',
    path: '/account',
  },

];

// ----------------------------------------------------------------------

export default function AccountPopover() {

  const [profileSrc, setProfileSrc] = useState('https://firebasestorage.googleapis.com/v0/b/pentra-beauty.appspot.com/o/Gemini_Generated_Image_w2bk6ew2bk6ew2bk.jpeg?alt=media&token=555ce545-de49-4e1f-becf-9b985933a117');
  const [firmName, setFirmName] = useState('N/A');
  const location = useLocation();

  useEffect(() => {
    const firmDatabase = collection(db, 'firms');
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setFirmName(firmDoc.data().FIRM_INFO.NAME); 
            await setProfileSrc(firmDoc.data().FIRM_INFO.IMAGE); 
          } else {
            alert('Error: Firm document not found.');
          }
        } else {
          alert('Error: User document not found.');
        }
      } catch (err) {
        console.log(err);
      }
    };
    setTimeout(getFirmData, 2000);
  }, []);

  
  const account = {

    displayName: auth.currentUser // ? auth.currentUser.email.split('@')[0].charAt(0).toUpperCase() + auth.currentUser.email.split('@')[0].slice(1)
    ? firmName: 'N/A',
    email: auth.currentUser ? auth?.currentUser?.email : 'N/A',
    photoURL: profileSrc,
    
  };
  
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = (event) => {
    setOpen(null);
  };

  const handleMenuClick = (path) => {
   // handleClose();
    window.location.href = path;
  };


  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };
 
  return (
    location.pathname !== '/review' && (
      <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 34,
          height: 34,
          background: (theme) => alpha(theme.palette.grey[900], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={account.photoURL}
          alt={account.displayName}
          sx={{
            width: 36,
            height: 36,
            marginBottom: '2.5px',
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {account.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.displayName}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={() => handleMenuClick(option.path)}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={logout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>   
    )
  )
}
