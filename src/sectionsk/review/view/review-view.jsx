import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Rating from '@mui/material/Rating';
import useMediaQuery from '@mui/material/useMediaQuery';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';


import { products } from 'src/_mock/products';


import { encode } from 'draft-js/lib/DraftOffsetKey';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';


// ----------------------------------------------------------------------

export default function UserPage() {

  const matches = useMediaQuery('(max-width:600px)');
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confetti, setConfetti] = useState(true);

  const [chatTheme, setChatTheme] = useState('#ccc');
  const [firmParam0, setFirmParam0] = useState('');
  const [firmName, setFirmName] = useState('');
  const [firmImage, setFirmImage] = useState('');

  const [reviewLink, setReviewLink] = useState(``);
  const [reviewPlatforms, setReviewPlatforms] = useState(``);

  const [serviceStars, setServiceStars] = useState(0);
  const [responsivenessStars, setResponsivenessStars] = useState(0);
  const [starsRequired, setStarsRequired] = useState(4); 
  const [feedback, setFeedback] = useState('');
  const [reviewStage, setReviewStage] = useState('Intro');

  useEffect(() => {

    const queryParams = new URLSearchParams(window.location.search);
    const firmParam = decodeURI(queryParams.get('firm') || 'testlawyers'); 

    const getFirmData = async () => {
      try {
        const firmDoc = await getDoc(doc(db, 'firms', firmParam));
        if (firmDoc.exists()) {
          
          await setFirmParam0(firmParam);
          console.log(firmDoc.data().FIRM_INFO.IMAGE);
          await setFirmName(firmDoc.data().FIRM_INFO.NAME);
          await setReviewLink(firmDoc.data().REVIEWS.LINKS[firmDoc.data().REVIEWS.SELECTION]);
          await setStarsRequired(firmDoc.data().REVIEWS.THRESHOLD);
          await setChatTheme(firmDoc.data().CHAT_INFO.THEME);
          await setFirmImage(firmDoc.data().FIRM_INFO.IMAGE);;
          
        } else {console.log('Error: Firm document not found.');}
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  }, []);

  const uploadReview = async (name, serviceStarsInt, responsivenessStarsInt, feedbackText) => {
    try {
      const firmDoc = doc(db, 'firms', firmParam0);
      await updateDoc(firmDoc, {
        'REVIEWS.NEW_REVIEWS': arrayUnion({
          NAME: name,
          SERVICE: serviceStarsInt,
          RESPONSIVENESS: responsivenessStarsInt,
          FEEDBACK: feedbackText,
        }),
      });
      console.log('Review uploaded');
    } catch (err) {
      console.log(err);
    }
  };


  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <>
    <Container>
    <style>@import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);</style>

    <Card sx ={(theme) => ({ height: matches ? '80px' : '105px', minWidth: '100%', position: 'fixed', display: 'flex', 
    alignItems: 'center', top: '0px', left: '0px', border: `0px solid ${theme.palette.primary.main}`, 
    borderRadius: '0px', backgroundColor: chatTheme, zIndex: '1255', })}>

      <Stack direction="row" spacing={2} sx={{width: '100%', marginLeft: matches ? '20px' : '50px',}}>
      
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '0.55px', color: 'white',
      fontWeight: 800, fontSize: '27.75px', textAlign: 'left', userSelect: 'none',}}>
          {firmName} {!matches && <>| Review Us</>}
      </Typography>

      {/* <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '-0.5px', color: 'white',
      fontWeight: 500, fontSize: '27.75px', textAlign: 'left'}}>Review Us</Typography> */}

      </Stack>
    </Card> 

    <Stack direction={matches ? "column" : "row"} sx={{ position: 'absolute', top: matches ? '110px' : '237.5px', width: '100%', left: '0%'}}>

      <Stack direction={matches ? "column" : "row"} spacing={matches ? 5.25 : 10} sx={{width: '100%', display: 'flex',
     justifyContent: 'center', alignItems: matches && 'center'}}>

      {reviewStage !== 'PostNotGood' && !matches && 
      <Card sx={{height: '285px', minWidth: '285px', backgroundColor: 'white', borderRadius: '50%',
      top: '0px', left: '0', position: 'relative', zIndex: '1251', backgroundImage: `url(${firmImage})`,
      border: `10px solid ${chatTheme}`, backgroundSize: 'cover', backgroundPosition: 'center',
      maxHeight: '285px', maxWidth: '285px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box component="img"
        src={firmImage}
        sx={{width: '105%',height: '105%',
        objectFit: 'cover',borderRadius: '50%',}}/> </Card>}



      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '-0.75px', userSelect: 'none',
        minWidth: '0px', fontWeight: 500, fontSize: matches ? '45px' : '67.75px', textAlign: matches ? 'center' : 'left', 
        paddingTop: reviewStage === 'PostNotGood' && '125px',}}>
          {reviewStage === 'Intro' && <>Let us know <br /> how we can <br /> improve</>}
          {reviewStage === 'Good' && <>Thank you! <br /> One Last <br /> Thing...</>}
          {reviewStage === 'NotGood' && <>How can we <br /> improve our <br /> service?</>}
          {reviewStage === 'PostNotGood' && <>Thank You!</>}
      </Typography>

      {reviewStage !== 'PostNotGood' && 
      <Card sx ={() => ({ border: `4px solid ${chatTheme}`, height: matches ? '270px' : 'auto', width: matches ? '300px' : '415px', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '11px',})}>
     
      <Stack direction="column" spacing={2.25} sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
      
      {reviewStage === 'Intro' && (<><Stack direction="column" spacing={1.25}>
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '0.05px',
      fontWeight: 200, fontSize: '32.75px', textAlign: 'center',}}> 
      Legal Service </Typography>

      <Rating name="star-rating" value={serviceStars}
      onChange={(event, newValue) => {setServiceStars(newValue);}}
      sx={{fontSize: '42.5px',}} /></Stack>

      <Stack direction="column" spacing={1.25}>
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '-0.25px',
      fontWeight: 500, fontSize: '32.75px', textAlign: 'center',}}> 
      Responsiveness </Typography>

      <Rating name="star-rating" value={responsivenessStars}
      onChange={(event, newValue) => {setResponsivenessStars(newValue);}}
      sx={{fontSize: '42.5px',}} /></Stack></>)}


      {reviewStage === 'Good' && (<><Stack direction="column" spacing={1.25}
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <Typography sx={{ fontFamily: "Roboto", letterSpacing: '-0.35px', fontStyle: '', userSelect: 'none',
      fontWeight: 600, fontSize: matches ? '23px' : '30.75px', textAlign: 'center', maxWidth: '80%'}}> 
      Please leave us a review.</Typography>
      <Typography sx={{ fontFamily: "Roboto", letterSpacing: '-0.95px', fontStyle: 'italic', userSelect: 'none',
      fontWeight: 500, fontSize: matches ? '24px' : '28.75px', textAlign: 'center', maxWidth: '80%'}}> 
      This takes fifteen seconds and helps us serve many more people like yourself.</Typography>
      <Rating name="star-rating" value={serviceStars} readOnly
      sx={{fontSize: matches ? '30px' : '42.5px',}} />
      </Stack></>)}

      {reviewStage === 'NotGood' && (<><Stack direction="column" spacing={1.5}
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '15px'}}>

      <Typography sx={{ fontFamily: "Roboto", letterSpacing: '-0.05px', fontStyle: '',
      fontWeight: 400, fontSize: '30.75px', textAlign: 'center', maxWidth: '90%'}}> 
      Your Feedback</Typography>
      
      <TextField id="outlined-basic" label="I would like to see..." variant="outlined" multiline
      sx={{width: '120%',}} minRows={3} value={feedback} onChange={(event) => {setFeedback(event.target.value);}}/>
      
      </Stack></>)}

      </Stack></Card>}


      </Stack>      
      
      </Stack> 

      {reviewStage !== 'PostNotGood' && 
      <Button variant="contained" disabled={serviceStars === 0 || responsivenessStars === 0}
        sx={{backgroundColor: 'black', position: 'absolute', top: matches ? '665px' : '660px', 
        fontFamily: 'DM Serif Display', fontSize: '18px', letterSpacing: '0.85px',
        padding: reviewStage === 'Good' ? '10px 20px' : '7px 15px', marginBottom: '150px',
        left: (matches && reviewStage === 'Good') ? 'calc(50% - 80px)' : 'calc(50% - 70px)', '&:hover': {backgroundColor: chatTheme, },
        boxShadow: reviewStage === 'Good' &&  '0 0 20px #faaf4d, 0 0 10px #FF00FF',}}
        onClick={() => {
        if (reviewStage === 'Intro') {
        if(serviceStars >= starsRequired) {setReviewStage('Good')} else {setReviewStage('NotGood')}}
        else if (reviewStage === 'Good') 
        { uploadReview('Not Entered', serviceStars, responsivenessStars, 'Not Inquired');
          window.open((reviewLink.startsWith('http://') || reviewLink.startsWith('https://')) ? reviewLink : `https://${reviewLink}`, '_blank')
        } else if (reviewStage === 'NotGood') {setReviewStage('PostNotGood'); uploadReview('Not Entered', serviceStars, responsivenessStars, feedback);}
        }}>

        <Iconify icon={reviewStage === 'Good' ? "mdi:heart" : "carbon:next-filled"} sx={{marginRight: '10px'}} />
        {reviewStage === 'Intro' ? 'Final Step' : ''}
        {reviewStage === 'Good' ? 'Help Us Out' : ''}
        {reviewStage === 'NotGood' ? 'Complete' : ''}
        </Button>}

    </Container >

    </>
  );
}
