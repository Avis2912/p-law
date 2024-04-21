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
  IG_handle,
  avatarUrl,
  platforms,
  country,
  engagement,
  followers,
  handleClick,
  email,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 38, height: 38 }} height="11" alt="name" src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {IG_handle}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell align="center">{followers}</TableCell>

        <TableCell align="center">{platforms}</TableCell>

        <TableCell align="center">{country}</TableCell>

        <TableCell align="center">
          <Label color={(engagement === 'banned' && 'error') || 'success'}>{engagement}</Label>
        </TableCell>

        <TableCell align="center">
          <Label color={(engagement === 'banned' && 'error') || 'success'}>{engagement}</Label>
        </TableCell>

        <TableCell align="left">
          <Label color={(email === "" && 'error') || 'success'}>{email !== "" ? email : "No email"}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
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
  platforms: PropTypes.any,
  handleClick: PropTypes.func,
  engagement: PropTypes.any,
  IG_handle: PropTypes.any,
  country: PropTypes.any,
  selected: PropTypes.any,
  followers: PropTypes.any,
  email: PropTypes.any,
};
