import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';

export default function StrategyItem({ title, keywords, index, openedTopic, setOpenedTopic,
  
 }) {
  const handleClick = () => {
    setOpenedTopic(openedTopic === index ? null : index);
  };

  const isOpened = openedTopic === index;

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
          width: '100%', marginBottom: '5px',
          borderRadius: isOpened ? '4.75px' : '4.75px', 
          border: isOpened ? '1px solid #ccc' : 'none', 
          backgroundColor: isOpened ? 'white' : theme.palette.primary.lighter, 
          transition: 'all 0.4s ease', cursor: 'pointer',
          display: 'flex', justifyContent: 'left', alignItems: 'start',
          padding: isOpened ? '16px' : '11px',
          '&:hover': {
            // border: '1.5px solid pink',
            boxShadow: isOpened ? 'none' : '0 2.75px 2px rgba(255, 75, 50, 0.55)',
            transform: isOpened ? 'none' : 'translateY(-1.35px)',
          },
        })} 
        onClick={handleClick}
      >

        <Stack direction="row" spacing={1.75} sx={{display: 'flex', alignItems: 'center'}}>

        {!isOpened && <><Card sx={(theme) => ({ width: '30px', height: '30px', fontWeight: 800, fontSize: '15px',
          backgroundColor: isCurrentWeek ? theme.palette.primary.navBg : 'white', borderRadius: '3px', color: isCurrentWeek ? 'white' : theme.palette.primary.navBg,
          display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
          {index+1}</Card>

          <Typography sx={{ letterSpacing: '-0.15px', fontWeight: 500, }}
          >{title} </Typography></>}

          {isOpened && <Button sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, 
            '&:hover': {backgroundColor: theme.palette.primary.navBg, }, color: 'white', 
            px: '15px', borderRadius: '5.5px', fontSize: '15px', letterSpacing: '-0.25px'
          })}>{title}</Button>}

        </Stack>


        {isOpened && <Card sx={(theme) => ({ position: 'absolute', padding: '10px', paddingTop: '0px', minWidth: '440px',
          top: '18px', right: '18px', borderRadius: '5.5px', height: '294px', paddingBottom: '0px',
          backgroundColor: 'white', border: `1.0px solid ${theme.palette.primary.navBg}`,})}>

          <Card sx={(theme)=>({ width: '100%', padding: '13px', borderRadius: '0px', borderBottomRightRadius: '3.5px',
          backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex', height: '43.5px',
          left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>

          <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
          Targetting Keywords </Typography> </Card>

          <List sx={(theme)=>({ width: '100%', maxHeight: '237px',  padding: '0px', paddingTop: '10px', paddingBottom: '-10px',
            bgcolor: 'white', overflow: 'auto', position: 'relative',marginTop: '45px', })}>

          {keywords.map((keyword, keywordIndex) => (
            <ListItem 
              key={keywordIndex} 
              sx={(theme)=>({ height: 'auto', justifyContent: 'space-between', textAlign: 'center', userSelect: 'none',
              mb: '12px', borderRadius: '2.5px', p: '4.5px', backgroundColor: theme.palette.primary.lighter,})}>          
              <ListItemText primary={keyword.keyword} sx={{p: '0px', '& .MuiTypography-root': {fontSize: '15px', p: '1px', px: '8px', textAlign: 'left' }}}/>
            </ListItem>
          ))}

          </List>

        </Card>}

      </Card>
    </Grid>
  );
}

StrategyItem.propTypes = {
  title: PropTypes.any,
  keywords: PropTypes.array,
  index: PropTypes.number,
  openedTopic: PropTypes.number,
  setOpenedTopic: PropTypes.func,
};