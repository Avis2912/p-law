import { db, auth } from 'src/firebase-config/firebase';
import { useState, useEffect } from 'react';
import { getDocs, getDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import Confetti from 'react-confetti';

import PageTitle from 'src/components/PageTitle';
import { encode } from 'draft-js/lib/DraftOffsetKey';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {

  const isReviewsDone = false;
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confetti, setConfetti] = useState(false);

  const [engagement, setEngagement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [styles, setStyles] = useState([]);
  
  const [starsNeeded, setStarsNeeded] = useState(5);
  const [reviewLink, setReviewLink] = useState(``);

  const [newReviews, setNewReviews] = useState([]);
  const [links, setLinks] = useState({1: '', 2: '', 3: '', 4: ''});
  const [selectedPlatform, setSelectedPlatform] = useState(1);

  const [firmName, setFirmName] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAddedImg, setIsAddedImg] = useState(false);

  const reviewPlatforms = ['Google Reviews', 'Super Lawyers', 'Lawyers.com', 'Find Law USA'];


  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setLinks(firmDoc.data().REVIEWS.LINKS); console.log(firmDoc.data().REVIEWS.LINKS);
            await setSelectedPlatform(firmDoc.data().REVIEWS.SELECTION);
            await setStarsNeeded(firmDoc.data().REVIEWS.THRESHOLD);
            await setNewReviews(firmDoc.data().REVIEWS.NEW_REVIEWS);
            await setFirmName(firmDoc.data().FIRM_INFO.NAME);
            await setReviewLink(`www.pentra.club/review?firm=${encodeURIComponent(firmDoc.data().FIRM_INFO.NAME)}`);
          } else {
            console.log('Error: Firm document not found.');
          }}
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  }, []);

  const saveChanges = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDoc.exists()) {
        const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
        const firmRef = doc(db, 'firms', firmDoc.id);
        if (firmDoc.exists()) {
          console.log('UPDATED1');
          await updateDoc(firmRef, {
            'REVIEWS.LINKS': links,
            'REVIEWS.SELECTION': selectedPlatform,
            'REVIEWS.THRESHOLD': starsNeeded,
          });
        console.log('UPDATED');
        setConfetti(true); setTimeout(() => setConfetti(false),5000); 
        } else {
        console.log('Error: Firm document not found.');
        }
      }
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

  const handleChangePage = (event, newPage) => {setPage(newPage);};

  const handleChangeRowsPerPage = (event) => {
    setPage(0); setRowsPerPage(parseInt(event.target.value, 10));
  };

  const dataFiltered = applyFilter({
    inputData: users, comparator: getComparator(order, orderBy), filterName,
  });

  const handleOpen = () => {setIsDialogOpen(true);};
  const handleClose = () => {setIsDialogOpen(false);};

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
    <Container>

    <Stack sx={{ mb: 1.5 }} justifyContent="space-between" direction="row" alignItems="center">
      <style>@import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);</style>
      
      <PageTitle title="Invite Clients To Review"/>

      <Stack direction="row" spacing={2} mb={2}>
      <Button target="_blank" href="https://tally.so/r/mBxLkR" variant="contained" startIcon={<Iconify icon="streamline:business-card-solid" sx={{height: '18.5px'}}/>}
      sx={(theme)=>({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, }})} >
       Request Platform</Button> 
       <Button variant="contained" onClick={() => {setIsDialogOpen(true);}}
      sx={(theme)=>({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="tabler:star-filled" sx={{minHeight: '15.0px', minWidth: '15.0px', 
        color: 'white', marginRight: '8px'}}/>
        How It Works
      </Button>
      {confetti && <Confetti />}
      </Stack> 
      
      </Stack>

    <Stack direction="column" spacing={2.25}>


    <Card sx ={(theme) => ({ height: '110px', width: '100%', borderRadius: '11px', 
    border: `4px solid ${theme.palette.primary.main}`})}>
        <Stack direction="row" sx ={{ justifyContent: 'center', alignItems: 'center', height: '100%',
      width: '100%', }} spacing={2}>

        <Typography variant="subtitle3" fontSize="24.25px" position="" left="67.5px" 
      letterSpacing="0.45px" fontWeight="400" fontFamily="DM Serif Display">🎉 Shareable Link</Typography>
      <TextField size="small" variant="outlined" sx={{ fontSize: '35px',
      right: '0px', width: '390px', bottom: '0px', borderRadius: '0px'}} value={reviewLink}/>
        <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<Iconify icon="prime:copy" />} onClick={() => {navigator.clipboard.writeText(reviewLink); setIsCopied(true);}}
        sx={(theme)=>({backgroundColor: theme.palette.primary.navBg, right: '0px', height: '40px', '&:hover': {backgroundColor: isCopied ? theme.palette.primary.navBg : `` }})}>
           {isCopied ? `Link Copied` : `Copy Link`}</Button>
        <Button variant="contained" sx={(theme)=>({backgroundColor: theme.palette.primary.main, right: '0px', height: '40px', maxWidth: '20px',
        justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '0px'})} onClick={()=> window.open(`http://${reviewLink}`, '_blank')}><Iconify icon="mingcute:external-link-line" /></Button>
        {/* <Button variant="contained" sx={(theme)=>({backgroundColor: theme.palette.primary.main, right: '0px', height: '40px', maxWidth: '20px',
        justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '0px'})}><Iconify icon="ic:round-info" /></Button> */}
        </Stack></Stack>
    </Card> 


    <Stack direction="row" spacing={2.25} >
     <Card sx ={(theme) => ({ height: 'auto', width: '70%', borderRadius: '11px',
     border: `4px solid ${theme.palette.primary.lighter}`,  })}>
      <Stack
        direction="column"
        spacing={0}>

        {reviewPlatforms.map((platform, index) => (
          <Card key={index} sx={{ height: '100px', backgroundColor: "white", display: 'flex', justifyContent: 'center',
            borderRadius: '0px', borderBottomWidth: '3px', borderColor: 'black', alignItems: 'center' }}>
            {/* <Iconify icon="streamline:business-card-solid" position="absolute" left="30px" width="23.75px" height="23.75px" color="#474444"/>
            <Typography variant="subtitle2" fontSize="19px" position="absolute" left="65.0px" color="#474444"
            fontFamily='' letterSpacing="-0.425px" fontWeight="400"> {platform} </Typography> */}
            <Button variant="contained" startIcon={<Iconify icon="streamline:business-card-solid" />}
            sx={(theme)=>({backgroundColor: selectedPlatform === index + 1 ? theme.palette.primary.navBg : theme.palette.primary.main, justifyContent: 'left',
            left: '27.5px', width: '165px', height: '40px', position: "absolute", '&:hover': { backgroundColor: theme.palette.primary.navBg },
            borderRadius: '7.5px', boxShadow: 'none'})}
            onClick={()=>{setSelectedPlatform(index+1)}}>
               {platform}</Button>
            <TextField value={links[index+1]} label="Firm Review Page" size="small" variant="outlined" sx={{position: "absolute", 
            right: '152.5px', width: '328px', top: '29px', borderRadius: '0px'}}
            onChange={(e) => {const newLinks = {...links}; newLinks[index+1] = e.target.value; setLinks(newLinks);}}/>
            <Button variant="contained" startIcon={<Iconify icon="fluent:link-multiple-24-filled" />}
            sx={(theme)=>({backgroundColor: selectedPlatform === index + 1 ? theme.palette.primary.navBg : theme.palette.primary.main ,
            position: "absolute", right: '30px', height: '40px', '&:hover': { backgroundColor: selectedPlatform === index+1 ? theme.palette.primary.navBg : `` }})}
            onClick={()=>{setSelectedPlatform(index+1)}}>
               Select</Button>
          </Card>
        ))}

      </Stack>
      </Card>
      
      
      <Card sx ={(theme) => ({ border: `4px solid ${theme.palette.primary.lighter}`, height: 'auto', width: '30%', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '11px',})}>
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '-0.75px',  fontWeight: 500, fontSize: '32.75px', textAlign: 'center',
      position: "absolute", top: "70px", width: "200px"}}> 
                {"Invite To Leave Review "}
        <span style={{ fontStyle: 'italic', fontWeight: '200' }}> Only If </span></Typography>

      <Select
        value={starsNeeded}
        onChange={(event) => setStarsNeeded(event.target.value)}
        sx={{position: 'absolute', top: '245px', height: '38px', width: '150px'}}
      >
        <MenuItem value={5}>⭐⭐⭐⭐⭐</MenuItem>
        <MenuItem value={4}>⭐⭐⭐⭐ +</MenuItem>
        <MenuItem value={3}>⭐⭐⭐ +</MenuItem>
        <MenuItem value={2}>⭐⭐ +</MenuItem>
        <MenuItem value={1}>⭐ +</MenuItem>
      </Select>

        <Button variant="contained" startIcon={<Iconify icon="carbon:save" />}
        sx={(theme)=>({top: '300px', backgroundColor: theme.palette.primary.navBg, position: 'absolute',
        '&:hover': {backgroundColor: theme.palette.primary.navBg } })}
        onClick={saveChanges}>
        Save Changes</Button>
      </Card>

      </Stack> </Stack>  


    {newReviews.length === 0 && <Card sx ={(theme) => ({ height: '100px', width: '100%', borderRadius: '7.5px', 
      border: `1px solid ${theme.palette.primary.main}`, mt: 2.25, })}>
      <Stack direction="row" sx ={{ justifyContent: 'center', alignItems: 'center', height: '100%',
      width: '100%', }} spacing={2}>

        <Typography variant="subtitle3" fontSize="24.25px" position="" left="67.5px" userSelect="none"
      letterSpacing="0.45px" fontWeight="400" fontFamily="DM Serif Display">No Reviews Collected Yet</Typography>

      </Stack>
    </Card>}

    {newReviews.length > 0 && <Card sx ={(theme) => ({ height: '100px', width: '100%', borderRadius: '7.5px', 
      border: `1px solid ${theme.palette.primary.main}`, mt: 2.25, })}>
      <Stack direction="row" sx ={{ justifyContent: 'center', alignItems: 'center', height: '100%',
      width: '100%', }} spacing={2}>

        <Typography variant="subtitle3" fontSize="24.25px" position="" left="67.5px" userSelect="none"
      letterSpacing="0.45px" fontWeight="400" fontFamily="DM Serif Display">Reviews Collected Yet</Typography>
      
      </Stack>
    </Card>}
    </Container >













    {isReviewsDone && <Container sx={{ mt: 2.5 }}>
      {/* <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
        letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}> 
        Reviews Thus far</Typography>
      </Stack> */}

      <div style={{ position: 'relative' }}>
      <div style={{
      borderRadius: '50px',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10
    }}>
      <span style={{
        fontFamily: "'Old Standard TT', serif",
        fontSize: '2rem',
        color: 'black'
      }}>
        Coming Soon
      </span>
    </div>

      <Card>
      
      {/* <Stack sx={{ py: 2.5, px: 2.5 }}direction="row" spacing={1.6} alignItems="center">
        <ProductSearch posts={products} />
      
        <ProductSort onChange={values => setLocations(values)} values={[]}/>
<FollowerSort onChange={values => setFollowers(values)} values={[]}/>
<PlatformSort onChange={values => setPlatforms(values)} values = {[]}/>
<EngagementSort onChange={values => setEngagement(values)} values={[]}/>
<StyleSort onChange={values => setStyles(values)} values={[]}/>

          <Button variant="contained" color="inherit" >
          Search: 258 results
          </Button>
          

        </Stack> */}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'IG_handle', label: 'Instagram Handle', align: 'left' },
                  { id: 'followers', label: 'Followers' },
                  { id: 'platforms', label: 'Platforms' },
                  { id: 'country', label: 'Country', align: 'center' },
                  { id: 'engagement', label: 'Engagement' },
                  { id: 'engagement', label: 'Views' },
                  { id: 'email', label: 'Email' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      IG_handle={row.IG_handle}
                      platforms={`${row?.platforms[0] === true && "IG"}${row?.platforms[1] === true ? " TT" : ""}${row?.platforms[2] === true ? " YT" : ""}`}
                      engagement={row.engagement}
                      followers={row.followers}
                      avatarUrl={row.avatarUrl}
                      country={row.country}
                      email={row.email}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => handleClick(event, row.name)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      </div>
    </Container>}
    <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '650px', minWidth: '1000px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '500px', height: '650px', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Inviting Clients To Review You</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '35px',
        letterSpacing: '-0.35px',  fontWeight: 500, fontSize: '24.75px'}}> 
        1. Send client your Pentra link<br /> 
        2. We ask them for a quick rating <br /> 
        3. If it is a strong rating, we invite <br /> 
        &nbsp;&nbsp;&nbsp;them to leave a full review on <br />
        &nbsp;&nbsp;&nbsp;your chosen platform <br /> 
        4. If not, we only have them elaborate <br /> 
        &nbsp;&nbsp;&nbsp;so you can see what went wrong<br /> 
        </Typography>
        </Card>
        <Card sx={(theme) => ({ width: '525px', height: '650px', backgroundColor: theme.palette.primary.navBg, 
        borderRadius: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          <img src="https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-04-26%20at%202.32.38%E2%80%AFPM.png?alt=media&token=0b6b571f-e8bb-49be-be60-a4d32e79814c" 
          style={{height: '600px', width: '465px', borderRadius: '4px'}} alt=""/>
        </Card>
      </Dialog>

    </>
  );
}
