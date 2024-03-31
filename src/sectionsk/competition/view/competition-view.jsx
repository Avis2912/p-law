import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Iconify from 'src/components/iconify';
import { useState, useEffect } from 'react';

import PostCard from '../post-card';

export default function ListsView() {
  const [brandLists, setBrandLists] = useState([]);
  const [isAddingList, setAddingList] = useState(false);
  const [newList, setNewList] = useState('');


  useEffect(() => {
    const brandsData = collection(db, 'brands');

  const getBrandLists = async () => {
    try {
      const data = await getDocs(brandsData);
      const userDoc = data.docs.find(docc => docc.id === auth.currentUser.email);
      if (userDoc) {
        setBrandLists(userDoc.data().lists || []);
      } else {
        alert('Error: User document not found.');
      }
    } catch (err) {
      alert(err);
    }
  };
    getBrandLists();
  }, []);

  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString('default', { month: 'short' })}`;

  const handleNewListClick = () => {
    setAddingList(!isAddingList);
  };

  const handleAddListClick = async () => {
    const newListData = { listName: newList, date: formattedDate, listMembers: [1, 7, 5] };

    try {
      const userDocRef = doc(db, 'brands', auth.currentUser.email);
      await updateDoc(userDocRef, {
        lists: [...brandLists, newListData]
      });
      setBrandLists(prevLists => [...prevLists, newListData]);
      setNewList('');
      setAddingList(false);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div style={{ position: 'relative',   height: '100%',  }}>
      <div style={{
      borderRadius: '8px',
      position: 'absolute',
      top: 0,
      left: 20,
      right: 20,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      marginTop: '70px'
    }}>
      <span style={{
        fontFamily: "'Old Standard TT', serif",
        fontSize: '2rem',
        color: 'black'
      }}>
        Coming Soon
      </span>
    </div>

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
            {isAddingList && (
              <>
                <Button
                  variant="contained"
                  color="inherit"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={handleAddListClick}
                >
                  Add
                </Button>
                <TextField
                  size="small"
                  placeholder="List Name"
                  value={newList}
                  onChange={(e) => setNewList(e.target.value)}
                />
              </>
            )}
          </Stack>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewListClick}
            sx={{ backgroundColor: 'black', ':hover': { backgroundColor: 'black' } }}
          >
            Add New Competitor
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={3}>
        {brandLists.map((list, index) => (
          <PostCard key={index} date={list.date} listMembers={list.listMembers} listName={list.listName} title post={list} index={index} />
        ))}
      </Grid>
    </Container>
    </div>
  );
}
