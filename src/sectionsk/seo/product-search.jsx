import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

ProductSearch.propTypes = {
  posts: PropTypes.array.isRequired,
};

export default function ProductSearch({ posts }) {
  return (
    <TextField 
      sx={{ width: 240 }}
      placeholder="Enter a keyword"
      autoHighlight
      popupIcon={null}
      slotProps={{
        paper: {
          sx: {
            width: 320, 
            [`& .${autocompleteClasses.option}`]: {
              typography: 'body2',
            },
          },
        },
      }}/>
    
  )        
};
