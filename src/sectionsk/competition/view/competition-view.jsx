import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import getCompData from 'src/data-functions/getCompData';

import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import PageTitle from 'src/components/PageTitle';
import CompetitionDialog from 'src/components/CompDialog';
import PostCard from '../post-card';

export default function ListsView() {

  const [isAddingCompetitor, setAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [timeToUpdate, setTimeToUpdate] = useState(0);

  const [competition, setCompetition] = useState([]);

  const [indexedBlogs, setIndexedBlogs] = useState();
  const [indexedJobs, setIndexedJobs] = useState([
    { TITLE: 'Campaign Manager', VIA: 'via ZipRecruiter', LOCATION: 'Dallas, TX', TYPE: 'Full Time', POSTED: 'A Month Ago', LINK: 'hi.com' },
    { TITLE: 'Political Consultant', VIA: 'via Indeed', LOCATION: 'San Francisco, CA', TYPE: 'Part Time', POSTED: '2 Weeks Ago', LINK: 'hello.com' },
    { TITLE: 'Fundraising Coordinator', VIA: 'via Glassdoor', LOCATION: 'New York, NY', TYPE: 'Full Time', POSTED: '3 Days Ago', LINK: 'hey.com' },
    { TITLE: 'Public Relations Specialist', VIA: 'via LinkedIn', LOCATION: 'Chicago, IL', TYPE: 'Contract', POSTED: 'Yesterday', LINK: 'howdy.com' },
    { TITLE: 'Policy Analyst', VIA: 'via Monster', LOCATION: 'Los Angeles, CA', TYPE: 'Full Time', POSTED: 'A Week Ago', LINK: 'greetings.com' },
  ]);
  const [reviews, setReviews] = useState([
    { NAME: 'John Doe', DATE: '18 June 2024', RATING: 5, REVIEW: 'Great service, very professional.', PFP: 'https://www.w3schools.com/w3images/avatar2.png' },
    { NAME: 'Jane Doe', DATE: '18 June 2024', RATING: 4, REVIEW: 'Good service, very professional.', PFP: 'https://www.w3schools.com/w3images/avatar2.png' },
    { NAME: 'John Smith', DATE: '18 June 2024', RATING: 3, REVIEW: 'Okay service, professional.', PFP: 'https://www.w3schools.com/w3images/avatar2.png' },
    { NAME: 'Jane Smith', DATE: '18 June 2024', RATING: 2, REVIEW: 'Bad service, unprofessional.', PFP: 'https://www.w3schools.com/w3images/avatar2.png' },
    { NAME: 'John Johnson', DATE: '18 June 2024', RATING: 1, REVIEW: 'Terrible service, very unprofessional.', PFP: 'https://www.w3schools.com/w3images/avatar2.png' },
  ]);
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
            await setIndexedBlogs(firmDoc.data().BLOG_DATA.BIG_BLOG || []); 
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

        {isDialogOpen2 && <CompetitionDialog isDialogOpen={isDialogOpen2} handleClose={handleClose2} firmName='Raval Trial Law' />}

        <PageTitle title="Competition Analysis" />

        <Stack spacing={2} mb={2} direction="row" alignItems="center" justifyContent="space-between">

          <Button variant="contained" onClick={() => {}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600', '&:hover': { backgroundColor: theme.palette.primary.navBg, },})}>
            {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Report Update Coming Soon'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleAddNewCompetitionClick}
            sx={{ backgroundColor: 'black', ':hover': { backgroundColor: 'black' } }}
          >
            Add New
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={3}>
        {Object.entries(competition).map(([key, value], index) => {
          if (typeof value === 'object' && value !== null) {
            return (
              <PostCard 
                key={index} 
                traffic={value.TRAFFIC} 
                linkedinData={value.ORG} 
                orgData={value.ORG}
                // jobData={value.JOBS}
                jobData={indexedJobs}
                reviewData={reviews}
                indexedBlogs={value.RECENT_BLOGS}
                rankingFor={value.RANKING_FOR} 
                competitorName={value.NAME} 
                siteLink={value.COMP_SITE}
                listId={index} 
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
