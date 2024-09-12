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
import { Icon } from '@iconify/react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from 'src/firebase-config/firebase';
// eslint-disable-next-line import/no-relative-packages
import { integrateWp } from '../../functions/src/WpFunctions/testIntegration';


export default function CompetitionDialog ({
  isDialogOpen, handleClose, firmName }) {

  const [error, setError] = React.useState(null);

  const [competitorName, setCompetitorName] = React.useState('');
  const [competitorSite, setCompetitorSite] = React.useState('');
  const [competitorBlogPage, setCompetitorBlogPage] = React.useState('');

  const addCompetitor = async () => {

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
      Add a Competitior</Typography>

      <TextField label="Competitor Name"  placeholder="https://johnlawyers.com" size="large"
      sx={{width: '82.25%', marginBottom: '25px', borderRadius: '0px', }} 
      value={competitorName} onChange={(e) => {setCompetitorName(e.target.value)}}/> 

      <Stack direction="row" spacing={3} sx={{width: '92%', marginBottom: '25px', display: 'flex', alignItems: 'center'}}>
      <TextField label="Competitor Website" placeholder="john@johnlawyers.com" size="large" 
      sx={{width: '100%', marginBottom: '25px', borderRadius: '0px', }} value={competitorSite} onChange={(e) => {setCompetitorSite(e.target.value)}}
      /> <Tooltip title="Your competitor's home page's URL.">
  <div>
    <Iconify icon="material-symbols:help" sx={{height: '24px', minWidth: '24px', color: 'gray',}}/>
  </div>
</Tooltip></Stack>

      <Stack direction="row" spacing={3} sx={{width: '92%', marginBottom: '25px', display: 'flex', alignItems: 'center'}}>
      <TextField label="Competitor Blog Page" placeholder="https://johnlawyers.com/blog" size="large" 
      sx={{width: '100%', marginBottom: '25px', borderRadius: '0px', }} value={competitorBlogPage} onChange={(e) => {setCompetitorBlogPage(e.target.value)}}
      /> <Tooltip title="Your competitor's main blog page. Used to get competitor blogs.">
  <div>
    <Iconify 
      icon="material-symbols:help" 
      sx={{height: '24px', minWidth: '24px', color: 'gray', }}
    />
  </div>
</Tooltip> </Stack>

      <Button variant="contained" onClick={() => {addCompetitor()}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      marginTop: '35px', width: 'auto', display: 'flex', justifyContent: 'center', minHeight: '40px' })}>
        <Iconify icon="line-md:circle-filled-to-confirm-circle-filled-transition" sx={{height: '16px', minWidth: '16px', 
        color: 'white', marginRight: '8px'}}/>
        Add Competitor
      </Button>

    </Card>
  </Dialog>
  
)};

CompetitionDialog.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  firmName: PropTypes.string,
};

