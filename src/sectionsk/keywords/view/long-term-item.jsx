import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { useState } from 'react';

export default function LongTermItem({ index, isLongTermOpen, longTermKeywords, setLongTermKeywords }) {

  const handleInputChange = (event) => {
    const newKeywords = [...longTermKeywords];
    newKeywords[index] = {
      ...newKeywords[index],
      showup_for: event.target.value
    };
    setLongTermKeywords(newKeywords);
  };

  return (
    <Grid item xs={12} sm={6} md={6} sx={{ display: isLongTermOpen ? 'block' : 'none' }}>
      <Input 
        value={longTermKeywords[index]?.showup_for || ''}
        onChange={handleInputChange}
        sx={(theme) =>  ({ 
          height: 51.5, 
          width: '100%', 
          borderRadius: '2.5px', 
          border: '0.2px solid gray', 
          backgroundColor: 'white', 
          marginBottom: '5px',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
          padding: '15px',
          '&::before': {
            borderBottomWidth: '0px', // Reduce the underline width
            borderColor: 'white'
          },
          '&::after': {
            borderBottomWidth: '0px', // Reduce the underline width
            borderColor: 'white'
          }
        })} 
      />
    </Grid>
  );
}

LongTermItem.propTypes = {
  index: PropTypes.number,
  isLongTermOpen: PropTypes.bool,
  longTermKeywords: PropTypes.array,
  setLongTermKeywords: PropTypes.func,
};