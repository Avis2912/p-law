import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import Iconify from 'src/components/iconify';

const SORT_OPTIONS = [
  { value: 'All Followers', label: 'All Followers' },
  { value: '0-5k Followers', label: '0-5k Followers' },
  { value: '5-10k Followers', label: '5-10k Followers' },
  { value: '10-50k Followers', label: '10-50k Followers' },
]

export default function ShopProductSort({ onChange, values }) {
  const [open, setOpen] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(values);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleToggleOption = (optionValue) => {
    let newSelected = [...selectedOptions];
    
    if (optionValue === 'All Followers') {
      newSelected = ['All Followers'];
    } else if (newSelected.includes('All Followers')) {
        newSelected = [optionValue];
      } else if (newSelected.includes(optionValue)) {
        const index = newSelected.indexOf(optionValue);
        newSelected.splice(index, 1);
      } else {
        newSelected.push(optionValue);
      }
    

    setSelectedOptions(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={handleOpen}
        endIcon={<Iconify icon={open ? 'eva:chevron-up-fill' : 'eva:chevron-down-fill'} />}
      >
        &nbsp;
        <Typography component="span" variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {selectedOptions.length === 1
            ? selectedOptions[0]
            : `${selectedOptions.length} selections`}
        </Typography>
      </Button>

      <Menu
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              [`& .${listClasses.root}`]: {
                p: 0,
              },
            },
          },
        }}
      >
        {SORT_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            selected={selectedOptions.includes(option.value)}
            onClick={() => handleToggleOption(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

ShopProductSort.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.string),
};

