import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';

const PageTitle = ({ title }) => (
  <Typography sx={{ fontFamily: "'EB Garamound', serif",
   mb: 2, letterSpacing: '-1.15px',  fontWeight: 500, fontSize: '32.75px'}}>
    {title}
  </Typography>
);

PageTitle.propTypes = {
  title: PropTypes.node.isRequired,
};

export default PageTitle;