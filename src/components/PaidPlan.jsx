import React from 'react';
import { Dialog, Card, Typography, Button } from '@mui/material';
import Iconify from '@iconify/react';
import PropTypes from 'prop-types';

const PaidPlanDialog = ({ isDialogOpen, handleClose }) => (
    <Dialog open={isDialogOpen} onClose={handleClose} 
        PaperProps={{ style: { minHeight: '350px', minWidth: '500px', display: 'flex', flexDirection: "row" } }}>
        <Card sx={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: '0px', padding: '55px' }}>
            <Typography sx={{ fontFamily: "DM Serif Display", mb: 0, lineHeight: '55px',
                letterSpacing: '-0.45px',  fontWeight: 800, fontSize: '40.75px', marginBottom: '25px'}}> 
                Please Move To A Plan
            </Typography>
            <Typography sx={{ fontFamily: "serif", mb: 0, lineHeight: '55px', marginBottom: '33.5px',
                letterSpacing: '0.25px',  fontWeight: 500, fontSize: '24.75px'}}> 
                Keyword Research is <i>incredibly</i> expensive<br /> 
                for Pentra to perform! Consequently, we are <br /> 
                able to offer it only on a paid plan. If things <br /> 
                change, you&apos;ll be the first to find out. <br /> 
            </Typography>
            <Button variant="contained" onClick={() => {}}
                sx={(theme) => ({backgroundColor: theme.palette.primary.navBg, '&:hover': { backgroundColor: theme.palette.primary.navBg, },
                width: 'auto', display: 'flex', justifyContent: 'center', minWidth: '10px', cursor: 'default'})}>
                <Iconify icon="ic:email" sx={{minHeight: '18px', minWidth: '18px', 
                color: 'white', marginRight: '8px'}}/>
                Reach out to us at pentra.hub@gmail.com
            </Button>
        </Card>
    </Dialog>
);

export default PaidPlanDialog;

PaidPlanDialog.propTypes = {
    isDialogOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
};