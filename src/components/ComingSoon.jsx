import React from 'react';
import { Dialog, Card, Typography, Button } from '@mui/material';
import { Icon as Iconify } from '@iconify/react';
import PropTypes from 'prop-types';

export default function ComingSoon({ isDialogOpen2, handleClose2 }) {
  return (
    <Dialog open={isDialogOpen2} onClose={handleClose2} 
      PaperProps={{ style: { height: 'auto', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
      <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px',
      padding: '55px' }}>
        <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
        letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '15px'}}> 
        Coming Very Soon</Typography>
        <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '50px', marginBottom: '15.5px',
        letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
        Please check in again later. <br /> 
        We work very hard and typically roll <br /> 
        new features every few days.
        </Typography>
        {/* <Button variant="contained" onClick={() => {}}
      sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
      width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', cursor: 'default'})}>
        <Iconify icon="ic:email" sx={{minHeight: '18px', minWidth: '18px', 
        color: 'white', marginRight: '8px'}}/>
        Reach out to us at pentra.hub@gmail.com
      </Button> */}
      </Card>
    </Dialog>
  );
}

ComingSoon.propTypes = {
  isDialogOpen2: PropTypes.bool.isRequired,
  handleClose2: PropTypes.func.isRequired,
};