import { useState } from 'react';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { listClasses } from '@mui/material/List';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'Global', label: 'Global' },
  { value: 'US only', label: 'US only' },
  { value: 'The West', label: 'The West' },
];

const ShopProductSort = ({ onChange, values }) => {


  const [open, setOpen] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(values); // Default selection

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleToggleOption = (optionValue) => {
    let newSelected;
    if (optionValue === 'Global') {
        if (!selectedOptions.includes('Global')) {
            newSelected = ['Global'];  // If "Global" is clicked, clear all other selections
        } else {
            return;  // If "Global" is clicked and it's already selected, do nothing
        }
    } else if (selectedOptions.includes('Global')) {
            newSelected = [optionValue];  // If "Global" is selected and other options are clicked, deselect "Global"
        } else if (selectedOptions.includes(optionValue)) {
            newSelected = selectedOptions.filter(item => item !== optionValue);  // Deselect the option if it's already selected
        } else {
            newSelected = [...selectedOptions, optionValue];  // Select the option if it's not already selected
        }
    

    // Ensure at least one option is selected
    if (newSelected.length === 0) {
        newSelected = ['Global']; // Set the default option if all options are unselected
    }

    setSelectedOptions(newSelected);

    // Call the onChange callback with the new selected options
    onChange(newSelected);
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
            : 'Locations'}
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
