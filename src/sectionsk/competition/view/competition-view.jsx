import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Creating from 'src/components/Creating';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import PageTitle from 'src/components/PageTitle';
import CompetitionDialog from 'src/components/CompDialog';
import PostCard from '../comp-card';

export default function ListsView() {

  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [timeToUpdate, setTimeToUpdate] = useState(0);

  const [competition, setCompetition] = useState([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [planName, setPlanName] = useState('');
  const updateDays = 31;

  useEffect(() => {
    const firmDatabase = collection(db, 'firms');
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setPlanName(firmDoc.data().SETTINGS.PLAN);
            await setCompetition(firmDoc.data().COMPETITION.COMPETITION || []);
            const lastDateParts = firmDoc.data().COMPETITION.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = updateDays - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= 1) {await setTimeToUpdate(diffDays)} else {setIsUpdateTime(true);} 
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

    getFirmData();
  }, []);

  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`;

  const handleOpen = () => {setIsDialogOpen(true);};
  const handleClose = () => {setIsDialogOpen(false);};
  const handleOpen2 = () => {setIsDialogOpen2(true);};
  const handleClose2 = () => {setIsDialogOpen2(false);};

  const handleAddNewCompetitionClick = async () => {
    if (isAddingCompetitor) {return;}
    handleOpen2(true);
  };

  const fetchCompetitorData = async () => {
    competition.map(async (competitor) => {
      if (competition.COMP_SITE) {
        console.log('Fetching data for:', competitor.COMP_SITE);
      } else {console.log ('NO SITE for this competitor');}
    });
  }

  return (
    <div style={{ position: 'relative',   height: '100%',  }}>

    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
        </style>

        {isDialogOpen2 && <CompetitionDialog isDialogOpen={isDialogOpen2} handleClose={handleClose2} firmName='Raval Trial Law'
        competition={competition} setCompetition={setCompetition} isAddingCompetitor={isAddingCompetitor} setIsAddingCompetitor={setIsAddingCompetitor} />}

        <PageTitle title="Competition Analysis" />

        <Stack spacing={2} mb={2} direction="row" alignItems="center" justifyContent="space-between">

          <Button variant="contained" onClick={() => {}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600', '&:hover': { backgroundColor: theme.palette.primary.navBg, },})}>
            {!isUpdateTime ? `Updated This Week` : 'Report Updates Soon'}
          </Button>

          <Button
            variant="contained"
            startIcon={<Iconify icon={isAddingCompetitor ? "line-md:loading-loop" : "eva:plus-fill"} />}
            onClick={handleAddNewCompetitionClick}
            sx={{ backgroundColor: isAddingCompetitor ? '#333131' : 'black', ':hover': { backgroundColor: 'black' } }}
          >
            {isAddingCompetitor ? `Adding Competitor` : `Add New`}
          </Button>

          <Button variant="contained" onClick={() => {}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.blue, cursor: 'default', fontWeight: '600', '&:hover': { backgroundColor: theme.palette.primary.blue, },})}>
            Beta
          </Button>
        </Stack>
      </Stack>

      {/* {isUpdateTime && <Creating text='Updating Competitor Data' imgUrl='https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-10-23%20at%208.24.40%E2%80%AFPM.png?alt=media&token=5ab083be-c894-4927-8148-5521749c3861' />} */}

      <Grid container spacing={3}>
        {Object.entries(competition).map(([key, value], index) => {
          if (typeof value === 'object' && value !== null) {
            if (value.isReplacing) {
              return (
                <PostCard 
                key={index} 
                traffic={0} 
                orgData={[]}
                jobData={[]}
                adData={[]}
                spendData='$0'
                reviewData={[]}
                indexedBlogs={[]}
                rankingFor={{}} 
                competitorName={value.NAME} 
                siteLink={value.COMP_SITE}
                listId={0} 
                isReplacing
                setCompetition={setCompetition}
                index2={index} 
              />
              )
            }
            return (
              <PostCard 
                key={index} 
                traffic={value.TRAFFIC.TRAFFIC} 
                orgData={[]}
                jobData={value.JOBS}
                adData={value.ADS.ADS}
                spendData={value.ADS.SPEND}
                reviewData={value.REVIEWS}
                indexedBlogs={value.BLOGS}
                rankingFor={value.TRAFFIC.RANKING_FOR} 
                competitorName={value.NAME} 
                siteLink={value.COMP_SITE}
                listId={index} 
                isReplacing={false}
                setCompetition={setCompetition}
                index2={index} 
              />
            );
          }
          return null;
        })}
      </Grid>
    </Container>

    <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.05px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        This Will Need A Plan</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '35px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        Competition Analysis is <i>incredibly</i> expensive<br /> 
        for Pentra to perform. Consequently, we are <br /> 
        able to offer it only on a paid plan. If things <br /> 
        change, you&apos;ll be the first to find out. <br /> 
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

    </div>
  );
}
