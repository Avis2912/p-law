import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { db, auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import { getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import PageTitle from 'src/components/PageTitle';
import Iconify from 'src/components/iconify';
import QueueItem from '../queue-item';
import QueueDate from '../queue-date';
import EmptyList from '../empty-list';

const BlogView = () => {
  const navigate = useNavigate();
  const [isUpdateTime, setIsUpdateTime] = useState(false);
  const [plan, setPlan] = useState('Trial Plan');
  const [weeklyBlogs, setWeeklyBlogs] = useState([]);
  const [selectedList, setSelectedList] = useState('Published');
  const [queueData, setQueueData] = useState({    
    SCHEDULED: [],
    PUBLISHED: [
      // { date: '10/24/24', title: 'Content Marketing Trends', content: '', time: '4:30 PM', posts: [] },
      // { date: '10/24/24', title: '10 New Organic Marketing Trends', content: '', time: '5:30 PM', posts: [] },
      // { date: '10/25/24', title: 'How to Create A+ Legal SEO Content', content: '', time: '5:30 PM', posts: [] },
      // { date: '10/26/24', title: 'Law Firm Growth, Explained Simply', content: '', time: '6:30 PM', posts: [] },
    ],
    DRAFTS: []
  });

  useEffect(() => {
    const getFirmData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email)); 
        if (userDoc.exists()) {
          const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
          if (firmDoc.exists()) {
            await setQueueData(firmDoc.data().QUEUE);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    getFirmData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkScheduledPosts = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
          const firmDocRef = doc(db, 'firms', userDoc.data().FIRM);
          const firmDoc = await getDoc(firmDocRef);
          
          if (firmDoc.exists()) {
            const currentQueue = firmDoc.data().QUEUE;
            const now = new Date();
            
            // Check scheduled posts
            const { toPublish, remaining } = currentQueue.SCHEDULED.reduce((acc, post) => {
              const [month, day, year] = post.date.split('/');
              const [time, meridiem] = post.time.split(' ');
              const [hours, minutes] = time.split(':');
              
              const postDate = new Date(
                2000 + parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10),
                (parseInt(hours, 10) % 12) + (meridiem === 'PM' ? 12 : 0),
                parseInt(minutes, 10)
              );
              
              if (postDate <= now) {
                acc.toPublish.push(post);
              } else {
                acc.remaining.push(post);
              }
              return acc;
            }, { toPublish: [], remaining: [] });
            
            // If there are posts to publish
            if (toPublish.length > 0) {
              await updateDoc(firmDocRef, {
                'QUEUE.SCHEDULED': remaining,
                'QUEUE.PUBLISHED': [...currentQueue.PUBLISHED, ...toPublish]
              });
              
              // Update local state
              setQueueData(prev => ({
                ...prev,
                SCHEDULED: remaining,
                PUBLISHED: [...prev.PUBLISHED, ...toPublish]
              }));
            }
          }
        }
      } catch (err) {
        console.error('Error checking scheduled posts:', err);
      }
    };

    // Check immediately and set up interval
    checkScheduledPosts();
    const interval = setInterval(checkScheduledPosts, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const buttonLabels = ['Published', 'Scheduled', 'Drafts'];
  const icons = ['iconamoon:send-thin', 'octicon:clock-24', 'mynaui:edit-one'];

  const groupByDate = (items) => items.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

  const sortedGroupedItems = (items) => {
    const grouped = groupByDate(items);
    const sortedDates = Object.keys(grouped).sort((a, b) => {
      const parseDate = (dateString) => {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(`20${year}`, month - 1, day); // Adjust year to 4 digits
      };
      return parseDate(a) - parseDate(b);
    });

    return sortedDates.map(date => ({
      date,
      items: grouped[date].sort((a, b) => {
        // Convert times to comparable values (24hr format)
        const parseTime = (timeStr) => {
          const [time, meridiem] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (meridiem === 'PM' && hours !== 12) hours += 12;
          if (meridiem === 'AM' && hours === 12) hours = 0;
          return hours * 60 + minutes;
        };
        
        // Sort in descending order (most recent first)
        return parseTime(b.time) - parseTime(a.time);
      })
    }));
  };

  return (
    <Container>
      <Stack direction="row" mb={-0.75} alignItems="center" justifyContent="space-between">
        <PageTitle title={`${selectedList === buttonLabels[2] ? 'Draft' : selectedList} Posts`} />
        <Stack direction="row" spacing={2} mb={2}>
          <div style={{ 
            display: 'flex', borderRadius: 6, 
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

      {queueData[selectedList.toUpperCase()].length === 0 ?
        <EmptyList selectedList={selectedList} />
        : <Grid container spacing={1.5}>
          {sortedGroupedItems(queueData[selectedList.toUpperCase()])
            .map((group, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={12}>
                  <QueueDate date={group.date} />
                </Grid>
                {group.items.map((item, itemIdx) => (
                  <Grid item xs={12} key={itemIdx}>
                    <QueueItem
                      content={item.content}
                      title={item.title}
                      time={item.time}
                      tab={selectedList}
                      selectedList={selectedList}
                      date={group.date}
                      setQueueData={setQueueData}
                    />
                  </Grid>
                ))}
              </React.Fragment>
            ))}
        </Grid>
      }
    </Container>
  );
};

export default BlogView;