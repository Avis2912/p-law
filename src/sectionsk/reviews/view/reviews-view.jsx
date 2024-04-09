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

import { users } from 'src/_mock/user';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';


import { products } from 'src/_mock/products';



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

  const [engagement, setEngagement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [styles, setStyles] = useState([]);
  
  const [starsNeeded, setStarsNeeded] = useState(5);
  const [reviewPlace, setReviewPlace] = useState(1);
  const [reviewLink, setReviewLink] = useState(`www.pentra.club/review?firm=w&mtx`);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setReviews(firmDoc.data().REVIEWS);
          } else {
            console.log('Error: Firm document not found.');
          }}
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  }, []);


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

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>

    <Stack sx={{ mb: 3.5 }} justifyContent="space-between" direction="row" alignItems="center">
      <style>@import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);</style>
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}> 
        Invite Clients To Review</Typography>
      <Stack direction="row" spacing={2}>
      <Button target="_blank" href="https://tally.so/r/mBxLkR" variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}
      sx={(theme)=>({backgroundColor: theme.palette.primary.navBg })} >
       Request Platform</Button> 
      <Button variant="contained" startIcon={<Iconify icon="carbon:save" />}
        sx={(theme)=>({backgroundColor: theme.palette.primary.navBg })}>
        Save Changes</Button>
      </Stack> </Stack>


    <Stack direction="column" spacing={2.25}>


    <Card sx ={(theme) => ({ height: '110px', width: '100%', border: `4px solid ${theme.palette.primary.main}`})}>
        <Stack direction="row" sx ={{ justifyContent: 'center', alignItems: 'center', height: '100%',
      width: '100%', }} spacing={2}>

        <Typography variant="subtitle3" fontSize="24.25px" position="" left="67.5px" 
      letterSpacing="0.45px" fontWeight="400" fontFamily="DM Serif Display">🎉 Shareable Link</Typography>
      <TextField size="small" variant="outlined" sx={{ fontSize: '35px',
      right: '0px', width: '325px', bottom: '0px', borderRadius: '0px'}} value={reviewLink}/>
        <Stack direction="row" spacing={2}>
        <Button variant="contained" startIcon={<Iconify icon="prime:copy" />} onClick={() => navigator.clipboard.writeText(reviewLink)}
        sx={(theme)=>({backgroundColor: theme.palette.primary.navBg, right: '0px', height: '40px'})}>
           Copy Link</Button>
        <Button variant="contained" sx={(theme)=>({backgroundColor: theme.palette.primary.main, right: '0px', height: '40px', maxWidth: '20px',
        justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '0px'})} onClick={()=> window.open(`http://${reviewLink}`, '_blank')}><Iconify icon="mingcute:external-link-line" /></Button>
        <Button variant="contained" sx={(theme)=>({backgroundColor: theme.palette.primary.main, right: '0px', height: '40px', maxWidth: '20px',
        justifyContent: 'center', alignItems: 'center', display: 'flex', padding: '0px'})}><Iconify icon="ic:round-info" /></Button>
        </Stack></Stack>
       </Card> 


    <Stack direction="row" spacing={2.25}>
     <Card sx ={(theme) => ({ height: 'auto', width: '70%', border: `4px solid ${theme.palette.primary.lighter}`,  })}>
      <Stack
        direction="column"
        spacing={0}>

        <Card sx ={{ height: '100px', backgroundColor: "white", display: 'flex', justifyContent: 'center',
      borderRadius: '0px', borderBottomWidth: '3px', borderColor: 'black', alignItems: 'center' }}>
      <Iconify icon="simple-icons:googlemybusiness" position="absolute" left="30px" width="22.5px" height="22.5px"/>
      <Typography variant="subtitle2" fontSize="20px" position="absolute" left="67.5px" 
      fontFamily='' letterSpacing="-0.4px" fontWeight="400"> Google Reviews </Typography>
      <TextField label="Firm Review Page Link" size="small" variant="outlined" sx={{position: "absolute", 
      right: '147.5px', width: '310px', bottom: '29px', borderRadius: '0px'}}/>
        <Button variant="contained" startIcon={<Iconify icon="fluent:link-multiple-24-filled" />}
        sx={(theme)=>({backgroundColor: reviewPlace === 1 ? theme.palette.primary.navBg : theme.palette.primary.main ,
        position: "absolute", right: '30px', height: '40px'})} onClick={()=>{setReviewPlace(1)}}>
           Select</Button> </Card>

           <Card sx ={{ height: '100px', backgroundColor: "white", display: 'flex', justifyContent: 'center',
      borderRadius: '0px', borderBottomWidth: '4px', borderColor: 'black', alignItems: 'center' }}>
      <Iconify icon="simple-icons:googlemybusiness" position="absolute" left="30px" width="22.5px" height="22.5px"/>
      <Typography variant="subtitle2" fontSize="20px" position="absolute" left="67.5px" 
      fontFamily='' letterSpacing="-0.4px" fontWeight="400"> Super Lawyers </Typography>
      <TextField label="Firm Review Page Link" size="small" variant="outlined" sx={{position: "absolute", 
      right: '147.5px', width: '310px', bottom: '29px', borderRadius: '0px'}}/>
        <Button variant="contained" startIcon={<Iconify icon="fluent:link-multiple-24-filled" />}
        sx={(theme)=>({backgroundColor: reviewPlace === 2 ? theme.palette.primary.navBg : theme.palette.primary.main ,
        position: "absolute", right: '30px', height: '40px'})} onClick={()=>{setReviewPlace(2)}}>
           Select</Button> </Card>

           <Card sx ={{ height: '100px', backgroundColor: "white", display: 'flex', justifyContent: 'center',
      borderRadius: '0px', borderBottomWidth: '4px', borderColor: 'black', alignItems: 'center' }}>
      <Iconify icon="simple-icons:googlemybusiness" position="absolute" left="30px" width="22.5px" height="22.5px"/>
      <Typography variant="subtitle2" fontSize="20px" position="absolute" left="67.5px" 
      fontFamily='' letterSpacing="-0.4px" fontWeight="400"> Find Law USA </Typography>
      <TextField label="Firm Review Page Link" size="small" variant="outlined" sx={{position: "absolute", 
      right: '147.5px', width: '310px', bottom: '29px', borderRadius: '0px'}}/>
        <Button variant="contained" startIcon={<Iconify icon="fluent:link-multiple-24-filled" />}
        sx={(theme)=>({backgroundColor: reviewPlace === 3 ? theme.palette.primary.navBg : theme.palette.primary.main ,
        position: "absolute", right: '30px', height: '40px'})} onClick={()=>{setReviewPlace(3)}}>
           Select</Button> </Card>

           <Card sx ={{ height: '100px', backgroundColor: "white", display: 'flex', justifyContent: 'center',
      borderRadius: '0px', borderBottomWidth: '4px', borderColor: 'black', alignItems: 'center' }}>
      <Iconify icon="simple-icons:googlemybusiness" position="absolute" left="30px" width="22.5px" height="22.5px"/>
      <Typography variant="subtitle2" fontSize="20px" position="absolute" left="67.5px" 
      fontFamily='' letterSpacing="-0.4px" fontWeight="400"> Lawyers.com </Typography>
      <TextField label="Firm Review Page Link" size="small" variant="outlined" sx={{position: "absolute", 
      right: '147.5px', width: '310px', bottom: '29px', borderRadius: '0px'}}/>
        <Button variant="contained" startIcon={<Iconify icon="fluent:link-multiple-24-filled" />}
        sx={(theme)=>({backgroundColor: reviewPlace === 4 ? theme.palette.primary.navBg : theme.palette.primary.main ,
        position: "absolute", right: '30px', height: '40px'})} onClick={()=>{setReviewPlace(4)}}>
           Select</Button> </Card>

      </Stack>
      </Card>
      
      
      <Card sx ={(theme) => ({ border: `4px solid ${theme.palette.primary.lighter}`, height: 'auto', width: '30%', display: 'flex', justifyContent: 'center', alignItems: 'center'})}>
      <Typography sx={{ fontFamily: "DM Serif Display", letterSpacing: '-0.75px',  fontWeight: 500, fontSize: '32.75px', textAlign: 'center',
      position: "absolute", top: "70px", width: "200px"}}> 
                {"Invite To Leave Review "}
        <span style={{ fontStyle: 'italic', fontWeight: '200' }}> Only If </span></Typography>

      <Select
        value={starsNeeded}
        onChange={(event) => setStarsNeeded(event.target.value)}
        sx={{position: 'absolute', bottom: '120px', height: '38px', width: '150px'}}
      >
        <MenuItem value={5}>⭐⭐⭐⭐⭐</MenuItem>
        <MenuItem value={4}>⭐⭐⭐⭐ +</MenuItem>
        <MenuItem value={3}>⭐⭐⭐ +</MenuItem>
        <MenuItem value={2}>⭐⭐ +</MenuItem>
        <MenuItem value={1}>⭐ +</MenuItem>
      </Select>

        <Button variant="contained" startIcon={<Iconify icon="carbon:save" />}
        sx={(theme)=>({backgroundColor: theme.palette.primary.navBg, position: 'absolute', bottom: '65px' })}>
        Save Changes</Button>
      </Card>

      

      </Stack> </Stack>    
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
    </>
  );
}
