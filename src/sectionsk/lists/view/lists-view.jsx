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
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h3">My Lists</Typography>
        <Stack spacing={2} mb={2} direction="row" alignItems="center" justifyContent="space-between">
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
            color="primary"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={handleNewListClick}
          >
            New List
          </Button>
        </Stack>
      </Stack>
      <Grid container spacing={3}>
        {brandLists.map((list, index) => (
          <PostCard key={index} date={list.date} listMembers={list.listMembers} listName={list.listName} title post={list} index={index} />
        ))}
      </Grid>
    </Container>
  );
}
