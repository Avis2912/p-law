import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

export default function StrategyItem({ title, keywords, index, openedTopic, setOpenedTopic }) {
  const handleClick = () => {
    setOpenedTopic(openedTopic === index ? null : index);
  };

  const itemIndexList = {
    1: 'First Week',
    2: 'Second Week',
    3: 'Third Week',
    4: 'Fourth Week',
  }

  const getCurrentWeekOfMonth = () => {
    const currentDate = new Date();
    const dayOfMonth = currentDate.getDate();
    if (dayOfMonth <= 7) {return 1;
    } else if (dayOfMonth <= 14) {return 2;
    } else if (dayOfMonth <= 21) {return 3;
    } else {return 4;}
  };
  
  const currentWeek = getCurrentWeekOfMonth();
  const isCurrentWeek = currentWeek === index + 1;

  return (
    <Grid item xs={12} sm={6} md={openedTopic === index ? 12 : 6} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
      <Card 
        sx={(theme) =>  ({ 
          height: openedTopic === index ? 332.5 : 51.5, 
          width: '100%', 
          borderRadius: '4.75px', 
          border: '0px solid black', 
          backgroundColor: theme.palette.primary.lighter, 
          marginBottom: '5px',
          transition: 'all 0.4s ease',
          cursor: 'pointer',
          padding: '11px',
        })} 
        onClick={handleClick}
      >

        <Stack direction="row" spacing={1.75} sx={{display: 'flex', alignItems: 'center'}}>

        <Card sx={(theme) => ({ width: '30px', height: '30px', fontWeight: 800, fontSize: '15px',
          backgroundColor: isCurrentWeek ? theme.palette.primary.navBg : 'white', borderRadius: '3px', color: isCurrentWeek ? 'white' : theme.palette.primary.navBg,
          display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          {index+1}</Card>

          <Typography sx={{ letterSpacing: '-0.25px' }}
          >CHRO Service Agreements in Texas </Typography>

        </Stack>

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