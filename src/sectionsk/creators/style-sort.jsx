import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';
import PropTypes from 'prop-types';

const SORT_OPTIONS = [
  { value: 'Styles', label: 'Styles' },
  { value: 'Makeup', label: 'Makeup' },
  { value: 'Skincare', label: 'Skincare' },
  { value: 'Lifestyle', label: 'Lifestyle' },
  { value: 'Fashion', label: 'Fashion' },
];

const ShopProductSort = ({ onChange, values }) => {
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

    if (optionValue === 'Styles') {
        if (selectedOptions.includes('Styles')) {
            return;
        } 
            
    newSelected = ['Styles'];
        
    } else if (selectedOptions.includes('Styles')) {
  newSelected = [optionValue];
} else if (newSelected.includes(optionValue)) {
  const index = newSelected.indexOf(optionValue);
  newSelected.splice(index, 1);
} else {
  newSelected.push(optionValue);
}
// ...

    

    setSelectedOptions(newSelected);
    if (onChange) { // Ensure the callback exists before calling it
      onChange(newSelected); // Pass the updated array to the parent
    }
  };

  const getDisplayText = () => {
    if (selectedOptions.length === 0) {
      return "Styles";
    }
    if (selectedOptions.length === 1) {
      return SORT_OPTIONS.find((option) => option.value === selectedOptions[0])?.label;
    }
    return `${selectedOptions.length} Styles`;
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
          {getDisplayText}
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

ShopProductSort.defaultProps = {
  onChange: null,
  values: [],
};

ShopProductSort.propTypes = {
  onChange: PropTypes.func,
  values: PropTypes.arrayOf(PropTypes.string),
};

export default ShopProductSort;

