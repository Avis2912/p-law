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
import { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';

// eslint-disable-next-line import/no-relative-packages
import hexToRGBA from '../../../../functions/src/General/hexToRGBA';


export default function StrategyItem({ title, keywords, index, openedTopic, setOpenedTopic,
  reasons, news,
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
  const intWeekName = isCurrentWeek ? 'This Week' : itemIndexList[index+1];

  return (
    <Grid item xs={12} sm={6} md={openedTopic === index ? 12 : 6} sx={{ display: openedTopic === null || openedTopic === index ? 'block' : 'none' }}>
      <Card 
        sx={(theme) =>  ({ 
          height: openedTopic === index ? 364 : 51.5, 
          width: '100%', marginBottom: '5px',
          borderRadius: isOpened ? '4.75px' : '4.75px', 
          border: isOpened ? '1px solid #ccc' : 'none', 
          backgroundColor: isOpened ? 'white' : theme.palette.primary.lighter, 
          transition: 'all 0.4s ease', cursor: 'pointer',
          display: 'flex', justifyContent: 'left', alignItems: 'start', flexDirection: 'column',
          padding: isOpened ? '16px' : '11px',
          '&:hover': {
            // border: '1.5px solid pink',
            boxShadow: isOpened ? 'none' : '3.75px 3.75px 0px rgba(255, 125, 150, 0.55)',
            transform: isOpened ? 'none' : 'translate(-2.55px, -2.55px)',
          },
          overflow: 'auto'
        })} 
        onClick={handleClick}
      >

        <Stack direction="row" spacing={1.75} sx={{display: 'flex', alignItems: 'center'}}>

          {!isOpened && <><Card sx={(theme) => ({ width: '30px', height: '30px', fontWeight: 800, fontSize: '15px',
            backgroundColor: isCurrentWeek ? theme.palette.primary.navBg : 'white', borderRadius: '3px', color: isCurrentWeek ? 'white' : theme.palette.primary.navBg,
            display: 'flex', justifyContent: 'center', alignItems: 'center' })}>
            {index+1}</Card>

          <Typography sx={{ letterSpacing: '-0.15px', fontWeight: 600, }}
          >{title} </Typography></>}

          {isOpened && <Button sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, 
            '&:hover': {backgroundColor: theme.palette.primary.navBg, }, color: 'white', 
            px: '15px', borderRadius: '5.5px', fontSize: '15px', letterSpacing: '-0.25px',
          })}>{title}</Button>}

        </Stack>

        {isOpened && 
        <Stack direction="column" spacing={1.6} sx={{display: 'flex', marginTop: '13px'}}>
        
          {/* <Button sx={(theme) => ({backgroundColor: theme.palette.primary.light, width: '188px',
              '&:hover': {backgroundColor: theme.palette.primary.light, }, color: 'white', 
              px: '13px', borderRadius: '5.5px', fontSize: '15px', letterSpacing: '-0.25px'
            })}>Why Pentra Picked This</Button> */}

          <Typography sx={{ letterSpacing: '-0.25px', fontSize: '16px',
            paddingLeft: '5px', lineHeight: '31.5px', fontWeight: 500,}}>
              {reasons.map((item, reasonIndex) => (
                <li key={reasonIndex}>{item.reason}</li>
              ))}
          </Typography>

          <Button sx={(theme) => ({
            backgroundColor: theme.palette.primary.light, width: 'auto',
            alignSelf: 'flex-start', // Add this to prevent full width
            '&:hover': {backgroundColor: theme.palette.primary.light},
            color: 'white', px: '15px', borderRadius: '5.5px', fontSize: '15px', letterSpacing: '-0.25px'
          })}>{`Writing About News ${intWeekName}`}</Button>

        
        {news.length > 0 ? news.map((newsItem, newsIndex) => (
          <Button key={newsIndex} sx={(theme) => ({
            backgroundColor: theme.palette.primary.lighter,
            width: 'auto', alignSelf: 'flex-start', 
            '&:hover': {backgroundColor: theme.palette.primary.lighter, },
            color: theme.palette.primary.navBg, px: '17px', borderRadius: '5.5px',
            fontSize: '15px', letterSpacing: '-0.25px', fontWeight: 600,
          })}
          startIcon={<Icon icon="fluent:news-20-regular" width={19} height={19} sx={{marginRight: '7px'}} />}>
            {newsItem.title}
          </Button>))

        : <><Button sx={(theme) => ({
          backgroundColor: theme.palette.primary.lighter, width: 'auto', alignSelf: 'flex-start', 
          '&:hover': {backgroundColor: theme.palette.primary.lighter, },
          color: theme.palette.primary.navBg, px: '17px', borderRadius: '5.5px',
          fontSize: '15px', letterSpacing: '-0.25px', fontWeight: 600,
        })}
        startIcon={<Icon icon="fluent:news-20-regular" width={19} height={19} sx={{marginRight: '7px'}} />}>
          Coming Soon The {intWeekName}
        </Button>

        <Button sx={(theme) => ({
        backgroundColor: theme.palette.primary.lighter, width: 'auto', alignSelf: 'flex-start', 
        '&:hover': {backgroundColor: theme.palette.primary.lighter, },
        color: theme.palette.primary.navBg, px: '17px', borderRadius: '5.5px',
        fontSize: '15px', letterSpacing: '-0.25px', fontWeight: 600,
        })}
        startIcon={<Icon icon="fluent:news-20-regular" width={19} height={19} sx={{marginRight: '7px'}} />}>
          Coming Soon The {intWeekName}
          </Button></>
        }

        </Stack>}


        {isOpened && <Card sx={(theme) => ({ position: 'absolute', padding: '10px', paddingTop: '0px', width: 'calc(100% - 450px)',
          top: '18px', right: '18px', borderRadius: '3px', height: '326px', paddingBottom: '0px',
          backgroundColor: 'white', border: `0.75px solid ${theme.palette.primary.navBg}`,})}>

          <Card sx={(theme)=>({ width: '100%', padding: '13px', borderRadius: '0px',
          backgroundColor: theme.palette.primary.navBg, position: 'absolute', display: 'flex', height: '43.5px',
          left: '0px', top: '0px', justifyContent: 'center', alignItems: 'center'})}>

          <Typography sx={{ fontSize: '16px', fontWeight: '500', color: 'white', letterSpacing: '-0.5px',}}>
          New Keywords Being Targetted</Typography> </Card>

          <List sx={(theme)=>({ width: '100%', maxHeight: '279px',  padding: '0px', paddingTop: '10px', paddingBottom: '-10px',
            bgcolor: 'white', overflow: 'auto', position: 'relative',marginTop: '45px', })}>

          {keywords.map((keyword, keywordIndex) => (
            <ListItem 
              key={keywordIndex} 
              sx={(theme)=>({ height: 'auto', justifyContent: 'space-between', textAlign: 'center', userSelect: 'none',
              mb: '12px', borderRadius: '2.5px', p: '6.5px', backgroundColor: theme.palette.primary.lighter,})}>          
              
              <ListItemText primary={keyword.keyword} sx={{p: '0px', '& .MuiTypography-root': {fontSize: '15px', p: '1px', px: '8px', textAlign: 'left', fontWeight: 500 }}}/>
              
              <Button sx={(theme) => ({backgroundColor: hexToRGBA(theme.palette.primary.light, 0.75), '&:hover': {backgroundColor: theme.palette.primary.light, },
                color: 'white', px: '10px', borderRadius: '2.75px', width: 'auto', minWidth: '10px', marginRight: '8.5px',
                letterSpacing: '-0.15px', height: '28px', fontSize: '13.75px', fontWeight: 200,
              })}>{keyword.data[0]} hits</Button>
              <Button sx={(theme) => ({backgroundColor: hexToRGBA(theme.palette.primary.light, 0.75), '&:hover': {backgroundColor: theme.palette.primary.light, },
                color: 'white', px: '11px', borderRadius: '2.75px', width: 'auto', minWidth: '10px',
                letterSpacing: '-0.55px', height: '28px', fontSize: '13.25px', fontWeight: 100, marginRight: '2px'
              })}>{keyword.competition}</Button>

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
  reasons: PropTypes.array,
  news: PropTypes.array,
};