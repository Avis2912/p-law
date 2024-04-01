import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'Styles', label: 'Styles' },
  { value: 'Makeup', label: 'Makeup' },
  { value: 'Skincare', label: 'Skincare' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Fashion', label: 'Fashion' },


];

export default function ShopProductSort({ onChange }) {
  const [open, setOpen] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(['Styles']); // Default selection

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleToggleOption = (optionValue) => {
    let newSelected;
  
    if (optionValue === 'Styles') {
      // If "Styles" is selected, deselect all other options
      newSelected = [optionValue];
    } else if (selectedOptions.includes('Styles')) {
      // If "Styles" is already selected, deselect it and select the current option
      newSelected = [optionValue];
    } else if (selectedOptions.includes(optionValue)) {
        newSelected = selectedOptions.filter((item) => item !== optionValue);
      } else {
        newSelected = [...selectedOptions, optionValue];
      }
    
  
    // Call the onChange callback with the new selected options
    onChange(newSelected);
    setSelectedOptions(newSelected);
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
            ? SORT_OPTIONS.find((option) => option.value === selectedOptions[0])?.label
            : 'Styles'}
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
};
