import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack } from '@mui/material';
import PropTypes from 'prop-types';

export const ScheduleDialog = ({ isOpen, onClose, onSchedule }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
  
    return (
      <Dialog open={isOpen} onClose={onClose} 
      sx={{ '& .MuiDialog-paper': { borderRadius: '7.5px', p: '20px', pb: '27.5px' } }}>
        <DialogTitle sx={{ fontSize: '30px', letterSpacing: '-0.5px', fontWeight: 'bold' }}>
        Schedule Blog</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.75 }}>
            <TextField
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
            />
            <TextField
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}
          sx={(theme) => ({ backgroundColor: theme.palette.primary.black, px: '15px', mr: '3px',
            borderRadius: '6px', color: 'white', '&:hover': { backgroundColor: theme.palette.primary.black }
           })}
          >Cancel</Button>
          <Button 
            onClick={() => {
              onSchedule(date, time);
              onClose();
            }} 
            variant="contained"
            disabled={!date || !time}
            sx={(theme) => ({ backgroundColor: theme.palette.primary.navBg, px: '15px', 
              borderRadius: '6px', color: 'white', '&:hover': { backgroundColor: theme.palette.primary.navBg }
            })}
          >
            Schedule
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

ScheduleDialog.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onSchedule: PropTypes.func,
};