import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { users } from 'src/_mock/user';
import { Box, TextField, Avatar } from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

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

  const [rowsPerPage, setRowsPerPage] = useState(5000);

  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const [user, setUser] = useState(null);

  const handleClick = (event, name, row) => {
    setUser(row);
    
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

  const texts = [
    {assistant: "Hey, whats good?"},
    {user: "Nothing much, what about you?"},
    {assistant: "Can I get your email?"},

  ]

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <style>
          @import url(https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Serif+Display:ital@0;1&family=Fredericka+the+Great&family=Raleway:ital,wght@0,100..900;1,100..900&family=Taviraj:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Yeseva+One&display=swap);
        </style>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, 
        letterSpacing: '1.05px',  fontWeight: 800, fontSize: '32.75px'}}> 
        All Website Leads</Typography>

        <Card sx= {{ height: 64.5, width: 'auto', pt: 1.15, pl: 1.7, borderRadius: '12px'  }} justifyContent="left" alignItems="center">
         
        <Stack direction="row" spacing={0} >
        
        <Avatar cursor="pointer" src={user?.avatarUrl} onClick={() => handleClickRoute()} sx={{ mt: 0.40, mr: 2.0 }} />

        <Stack sx={{ width: '100%', mr: 2.5}} justifyContent="center" direction="column" 
        spacing={0.0} alignItems="start">
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Iconify icon="ant-design:phone-filled" style={{ color: 'black', height: '18px', width: '18px'  }} />
            <Typography >657-642-7241</Typography>
            </Stack>
            
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
            <Iconify icon="mdi:email" style={{ color: 'black', height: '18px', width: '18px' }} />
            <Typography >amna@hotmail.com</Typography>
            </Stack>

          </Stack>
          </Stack>
        </Card>

      </Stack>

      <Stack direction="row" spacing={3}>

      <Card sx={{ width: isChatOpen ? '420px' : '100%', height: 575, transition: 'ease 0.3s' }}>
        

        <Scrollbar>
        <TableContainer sx={{ overflow: 'auto', maxHeight: 'calc(100% - 52px)' }}> {/* Adjust the maxHeight according to your needs */}
            <Table sx={{cursor: 'pointer'}}>
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      name={row.name}
                      role={row.role}
                      status={row.status}
                      company={row.company}
                      avatarUrl={row.avatarUrl}
                      isVerified={row.isVerified}
                      selected={selected.indexOf(row.name) !== -1}
                      handleClick={(event) => {
                        handleClick(event, row.name, row);
                        setIsChatOpen(!isChatOpen);
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
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Card sx={{ height: 575, width: isChatOpen ? 'calc(100% - 385px)' : '0%', transition: 'ease 0.3s' }}>
 
          <Card sx = {{ width: '100%', height: 575, p: 2.5}}>

          {/* CHAT PANEL  */}

            {texts.map((text, index) => 
              Object.entries(text).map(([role, message]) => 
                <Stack key={index} mb={2} alignItems= {role === 'assistant' ? "flex-end" : "flex-start"}>
                  <Stack
                    sx={{
                      width: 'auto',
                      height: 'auto',
                      backgroundColor: role === 'assistant' ? '#a1a1a1' : '#6fa133',
                      p: 0.9,
                      pl: 1.7,
                      pr: 1.7,
                      borderRadius: '8px',
                      justifyContent: 'left',
                      alignItems: 'start',
                      borderBottomRightRadius: role === 'assistant' ? '0px' : '8px',
                      borderBottomLeftRadius: role === 'user' ? '0px' : '8px',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography variant="subtitle3" sx={{ color: 'white', justifyContent: 'left' }}>
                      {message}
                    </Typography>
                  </Stack>
                </Stack>
              )
            )}
            


            </Card>

          </Card>
          </Stack>
    </Container>
  );
}
