import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import Divider from '@mui/material/Divider';

import { usePathname } from 'src/routes/hooks';
import RouterLink from 'src/routes/components/router-link';

import { useResponsive } from 'src/hooks/use-responsive';
import { useLocation } from 'react-router-dom';

// import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {

  const [profileSrc, setProfileSrc] = useState('https://firebasestorage.googleapis.com/v0/b/pentra-beauty.appspot.com/o/Gemini_Generated_Image_w2bk6ew2bk6ew2bk.jpeg?alt=media&token=555ce545-de49-4e1f-becf-9b985933a117');
  const [firmName, setFirmName] = useState('N/A');
  const location = useLocation();

  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setFirmName(firmDoc.data().FIRM_INFO.NAME); 
            await setProfileSrc(firmDoc.data().FIRM_INFO.IMAGE); 
          }}
      } catch (err) {
        console.log(err);
      }
    };
    setTimeout(getFirmData, 2000);
    }, []);

  // Define the account object for the user
  const account = {
    displayName: auth.currentUser // ? auth.currentUser.email.split('@')[0].charAt(0).toUpperCase() + auth.currentUser.email.split('@')[0].slice(1)
    ? firmName : 'N/A',
    email: auth.currentUser ? auth?.currentUser?.email : 'N/A',
    photoURL: profileSrc,
  };


  const pathname = usePathname();

  const upLg = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderAccount = (
    <Box
      sx={{
        my: 2.25,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />

      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle3" sx={{color: 'white', fontWeight: '700'}}>
          {account.displayName}</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {account.role}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
<Stack component="nav" spacing={1} sx={{ px: 2 }}>
  {navConfig.map((item, index) => (
<React.Fragment key={item.title}>
  <NavItem item={item} sx={index === 3 ? { marginBottom: '50px' } : {}} />
      {/* {index === 3 && 
        <Divider sx={{ 
          width: '30%', 
          marginLeft: '280px', 
          position: 'absolute',
          borderColor: 'grey', 
          top: '388px',
          left: '34.0px',
        }} 
        />} */}
    </React.Fragment>
  ))}
</Stack>
  );

  const renderUpgrade = (
    <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
      {/* <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
        <Box
          component="img"
          src="/assets/illustrations/illustration_avatar.png"
          sx={{ width: 100, position: 'absolute', top: -50 }}
        />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6">Upgrade to Pro</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            From only $69
          </Typography>
        </Box>

        <Button
          href="https://material-ui.com/store/items/minimal-dashboard/"
          target="_blank"
          variant="contained"
          color="inherit"
        >
          Upgrade to Pro
        </Button>
      </Stack> */}
    </Box>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 3.25, userSelect: 'none'}} />

      {renderAccount}

      {renderMenu}

      <Box sx={{ flexGrow: 1 }} />

      {renderUpgrade}
    </Scrollbar>
  );

  return (
    location.pathname !== '/review' && (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: 1.00 * NAV.WIDTH },
        backgroundColor: 'primary.navBg',
        position: 'relative',
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: 0.955 * NAV.WIDTH,
            marginLeft: 0.00225 * NAV.WIDTH,
            marginTop: 0.00715 * NAV.WIDTH,
            // marginTop: 0.01495 * NAV.WIDTH,
            // borderRight: (theme) => `dashed 0.5px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  ));
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();

  const active = item.path === pathname;

  return (
    <ListItemButton
      component={RouterLink}
      href={item.path}
      sx={{
        minHeight: 48,
        borderRadius: 0.75,
        width: '96%',
        left: '5.5px',
        paddingLeft: '12px',
        typography: 'body2',
        color: 'primary.white',
        textTransform: 'capitalize',
        fontWeight: 'fontWeightMedium',
        transition: 'ease 0.3s',
        ...(active && {
          color: 'primary.navBg',
          fontWeight: '700',
          bgcolor: (theme) => alpha(theme.palette.grey[300], 0.925),
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.grey[300], 1),
          },
        }),
      }}
    >
      <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
        {item.icon}
      </Box>

      <Box component="span">{item.title} </Box>
    </ListItemButton>
  );
}

NavItem.propTypes = {
  item: PropTypes.object,
};
