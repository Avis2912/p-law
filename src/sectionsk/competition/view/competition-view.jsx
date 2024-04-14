import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import PostCard from '../post-card';

export default function ListsView() {

  const [isAddingCompetitor, setAddingCompetitor] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState('');
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [timeToUpdate, setTimeToUpdate] = useState(0);

  const [competition, setCompetition] = useState([]);


  useEffect(() => {
    const firmDatabase = collection(db, 'firms');
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setCompetition(firmDoc.data().COMPETITION || []); console.log(firmDoc.data().COMPETITION);
            const lastDateParts = firmDoc.data().WEEKLY_POSTS.LAST_DATE.split('/');
            const lastDate = new Date(`20${lastDateParts[2]}/${lastDateParts[0]}/${lastDateParts[1]}`);
            const diffDays = 7 - Math.ceil((new Date() - lastDate) / (1000 * 60 * 60 * 24));
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

  const handleNewCompetitionClick = () => {

  };

  const handleAddNewCompetitionClick = async () => {
    
    // const newListData = { listName: newList, date: formattedDate, listMembers: [1, 7, 5] };
    // try {
    //   const userDocRef = doc(db, 'brands', auth.currentUser.email);
    //   await updateDoc(userDocRef, {
    //     lists: [...brandLists, newListData]
    //   });
    //   setBrandLists(prevLists => [...prevLists, newListData]);
    //   setNewList('');
    //   setAddingList(false);
    // } catch (err) {
    //   alert(err);
    // }
  };

  return (
    <div style={{ position: 'relative',   height: '100%',  }}>
      {/* <div style={{
      borderRadius: '8px',
      position: 'absolute',
      top: 0,
      left: 20,
      right: 20,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(0px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      marginTop: '70px'
    }}>
      <span style={{
        fontFamily: "serif", fontWeight: 100,
        fontSize: '2rem',
      }}>
        Coming Soon
      </span>
    </div> */}

    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
        </style>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
        letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}> 
        Competition & Analysis</Typography>
        <Stack spacing={2} mb={0} direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2}>
            {isAddingCompetitor && (
              <>
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleAddNewCompetitionClick}
                >
                  Add
                </Button>
                <TextField
                  size="small"
                  placeholder="List Name"
                  value={newCompetitor}
                  onChange={(e) => {}}
                />
              </>
            )}
          </Stack>
          <Button variant="contained" onClick={() => {}}
          sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, cursor: 'default', fontWeight: '600'})}>
            {!isUpdateTime ? `${timeToUpdate} Days Left` : 'Report Update Coming Soon'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewCompetitionClick}
            sx={{ backgroundColor: 'black', ':hover': { backgroundColor: 'black' } }}
          >
            Add New Competitor
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
                linkedinData={value.LINKEDIN_DATA} 
                date={value.LAST_DATE} 
                blogsThisMonth={value.BLOGS_THIS_MONTH} 
                competitorName={key} 
                listId={index} 
                index={index} 
              />
            );
          }
          return null;
        })}
      </Grid>
    </Container>
    </div>
  );
}
