import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { format } from 'date-fns';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  company,
  role,
  isVerified,
  status,
  handleClick,
}) {
  const [open, setOpen] = useState(null);
  const [read, setRead] = useState(false);

  let backgroundColor = 'green';

  const buttonText = '03/31/24 | 3PM';
  const buttonDate = buttonText.split(' | ')[0];
  const today = format(new Date(), 'MM/dd/yy');
  const isToday = buttonDate === today;

  backgroundColor = isToday ? 'green' : 'black';

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRowClick = () => {
    handleClick();
    setRead(true);
  };

  useEffect(() => {
    if (isToday) {setRead(true)};
  }, [isToday]);


  return (
    <>
      <TableRow hover tabIndex={-1}>
      
  <TableCell component="th" scope="row" width="100%" height="82px" onClick={() => handleRowClick()}>
    
    <Stack sx={{ ml: 0.5 }} direction="row" alignItems="center" spacing={2}> {/* <-- Applied margin left here */}
      <Avatar alt={name} src={avatarUrl} />

      <Stack spacing={0}>
        <Stack direction="row" justifyContent="left" spacing={1}>
      <Typography variant="subtitle2" noWrap>
        {name}
      </Typography>
      {/* <Typography variant="subtitle3" noWrap sx={{color: 'darkblue'}}>
        11/10/2021
      </Typography> */}
      </Stack>
      
      <Typography 
        variant={read ?"subtitle3" : "subtitle2"} 
        noWrap 
        sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          display: 'block',
          width: 'fit-content',
          maxWidth: 260,
        }}>
        657-642-7241
      </Typography>

      </Stack>

      {/* <Iconify icon="mdi:dot" color="red" sx={{ height: read ? 0 : 30, width: 30, }} /> */}
      
      <Button variant="contained" sx={{backgroundColor, '&:hover': { backgroundColor, },
      boxShadow: 'none', position: 'absolute', left: '237.5px', borderRadius: '6px',
      width: '115px', height: 'auto', paddingInline: '10px', fontSize: '12px', color: 'white',
      opacity: 0.7, paddingTop: '6px', paddingBottom: '6px',}}  
      >
        {buttonText}
      </Button>

      <Typography 
        variant={read ? "subtitle3" : "subtitle2"} noWrap 
        sx={{ position: 'absolute', overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', display: 'block', fontSize: '16px',
          width: 'fit-content',  left: '410px',
        }}>
        Hurt in Idaho car accident; looking for a personal injury lawyer.
      </Typography>
      

    </Stack>

  </TableCell>

</TableRow>


      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  company: PropTypes.any,
  handleClick: PropTypes.func,
  isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
