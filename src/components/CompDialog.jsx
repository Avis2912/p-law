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

import { collection, getDocs, getDoc, updateDoc, doc } from "firebase/firestore"; 
import { db, auth } from 'src/firebase-config/firebase';

import getCompData from 'src/data-functions/getCompData';

export default function CompetitionDialog ({
  isDialogOpen, handleClose }) {

  const [error, setError] = React.useState(null);

  const [competitorName, setCompetitorName] = React.useState('');
  const [competitorSite, setCompetitorSite] = React.useState('');
  const [competitorBlogPage, setCompetitorBlogPage] = React.useState('');

  const addCompetitor = async () => {
    if (!competitorName || !competitorSite) { 
      setError('Please fill out all fields.'); 
      return;
    }  
    handleClose();

    try {
      const firmDatabase = collection(db, 'firms');
      const data = await getDocs(firmDatabase);
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      const firmDoc = data.docs.find((docc) => docc.id === userDoc.data().FIRM);

      if (firmDoc) {  
        const firmDocRef = doc(db, 'firms', firmDoc.id);
        const competition = firmDoc.data().COMPETITION.COMPETITION || [];

        const compData = await getCompData(competitorSite);

        const newCompetitor = {
          NAME: competitorName,
          COMP_SITE: competitorSite,
          ...compData
        };

        const existingIndex = competition.findIndex(item => item.COMP_SITE === competitorSite || item.COMP_SITE.includes(competitorSite));

        if (existingIndex !== -1) {
          competition[existingIndex] = newCompetitor;
        } else {
          competition.push(newCompetitor);
        }

        await updateDoc(firmDocRef, { "COMPETITION.COMPETITION": competition });
        console.log('Competitor added/updated successfully');
      } else {
        console.error('Firm document does not exist');
      }
    } catch (err) {
      console.error('Error updating competitor data:', err);
    }
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
          Add a Competitior
        </Typography>

        <TextField label="Competitor Name"  placeholder="John Lawyers" size="large"
          sx={{width: '82.25%', marginBottom: '20px', borderRadius: '0px', }} 
          value={competitorName} onChange={(e) => {setCompetitorName(e.target.value)}}/> 

        <Stack direction="row" spacing={3} sx={{width: '92%', marginBottom: '25px', display: 'flex', alignItems: 'center'}}>
          <TextField label="Competitor Website" placeholder="https://johnlawyers.com" size="large" 
            sx={{width: '100%', marginBottom: '25px', borderRadius: '0px', }} value={competitorSite} onChange={(e) => {setCompetitorSite(e.target.value)}}
          /> 
          <Tooltip title="Your competitor's home page's URL.">
            <div>
              <Iconify icon="material-symbols:help" sx={{height: '24px', minWidth: '24px', color: 'gray',}}/>
            </div>
          </Tooltip>
        </Stack>

        <Button variant="contained" onClick={() => {addCompetitor()}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
          marginTop: '25px', width: 'auto', display: 'flex', justifyContent: 'center', minHeight: '40px' })}>
          <Iconify icon="line-md:circle-filled-to-confirm-circle-filled-transition" sx={{height: '16px', minWidth: '16px', 
          color: 'white', marginRight: '8px'}}/>
          Add Competitor
        </Button>

      </Card>
    </Dialog>
  );
}

CompetitionDialog.propTypes = {
  isDialogOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};