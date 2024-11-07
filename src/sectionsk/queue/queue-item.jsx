// QueueItem.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box, Typography, IconButton, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import Iconify from 'src/components/iconify';
import CreateSocial from 'src/components/CreateSocial';
import CreateNewsletter from 'src/components/CreateNewsletter';

const QueueItem = ({ title, content, time, tab, selectedList, posts, date, setQueueData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [socialBtnHover, setSocialBtnHover] = useState(false);
  const navigate = useNavigate();

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

  const handleDelete = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDoc.exists()) {
        const firmDocRef = doc(db, 'firms', userDoc.data().FIRM);
        const firmDoc = await getDoc(firmDocRef);
        
        if (firmDoc.exists()) {
          const currentQueue = firmDoc.data().QUEUE;
          const listKey = tab.toUpperCase();
          
          // Filter out the item to delete
          const updatedList = currentQueue[listKey].filter(
            item => !(item.title === title && item.time === time && item.date === date)
          );
          
          // Update the database
          await updateDoc(firmDocRef, {
            [`QUEUE.${listKey}`]: updatedList
          });

          // Update local state
          setQueueData(prev => ({
            ...prev,
            [listKey]: updatedList
          }));
        }
      }
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const handleEdit = () => {
    navigate(`/blog?title=${encodeURIComponent(title)}&list=${encodeURIComponent(tab)}&time=${encodeURIComponent(time)}&date=${encodeURIComponent(date)}`);
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
          {(() => {
            console.log('content:', content);
            const h1Match = content?.match(/<h1>(.*?)<\/h1>/);
            if (h1Match) return h1Match[1];
            
            const h2Match = content?.match(/<h2>(.*?)<\/h2>/);
            if (h2Match) return h2Match[1];
            
            return 'Untitled';
          })()}
        </Typography>
      </Box>

      <Typography
        sx={{
          width: 100,
          textAlign: 'right',
          fontWeight: 600,
          color: 'text.secondary',
          flexShrink: 0,
          marginRight: 2,
        }}
      >
        {time}
      </Typography>

      <Stack direction="row" spacing={0}>

      <IconButton 
          sx={{mr: 0.5}}
          size="small"
          onClick={handleEdit}
        >
          <Iconify icon="material-symbols:edit-outline" />
        </IconButton>
        
        <IconButton 
          size="small" 
          sx={{mr: 0.65}}
          onClick={handleDelete}
        >
          <Iconify icon="material-symbols:delete-outline" />
        </IconButton>

      <Stack direction="row" spacing={1.05}>

      <CreateNewsletter content={content} isExpanding/>

      <CreateSocial content={content} isExpanding />

      </Stack>

      </Stack>

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
  date: PropTypes.string,
  setQueueData: PropTypes.func.isRequired,
};

export default QueueItem;