import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
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

  const [profileSrc, setProfileSrc] = useState('/assets/images/avatars/avatar_4.jpg');
  const [firmName, setFirmName] = useState('hi');

  useEffect(() => {
    const firmDatabase = collection(db, 'firms');
    const getFirmData = async () => {
      try {
        const data = await getDocs(firmDatabase);
        const userDoc = data.docs.find((docc) => docc.id === 'testlawyers');
        if (userDoc) {
          await setFirmName(userDoc.data().FIRM_INFO.NAME); 
          await setProfileSrc(userDoc.data().FIRM_INFO.IMAGE); 
        } else {
          alert('Error: User document not found.');
        }
      } catch (err) {
        console.log(err);
      }};
    getFirmData();
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
  );
}
