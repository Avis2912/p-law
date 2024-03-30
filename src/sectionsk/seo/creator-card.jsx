import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';
import Button from '@mui/material/Button'
import { fCurrency } from 'src/utils/format-number';
import { useState } from 'react';

import Label from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';
import ListSelect from './list-select'


// ----------------------------------------------------------------------

const ShopProductCard = ({ creator, pfp }) => {
  const renderStatus = (
    <Label
      variant="filled"
      // color={(creator.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
       {/* {creator.status} */}
    </Label>
  );

  const handleClickRoute = () => {
    window.location.href = `/influencer?pentra_id=${creator.pentra_id}`;
  }

  const renderImg = (
    <Box
      component="img"
      alt={creator.name}
      src={pfp}
      onClick={() => handleClickRoute()}
      sx={{
        top: 0,
        width: 210,
        height: 210,
        mt: 3.2,
        mx: 3.6,
        objectFit: 'cover',
        position: 'absolute',
        cursor: 'pointer',
        borderRadius: '50%', // Apply a circular clipping mask
      }}
    />
  );
  

  const [selected, setSelected] = useState(false);
  const [giftSelected, setGiftSelected] = useState(false);
  const [cashSelected, setCashSelected] = useState(false);

  const handleGiftClick = () => {
    setGiftSelected(!giftSelected);
  };

  const handleCashClick = () => {
    setCashSelected(!cashSelected);
  };

  function formatFollowers(number) {
    if (number < 1000) return number.toString();
    return `${(number / 1000).toFixed(1)}k`;
  }
  
  

  return (
    <Card  sx={{}}>
      <Stack height="360px" direction="row" alignItems="end" justifyContent="space-evenly" sx={{ p: 3, mt: 11.5 }} >
      
    {renderImg}
    

      <Stack direction="column" alignItems="center" spacing={2} sx={{ p: 0, mt: 2 }}>

        
        <Link target="_blank" 
         href={`https://www.instagram.com/${creator.handles.IG}`}
         color="inherit" underline="hover" variant="subtitle1" noWrap>
          {creator.name}
        </Link>

        <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-evenly" >
          
        <Stack sx={{ width: 35 }}>
        <Typography fontSize={18} fontWeight={100}>
        {formatFollowers(creator.followers.IG)}
        </Typography>
        </Stack>


          <Stack sx={{ width: 40, pl: 1.3 }} direction="row" spacing={0.5} alignItems="center" justifyContent="center">
            <a
            href={`https://www.instagram.com/${creator.handles.IG}`}            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
            {creator.handles.IG !== "" ? <Iconify icon="mdi-instagram" style={{ color: 'black' }} /> : <></>}
            </a>
            <a
            href={`https://www.tiktok.com/${creator.handles.TT}`}            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
            {creator.handles.TT !== "" ? <Iconify icon="ic:baseline-tiktok" style={{ color: 'black' }} /> : <></>}
            </a>
            <a
            href={`https://www.youtube.com/${creator.handles.YT}`}            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}
            >
            {creator.handles.YT !== "" ? <Iconify icon="mdi-youtube" style={{ color: 'black', height: 25, width: 25, }} /> : <></>}
            </a>
          </Stack>
          <Stack sx={{ width: 40 }} direction="row" justifyContent="center">
          <Typography fontSize={23}>🇺🇸</Typography>
          </Stack>

        </Stack>


        <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-evenly">
        
        <Typography fontSize={16}>{creator.engagement}</Typography>
        
        <ListSelect />

        <Stack onClick={() => setSelected(!selected)} style={{ cursor: 'pointer' }}>
      <Iconify
        icon={selected ? 'bi:heart-fill' : 'bi:heart'}
        style={{ fontSize: '24px', color: selected ? 'red' : 'gray' }}
      />

    </Stack>

        </Stack>

        <Stack spacing={3} direction="row" alignItems="center" justifyContent="space-evenly">
        
        <Button
  style={{
    backgroundColor: 'primary',
    color: 'black', // Pink color
    padding: '4px 12px', // Smaller padding
    fontSize: '14px', // Smaller font size
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    fontWeight: '100',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
  }}
>
<Iconify icon="ion:gift-outline" style={{ marginRight: '4px', fontSize: '16px' }} />
  Gift
</Button>
<Button
  style={{
    backgroundColor: 'primary',
    color: 'black', // Pink color
    padding: '4px 12px', // Smaller padding
    fontSize: '14px', // Smaller font size
    cursor: 'pointer',
    outline: 'none',
    display: 'flex',
    fontWeight: '100',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s, color 0.3s, border-color 0.3s',
  }}
  onClick={() => handleClickRoute()}
  >
<Iconify icon="mingcute:chat-1-line" style={{ marginRight: '4px', fontSize: '16px'}} />
Message
</Button>



        </Stack>

      </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  creator: PropTypes.object,
  pfp: PropTypes.any,
};

export default ShopProductCard;

