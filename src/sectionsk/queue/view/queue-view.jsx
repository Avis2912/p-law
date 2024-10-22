import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import QueueItem from '../queue-item';
import QueueDate from '../queue-date';

const BlogView = () => {
  const navigate = useNavigate();
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [plan, setPlan] = useState('Trial Plan');
  const [weeklyBlogs, setWeeklyBlogs] = useState([]);
  const [selectedList, setSelectedList] = useState('Scheduled');

  // Sample data grouped by Scheduled, Published, and Drafts
  const sampleData = {
    Scheduled: [
      { date: '2024-10-22', content: 'The Future of Remote Work', time: '11:30 AM' },
      { date: '2024-10-23', content: 'How to Build a Personal Brand', time: '10:00 AM' },
      { date: '2024-10-24', content: 'Artificial Intelligence in Business', time: '9:30 AM' }
    ],
    Published: [
      { date: '2024-10-22', content: '10 Tips for Effective Social Media Marketing', time: '9:00 AM' },
      { date: '2024-10-24', content: 'Content Marketing Trends', time: '4:30 PM' }
    ],
    Drafts: [
      { date: '2024-10-22', content: 'Understanding Cryptocurrency Basics', time: '2:00 PM' },
      { date: '2024-10-23', content: 'SEO Strategies for 2024', time: '3:00 PM' },
      { date: '2024-10-24', content: 'Email Marketing Best Practices', time: '1:00 PM' }
    ]
  };

  const buttonLabels = ['Published', 'Scheduled', 'Drafts'];
  const icons = ['iconamoon:send-thin', 'octicon:clock-24', 'mynaui:edit-one'];

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={0.75}>
        <PageTitle title={`${selectedList === buttonLabels[2] ? 'Draft' : selectedList} Posts`} />
        <Stack direction="row" spacing={2} mb={2}>
          <div style={{ 
            display: 'flex', borderRadius: 5.5, 
            width: 369, height: 37.5, 
            borderWidth: 0.5, borderStyle: 'solid' 
          }}>
            {buttonLabels.map((label, index) => (
              <Button
                key={label}
                startIcon={<Iconify icon={icons[index]} height="16.5px" width="16.5px" marginRight="-1.75px" />}
                style={{
                  width: 123, color: selectedList === label ? 'white' : '#242122',
                  backgroundColor: selectedList === label ? '#242122' : 'transparent',
                  fontWeight: 700, transition: 'all 0.25s ease-out', borderRadius: 0,
                  borderTopLeftRadius: index === 0 ? 4 : 0, borderBottomLeftRadius: index === 0 ? 4 : 0,
                  borderTopRightRadius: index === buttonLabels.length - 1 ? 4 : 0, borderBottomRightRadius: index === buttonLabels.length - 1 ? 4 : 0,
                  border: '0px solid #242122', borderRightWidth: index === buttonLabels.length - 1 ? 0 : 0.5,
                  cursor: 'pointer', fontSize: 14, letterSpacing: '-0.25px',
                }}
                onClick={() => setSelectedList(label)}
              >
                {label}
              </Button>
            ))}
          </div>
        </Stack>
      </Stack>

      <Grid container spacing={1.4}>
        {sampleData[selectedList].map((item, idx) => (
          <Grid item xs={12} key={idx}>
            {item.content && (
              <>
                <QueueDate date={item.date} />
                <QueueItem
                  content={item.content}
                  time={item.time}
                  tab={selectedList}
                  selectedList={selectedList}
                />
              </>
            )}
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BlogView;