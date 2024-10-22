import React from 'react';
import Typography from '@mui/material/Typography';

const QueueDate = ({ date }) => {
    const formatDate = (dateString) => {
        // Create date object and force it to respect the input date without timezone shifts
        const inputDate = new Date(dateString);
        inputDate.setMinutes(inputDate.getMinutes() + inputDate.getTimezoneOffset());
        
        // Create today and tomorrow dates at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Compare dates after setting them all to midnight
        const compareDate = new Date(inputDate);
        compareDate.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (compareDate.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return inputDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    };

    return (
        <Typography
            sx={{
                fontFamily: "'Arial', sans-serif",
                fontWeight: 400,
                fontSize: '22px',
                letterSpacing: '-0.5px',
                marginTop: 0,
                marginBottom: 3.5,
                color: '#242122'
            }}
        >
            {formatDate(date)}
        </Typography>
    );
};

export default QueueDate;