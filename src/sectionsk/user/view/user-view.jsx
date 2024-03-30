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

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';


import { products } from 'src/_mock/products';
import ProductSearch from 'src/sectionsk/seo/global-search';

import ProductCard from 'src/sectionsk/seo/creator-card';
import ProductSort from 'src/sectionsk/seo/product-sort';
import FollowerSort from 'src/sectionsk/seo/follower-sort';
import PlatformSort from 'src/sectionsk/seo/platform-sort';
import EngagementSort from 'src/sectionsk/seo/engagement-sort';
import StyleSort from 'src/sectionsk/seo/style-sort';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
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

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [engagement, setEngagement] = useState([]);
  const [locations, setLocations] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [styles, setStyles] = useState([]);


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
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h3">Google Reviews + Invite Reviewers</Typography>

        <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          Add To List
        </Button>
      </Stack>

      <div style={{ position: 'relative' }}>
      <div style={{
  borderRadius: '50px',
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(255, 255, 255, 0.7)',
  backdropFilter: 'blur(1px)',
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
      
      <Stack sx={{ py: 2.5, px: 2.5 }}direction="row" spacing={1.6} alignItems="center">
        <ProductSearch posts={products} />
      
        <ProductSort onChange={values => setLocations(values)} values={[]}/>
<FollowerSort onChange={values => setFollowers(values)} values={[]}/>
<PlatformSort onChange={values => setPlatforms(values)} values = {[]}/>
<EngagementSort onChange={values => setEngagement(values)} values={[]}/>
<StyleSort onChange={values => setStyles(values)} values={[]}/>

          <Button variant="contained" color="inherit" >
          Search: 258 results
          </Button>
          

        </Stack>

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
    </Container>
  );
}
