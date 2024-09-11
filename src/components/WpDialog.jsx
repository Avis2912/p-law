import React from 'react';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from 'src/firebase-config/firebase';
// eslint-disable-next-line import/no-relative-packages
import { integrateWp } from '../../functions/src/WpFunctions/testIntegration';


export default function WpDialog ({ wpUrl, setWpUrl, wpUsername, setWpUsername, wpPassword, setWpPassword,
  isDialogOpen, handleClose, isWpIntegrated, setIsWpIntegrated, firmName }) {

  const [error, setError] = React.useState(null);

  const fetchWpDetails = async () => {
    const docRef = doc(db, "firms", firmName);
    const docSnap = await getDoc(docRef);

  if (docSnap.exists() && docSnap.data().WORDPRESS) {
      console.log("WP data:", docSnap.data().WORDPRESS);
      await setIsWpIntegrated(docSnap.data().WORDPRESS.IS_INTEGRATED);
      setWpUrl(docSnap.data().WORDPRESS.SITE);
      setWpUsername(docSnap.data().WORDPRESS.USER);
      setWpPassword(docSnap.data().WORDPRESS.APP_PASSWORD);
    } else {
      console.log("No WP document!");
      await updateDoc(docRef, {
        WORDPRESS: {
          IS_INTEGRATED: false,
          SITE: '',
          USER: '',
          APP_PASSWORD: ''
        }
      });
      setIsWpIntegrated(false);
    }
  };

  React.useEffect(() => {
    fetchWpDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmName]);


  const integrateFunc = async () => {
    const docRef = doc(db, "firms", firmName);
    if (!wpUrl || !wpUsername || !wpPassword) {
      setError('Please enter all details');
      setTimeout(() => setError(null), 2000);
      return;
    }

    const response = await integrateWp(wpUsername, wpPassword, wpUrl);
    console.log('IntegrateWP Response in dialog: ', response);
    if (!response || response.status === 401 || response.status === 400) {
      setError('Invalid Credentials. Please contact us if this persists.');
      setTimeout(() => setError(null), 2000);
      return;
    }

    await updateDoc(docRef, {
      WORDPRESS: {
        IS_INTEGRATED: true,
        SITE: wpUrl,
        USER: wpUsername,
        APP_PASSWORD: wpPassword
      }
    });

    setWpUrl(wpUrl);
    setWpUsername(wpUsername);
    setWpPassword(wpPassword);

    setIsWpIntegrated(true);
    handleClose();
  };


  return (

  <Dialog open={isDialogOpen} onClose={handleClose} 
  PaperProps={{ style: { minHeight: '350px', minWidth: '620px', display: 'flex', flexDirection: "row", } }}>
      
    <Snackbar open={error} autoHideDuration={2000} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity="error" sx={{ width: '100%', paddingRight: 3, }}>
        {error}
      </Alert>
    </Snackbar>
   
    <Card sx={{ width: '100%', minHeight: '100%', backgroundColor: 'white', borderRadius: '0px',
    padding: '55px', paddingTop: '45px' }}>

      <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
      letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
      Integrate WordPress</Typography>

      <TextField label="Your Website URL"  placeholder="https://johnlawyers.com" size="large"
      sx={{width: '82.25%', marginBottom: '25px', borderRadius: '0px', }} 
      value={wpUrl} onChange={(e) => setWpUrl(e.target.value)}/> 

      <Stack direction="row" spacing={3} sx={{width: '92%', marginBottom: '25px', display: 'flex', alignItems: 'center'}}>
      <TextField label="Your WP Username / Email" placeholder="john@johnlawyers.com" size="large" 
      sx={{width: '100%', marginBottom: '25px', borderRadius: '0px', }} value={wpUsername} onChange={(e) => setWpUsername(e.target.value)}
      /> <Tooltip title="You can generate an application password from your WordPress account settings">
  <div>
    <Iconify icon="material-symbols:help" sx={{height: '24px', minWidth: '24px', color: 'gray',}}/>
  </div>
</Tooltip></Stack>

      <Stack direction="row" spacing={3} sx={{width: '92%', marginBottom: '25px', display: 'flex', alignItems: 'center'}}>
      <TextField label="Your Application Password" placeholder="Enter your WordPress URL" size="large" 
      sx={{width: '100%', marginBottom: '25px', borderRadius: '0px', }} value={wpPassword} onChange={(e) => setWpPassword(e.target.value)}
      /> <Tooltip title="You can generate an application password from your WordPress account settings">
  <div>
    <Iconify 
      icon="material-symbols:help" 
      sx={{height: '24px', minWidth: '24px', color: 'gray', cursor: 'pointer'}}
      onClick={() => {window.open('https://www.youtube.com/watch?v=bsz6hb1EUMY', '_blank')}}
    />
  </div>
</Tooltip> </Stack>

      <Button variant="contained" onClick={() => {integrateFunc();}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minHeight: '40px' })}>
        <Iconify icon="dashicons:wordpress" sx={{height: '16px', minWidth: '16px', 
        color: 'white', marginRight: '8px'}}/>
        Connect Your Website
      </Button>

    </Card>
  </Dialog>
  
)};

WpDialog.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  isWpIntegrated: PropTypes.bool,
  setIsWpIntegrated: PropTypes.func,
  firmName: PropTypes.string,
  wpUrl: PropTypes.string,
  setWpUrl: PropTypes.func,
  wpUsername: PropTypes.string,
  setWpUsername: PropTypes.func,
  wpPassword: PropTypes.string,
  setWpPassword: PropTypes.func,
};

