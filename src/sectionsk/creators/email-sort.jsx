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
  { value: 'priceAsc', label: 'Email' },
  { value: 'featured', label: 'Required' },
];

export default function ShopProductSort() {
  const [open, setOpen] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(['priceAsc']); // Default selection

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleToggleOption = (optionValue) => {
    const currentIndex = selectedOptions.indexOf(optionValue);
    const newSelected = [...selectedOptions];

    if (currentIndex === -1) {
      newSelected.push(optionValue);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    // Ensure at least one option is selected
    if (newSelected.length === 0) {
      newSelected.push('priceAsc'); // Set the default option if all options are unselected
    }

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
            : 'Required'}
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
};

// Define prop types
ShopProductSort.propTypes = {
};