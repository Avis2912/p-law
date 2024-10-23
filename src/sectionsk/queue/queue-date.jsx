import React from 'react';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

const QueueDate = ({ date }) => {
    const formatDate = (dateString) => {
        // Parse the date string in MM/DD/YY format
        const [month, day, year] = dateString.split('/').map(Number);
        const inputDate = new Date(`20${year}`, month - 1, day); // Adjust year to 4 digits
        
        // Create today, yesterday, and tomorrow dates at midnight for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Compare dates after setting them all to midnight
        const compareDate = new Date(inputDate);
        compareDate.setHours(0, 0, 0, 0);

        if (compareDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (compareDate.getTime() === yesterday.getTime()) {
            return 'Yesterday';
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
                marginTop: 1.25,
                marginBottom: 2.45,
                color: '#242122'
            }}
        >
            {formatDate(date)}
        </Typography>
    );
};

export default QueueDate;

QueueDate.propTypes = {
    date: PropTypes.string.isRequired
};