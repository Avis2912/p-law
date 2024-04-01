import { useState } from 'react';
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

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

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

  


  return (
    <>
      <TableRow hover tabIndex={-1}>
      
  <TableCell component="th" scope="row" width="100%" height="82px" onClick={() => handleRowClick()}>
    
    <Stack sx={{ ml: 0.5 }} direction="row" alignItems="center" spacing={2}> {/* <-- Applied margin left here */}
      <Avatar alt={name} src={avatarUrl} />

      <Stack spacing={0}>
      <Typography variant="subtitle2" noWrap>
        {name}
      </Typography>
      <Typography 
  variant={read ?"subtitle3" : "subtitle2"} 
  noWrap 
  sx={{ 
    overflow: 'hidden',  // Ensures the overflow content will be hidden.
    textOverflow: 'ellipsis',  // Renders '...' for overflowed content.
    whiteSpace: 'nowrap',  // Text won't wrap to the next line.
    display: 'block',  // Changes display from inline to block to allow width specification.
    width: 'fit-content',  // Optional: You might specify a fixed width, or '100%' or any other value depending on your design requirements.
    maxWidth: 260,  // The max-width property, you might need to adjust based on your requirements.
  }}
>
  Hey! Thanks so much for reaching out. diusfndsf
</Typography>

      </Stack>

      <Iconify icon="mdi:dot" color="red" sx={{ height: read ? 0 : 30, width: 30, }} />


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
