// QueueItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Typography, IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

const QueueItem = ({ title, content, time, tab, selectedList, posts }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [socialBtnHover, setSocialBtnHover] = useState(false);

  if (tab !== selectedList) {
    return null;
  }

  const getIcon = (tabby) => {
    switch (tabby) {
      case 'Published':
        return 'iconamoon:send-thin';
      case 'Scheduled':
        return 'octicon:clock-24';
      case 'Drafts':
        return 'mynaui:edit-one';
      default:
        return 'mynaui:edit-one';
    }
  };


  const hexToRgba = (hex, alpha = 1) => {
    const hexValue = hex.replace('#', '');
    const bigint = parseInt(hexValue, 16);
    /* eslint-disable no-bitwise */
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    /* eslint-enable no-bitwise */
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getBgColor = (tabby) => {
    switch (tabby) {
      case 'Published':
        return hexToRgba('#ff5e76', 0.075);
      case 'Scheduled':
        return hexToRgba('#2196F3', 0.08);
      case 'Drafts':
        return hexToRgba('#9E9E9E', 0.08);
      default:
        return hexToRgba('#9E9E9E', 0.08);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: getBgColor(tab),
        borderRadius: 1, p: 2, mb: 1,
        transition: 'transform 0.3s ease-out',
        ...(isHovered && {
          backgroundColor: (theme) => `${getBgColor(tab).replace('0.08', '0.12')}`,
          transform: 'translateY(-1px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        })
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: '6.5px',
          width: 40, height: 40,
          display: 'flex',
          alignItems: 'center', 
          justifyContent: 'center', 
          flexShrink: 0
        }}
      >
        <Iconify icon={getIcon(tab)} width={20} height={20} />
      </Box>

      <Box sx={{ flex: 1, mx: 2, overflow: 'hidden' }}>
        <Typography
          noWrap
          sx={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 500,
            fontSize: '17px',
          }}
        >
          {title}
        </Typography>
      </Box>

      <Typography
        sx={{
          width: 100,
          textAlign: 'right',
          fontWeight: 600,
          color: 'text.secondary',
          flexShrink: 0
        }}
      >
        {time}
      </Typography>

      <Box sx={{ ml: 2, display: 'flex', gap: 1 }}>
        {tab !== 'Published' && (
          <IconButton
            size="small"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Iconify icon="material-symbols:edit-outline" />
          </IconButton>
        )}
        <IconButton size="small">
          <Iconify icon="material-symbols:delete-outline" />
        </IconButton>
        <Button size="small"
            style={{borderRadius: '5px', height: socialBtnHover ? '36px' : '30px', backgroundColor: '#404040',  color: 'white', minWidth: '30px', transition: 'all 0.25s ease-out',
              width: socialBtnHover ? 'auto' : '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: socialBtnHover ? 5 : 5,
              paddingLeft: socialBtnHover ? '10px' : '0px', paddingRight: socialBtnHover ? '10px' : '0px',
            }}
            onMouseEnter={() => setSocialBtnHover(true)}
            onMouseLeave={() => setSocialBtnHover(false)}>
              <Iconify icon="mynaui:sparkles-solid" height="17px" width="17px" />
              {socialBtnHover && <span style={{ marginLeft: '5px' }}>Create Social Posts</span>}
        </Button>
      </Box>
    </Box>
  );
};

QueueItem.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  time: PropTypes.string.isRequired,
  tab: PropTypes.string.isRequired,
  selectedList: PropTypes.string.isRequired,
  posts: PropTypes.array,
};

export default QueueItem;