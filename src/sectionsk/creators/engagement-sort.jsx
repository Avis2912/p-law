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
  { value: 'All Engagement', label: 'All Engagement' },
  { value: 'A+', label: 'A+' },
  { value: 'A', label: 'A' },
  { value: 'B+', label: 'B+' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },

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
    if (optionValue === 'All Engagement') {
        if (!selectedOptions.includes('All Engagement')) {
            newSelected = ['All Engagement'];  // If "All Engagement" is clicked, clear all other selections
        } else {
            return;  // If "All Engagement" is clicked and it's already selected, do nothing
        }
    } else if (selectedOptions.includes('All Engagement')) {
            newSelected = [optionValue];  // If "All Engagement" is selected and other options are clicked, deselect "All Engagement"
        } else if (selectedOptions.includes(optionValue)) {
            newSelected = selectedOptions.filter(item => item !== optionValue);  // Deselect the option if it's already selected
        } else {
            newSelected = [...selectedOptions, optionValue];  // Select the option if it's not already selected
        }
    

    // Ensure at least one option is selected
    if (newSelected.length === 0) {
        newSelected = ['All Engagement']; // Set the default option if all options are unselected
    }

    setSelectedOptions(newSelected);

    // Call the onChange callback with the new selected options
    onChange(newSelected);
};

const getDisplayText = (options) => {
  if (selectedOptions.length === 0) return "All Engagement";
  if (selectedOptions.length === 1) return selectedOptions[0];
  return `${selectedOptions.length} Engagements`;
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
        {getDisplayText(selectedOptions)}
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