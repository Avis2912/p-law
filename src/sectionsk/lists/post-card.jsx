import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { CardActionArea } from '@mui/material';

// import { deleteList } from './view/delete-function'

import { fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';

import { db } from 'src/firebase-config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

export default function PostCard({ listName, date, listId, post, index }) {
  const { title, createdAt } = post;

  const latestPostLarge = index === -10;
  const latestPost = index === -10 || index === -20;

  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = async () => {
    setDeleteConfirmation(false);
  };

  const handleDeleteConfirmed = () => {
    // Handle the delete action here
    setDeleteConfirmation(false);
    try {deleteList(listId);} catch (err) {alert(err)};
  };

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      fontSize="17.5px"
      fontFamily=""
      fontWeight="100"
      sx={{
        height: 54,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        marginTop: 1.5,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h3', height: 60 }),
        ...(latestPost && { color: 'common.white' }),
      }}
    >
      {listName}
    </Link>
  );

  const renderDate = (
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        marginTop: 1.5,
        color: 'text.disabled',
        ...(latestPost && { opacity: 0.48, color: 'common.white' }),
      }}
    >
      {date}
    </Typography>
  );

  


  const deleteList = async () => {
  const listDoc = doc(db, 'lists', listId);
  try {
    await deleteDoc(listDoc);
  } catch (err) {
    alert(err);
  } 
  return Date.now();
 };

  const cardClick = async () => {
    window.location.href = `/listnames?listId=${listId}&listName=${listName}`;
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 3 : 3} >
      <Card sx={{ height: 140 }}>
      <CardActionArea  sx={{ mt: -5.5, height: 200}} onClick={() => cardClick()}>
          
          <Box 
            sx={{
              mt: 0,
              p: (theme) => theme.spacing(0.0, 2.5, 0, 2.5),
              ...((latestPostLarge || latestPost) && {
                width: 1,
                bottom: 0,
                position: 'absolute',
              }),
            }}
          >

            <Stack sx={{ mt: 0, height: 20 }} />
            {renderTitle}
            <Stack
              direction="row"
              flexWrap="none"
              spacing={1}
              justifyContent="space-between"
              sx={{
                mt: 3,
                color: 'text.disabled',
                width: '100%',
                textAlign: 'right',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* <Iconify
                width={20}
                icon="fluent:delete-28-regular"
                sx={{ mr: 0.5, cursor: 'pointer' }}
                onClick={handleDeleteClick}
              /> */}
              {renderDate}
            </Stack>
          </Box>
        </CardActionArea>
      </Card>
      <Dialog open={deleteConfirmation} onClose={handleCloseDeleteConfirmation}>
        <DialogContent sx={{ mr: 1.2, mt: 1, }}>
          <Typography fontWeight="500">Are you sure you want to delete this list?
        </Typography>
        </DialogContent>
        <DialogActions>
        <Button sx={{ mb: 1,}} onClick={handleDeleteConfirmed} color="primary">
            Yes
          </Button>
          <Button sx={{ mb: 1, mr: 25.5 }} onClick={handleCloseDeleteConfirmation} color="primary">
            No
          </Button>
          
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
  date: PropTypes.any,
  listId: PropTypes.any,
  listName: PropTypes.string,
};
