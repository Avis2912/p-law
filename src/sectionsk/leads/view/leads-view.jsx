import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// import Circle from '../sample-circle';

import { users } from 'src/_mock/user';
import { Box, TextField, Avatar } from '@mui/material';

import { db, auth } from 'src/firebase-config/firebase';
import { getDocs, getDoc, addDoc, collection, doc, updateDoc } from 'firebase/firestore';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import PageTitle from 'src/routes/components/PageTitle';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UserPage() {
  
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [texts, setTexts] = useState([
    {assistant: "No User Conversation Created."},
  ]);

  const [firmName, setFirmName] = useState("You");
  const [isUsingChatbot, setIsUsingChatbot] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            const leadsData = firmDoc.data().LEADS || [];
            setLeads(leadsData);  
            setFirmName(firmDoc.data().FIRM_INFO.NAME);   
            setIsUsingChatbot(firmDoc.data().CHAT_INFO.IS_CHAT_ON || false);             
            console.log(leadsData);
          } else {
            console.log('Error: Firm document not found.');
          }}
      } catch (err) {
        console.log(err);
      }
    };
    getFirmData();
  }, []);

  
  useEffect(() => {
    console.log(isChatOpen);
  }, [isChatOpen]);

  const handleRowClick = async (event, number, id, row) => {
    let newIsChatOpen;
    if (!activeUser) {await setIsChatOpen(true); newIsChatOpen = true}
    else if (activeUser.NUMBER === number) {setIsChatOpen(false); newIsChatOpen = false}
    else {setIsChatOpen(true); newIsChatOpen = true}

    if (!newIsChatOpen) {setActiveUser(null); return};

    const leadsArray = leads; 
    const leadItem = leadsArray.find(lead => lead.ID === id);
    const leadsData = leadItem.CONVERSATION ? leadItem.CONVERSATION : [{assistant: "No Conversation Data Created"}];
    await setTexts(leadsData);
    const leadItemWithAvatar = {...leadItem, avatarUrl: `https://ui-avatars.com/api/?name=${row.NAME}`};
    await setActiveUser(leadItemWithAvatar); console.log(leadsData); 
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

  const handleClickRoute = () => {
    window.location.href=`/influencer?influencer=$`
  }

  const handleOpen = () => {
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setIsDialogOpen(false);
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
        </style>

        <PageTitle title="All Website Leads" />

        <Stack direction="row" spacing={1.5} alignItems="center">

        {!isUsingChatbot && <Button variant="contained" onClick={() => {setIsDialogOpen(true)}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: 'black', },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="fluent:chat-32-filled" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Chatbot Setup
      </Button>}

      <div>
      <Dialog open={isDialogOpen} onClose={handleClose} 
      PaperProps={{ style: { minHeight: '650px', minWidth: '1000px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '500px', height: '650px', backgroundColor: 'white', borderRadius: '0px',
        padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
        Website Leads & Customer Support</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '35px',
        letterSpacing: '-0.35px',  fontWeight: 500, fontSize: '24.75px'}}> 
        💬&nbsp;&nbsp;&nbsp;Powered by AI <br /> 
        🕒&nbsp;&nbsp;&nbsp;24/7 Customer Support <br /> 
        💡&nbsp;&nbsp;&nbsp;Trained on your blogs <br /> 
        📧&nbsp;&nbsp;&nbsp;All leads in your email <br /> 
        ⚡&nbsp;&nbsp;&nbsp;Lightning quick responses <br /> 
        🛠️&nbsp;&nbsp;&nbsp;Custom-made for your firm <br />
        </Typography>
      <Button variant="contained" onClick={() => {window.open('https://tally.so/r/3jydPx', '_blank')}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="ic:baseline-business" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Have Pentra Build One for {firmName}
      </Button>
        </Card>
        <Card sx={(theme) => ({ width: '525px', height: '650px', backgroundColor: theme.palette.primary.navBg, 
        borderRadius: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          <img src="https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/Screenshot%202024-04-15%20at%2010.48.21%E2%80%AFPM.png?alt=media&token=e1a359e7-f779-4cf3-b0a0-b68d11175f67" 
          style={{height: '600px', width: '415px', borderRadius: '4px'}} alt=""/>
        </Card>
      </Dialog>
    </div>

        {/* <Button variant="contained"
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: 'black', },
      height: '36.5px', width: '38.75px', display: 'flex', justifyContent: 'center', minWidth: '10px',})}>
        <Iconify icon="fluent-emoji:white-question-mark" sx={{minHeight: '18px', minWidth: '18px', color: 'white'}}/>
      </Button> */}

        <Card sx= {{ height: 64.5, width: 'auto', pt: 1.15, pl: 1.7, borderRadius: '11px'  }} justifyContent="left" alignItems="center">
         
        <Stack direction="row" spacing={0} >
        
        <Avatar cursor="pointer" src={activeUser ? activeUser.avatarUrl : `https://ui-avatars.com/api/?name=NA`} onClick={() => handleClickRoute()} sx={{ mt: 0.40, mr: 2.0 }} />

        <Stack sx={{ width: '100%', mr: 2.5}} justifyContent="center" direction="column" 
        spacing={0} alignItems="start">
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Iconify icon="ant-design:phone-filled" style={{ color: 'black', height: '18px', width: '18px'  }} />
            <Typography >{activeUser ? activeUser.NUMBER : `Phone Number`}</Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Iconify icon="mdi:email" style={{ color: 'black', height: '18px', width: '18px' }} />
            <Typography >{activeUser ? activeUser.EMAIL : `Provided Email`}</Typography>
            </Stack>

          </Stack>
          </Stack>
        </Card>
        </Stack>

      </Stack>

      <Stack direction="row" spacing={3}>

      <Card sx={{ borderRadius: '11px', width: isChatOpen ? '420px' : '100%', height: 617.5, transition: 'ease 0.3s' }}>
        

        <Scrollbar>
        <TableContainer sx={{ maxHeight: 'calc(100% - 52px)' }}>
           <Table sx={{cursor: 'pointer',}}>
              <TableBody>
                {[...leads].reverse()
                  // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.NUMBER}
                      name={row.NAME}
                      number={row.NUMBER}
                      email={row.EMAIL}
                      date={row.DATE_TIME}
                      desc={row.SUMMARY}
                      conversation={row.CONVERSATION}
                      avatarUrl={`https://ui-avatars.com/api/?name=${row.NAME}`}                      
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => {
                        handleRowClick(event, row.NUMBER, row.ID, row);
                      }}
                      sx={{cursor: 'pointer'}}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Card>

      <Card sx={{ borderRadius: '11px', height: 617.5, width: isChatOpen ? 'calc(100% - 385px)' : '0%', transition: 'ease 0.3s' }}>
 
          <Card sx = {{ width: '100%', height: 617.5, p: 2.5, overflow: 'scroll'}}>

          {/* CHAT PANEL  */}

            {texts.map((text, index) => 
              <Stack key={index} mb={2} alignItems= {text.role === 'assistant' ? "flex-end" : "flex-start"}>
                <Stack
                  sx={{
                    width: 'auto',
                    height: 'auto',
                    backgroundColor: text.role === 'assistant' ? '#a1a1a1' : '#6fa133',
                    p: 0.9,
                    pl: 1.7,
                    pr: 1.7,
                    borderRadius: '8px',
                    justifyContent: 'left',
                    alignItems: 'start',
                    borderBottomRightRadius: text.role === 'assistant' ? '0px' : '8px',
                    borderBottomLeftRadius: text.role === 'user' ? '0px' : '8px',
                    maxWidth: '55%',
                  }}
                >
                  <Typography variant="subtitle3" sx={{ color: 'white', justifyContent: 'left' }}>
                    {text.content}
                  </Typography>
                </Stack>
              </Stack>
            )}


            </Card>

          </Card>
          </Stack>
    </Container>
  );
}
