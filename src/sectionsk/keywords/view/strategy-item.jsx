import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useState } from 'react';

export default function StrategyItem({ title, keywords, index, openedTopic, setOpenedTopic }) {
  const handleClick = () => {
    setOpenedTopic(openedTopic === index ? null : index);
  };

  return (
    <Grid item xs={12} sm={6} md={openedTopic === index ? 12 : 6} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
      <Card 
        sx={(theme) =>  ({ 
          height: openedTopic === index ? 332.5 : 51.5, 
          width: '100%', 
          borderRadius: '4.5px', 
          border: '0px solid black', 
          backgroundColor: theme.palette.primary.lighter, 
          marginBottom: '5px',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
        })} 
        onClick={handleClick}
      >
        {/* Add your content here */}
      </Card>
    </Grid>
  );
}

StrategyItem.propTypes = {
  title: PropTypes.any,
  keywords: PropTypes.object,
  index: PropTypes.number,
  openedTopic: PropTypes.number,
  setOpenedTopic: PropTypes.func,
};