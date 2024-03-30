import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { auth, db } from 'src/firebase-config/firebase';
import { useState, useEffect } from 'react';
import Iconify from 'src/components/iconify';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


import { getDocs, addDoc, collection, doc, updateDoc } from 'firebase/firestore';


import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

// ----------------------------------------------------------------------

export default function AppView() {

  const [brandCampaigns, setBrandCampaigns] = useState([]);
  const [brandName, setBrandName] = useState('');


  const brandsData = collection(db, 'brands');

  const getProfilePictureUrl = async (campaignId) => {
    const storage = getStorage();
    const storageRef = ref(storage, `brands/${auth.currentUser.email}/${campaignId}`);
    try {
      const downloadUrl = await getDownloadURL(storageRef);
      return downloadUrl;
    } catch (err) {
      console.error('Error fetching campaign image:', err);
      // Return a default image or handle accordingly
      return '/assets/images/avatars/avatar_1.jpg';
    }
  };
  
 
  useEffect(() => {
    const getBrandCampaigns = async () => {
      const data = await getDocs(brandsData);
      const userDoc = data.docs.find(docc => docc.id === auth.currentUser.email);
      if (userDoc) {
        const name = userDoc.data().user_name || [];
        const campaigns = userDoc.data().campaigns || [];
        const campaignsWithPfp = await Promise.all(campaigns.map(async (campaign) => {
          const pfpUrl = await getProfilePictureUrl(campaign.campaign_id);
          return { ...campaign, pfpUrl };
        }));
        setBrandCampaigns(campaignsWithPfp);
        setBrandName(name);
      } else {
        alert('Error: User document not found.');
      }
    };
    
    getBrandCampaigns();
  }, [brandsData]);

  const PlaceholderCampaign = {
    id: 'placeholder',
    title: '',
    description: '',
    image: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Base64 encoded transparent GIF
    postedAt: '',
  };
  
  // Calculate how many placeholders are needed
  const placeholdersCount = Math.max(0, 5 - brandCampaigns.length);
  
  // Create an array with your campaigns and placeholders
  const campaignsAndPlaceholders = [
    ...brandCampaigns.slice(0, 5),
    ...Array(placeholdersCount).fill(PlaceholderCampaign),
  ];


  return (
    <Container maxWidth="xl">
      <Typography variant="h3" sx={{ mb: 5 }}>
        Hey {brandName}, Welcome Back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Gifts This Month"
            total={714000}
            color ="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Conversations"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Influencers"
            total={1723315}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Unread Mails"
            total={234}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>


        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Creator Conversations"
            chart={{
              labels: [
                '01/01/2003',
                '02/01/2003',
                '03/01/2003',
                '04/01/2003',
                '05/01/2003',
                '06/01/2003',
                '07/01/2003',
                '08/01/2003',
                '09/01/2003',
                '10/01/2003',
                '11/01/2003',
              ],
              series: [
                {
                  name: 'Last Month',
                  type: 'column',
                  fill: 'solid',
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: 'This Month',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                // {
                //   name: 'Last Month',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                // },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppOrderTimeline
            title="Addresses Received"

            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                '1983, orders, $4220',
                '12 Invoices have been paid',
                'Order #37745 from September',
                'New order placed #XF-2356',
                'New order placed #XF-2346',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>

        {/* <Grid xs={12} md={6} lg={8}>
          <AppConversionRates
            title="Conversion Rates"
            subheader="(+43%) than last year"
            chart={{
              series: [
                { label: 'Italy', value: 400 },
                { label: 'Japan', value: 430 },
                { label: 'China', value: 448 },
                { label: 'Canada', value: 470 },
                { label: 'France', value: 540 },
                { label: 'Germany', value: 580 },
                { label: 'South Korea', value: 690 },
                { label: 'Netherlands', value: 1100 },
                { label: 'United States', value: 1200 },
                { label: 'United Kingdom', value: 1380 },
              ],
            }}
          />
        </Grid> */}

        {/* <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Subject"
            chart={{
              categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
              series: [
                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid> */}

<Grid xs={12} md={6} lg={8} sx={{ height: 400 }}>
  <AppNewsUpdate
    title="Active Campaigns"
    list={campaignsAndPlaceholders.map((campaign, index) => ({
      id: campaign.campaign_id,
      title: campaign.campaign_name || '',
      description: campaign.campaign_description || '',
      image: campaign.image || 'public/assets/images/avatars/kk.png',
      postedAt: campaign.campaign_end_date || '',
    }))}
  />
</Grid>


        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Creator Demographics"
            chart={{
              series: [
                { label: 'The US', value: 60 },
                { label: 'Europe', value: 30 },
                { label: 'Asia', value: 40 },
                { label: 'Others', value: 30 },
              ],
            }}
          />
        </Grid>

        

        <Grid xs={12} md={6} lg={4}>
          <AppTrafficBySite
            title="Conversations by Platform"
            list={[
              {
                name: 'FaceBook',
                value: 323234,
                icon: <Iconify icon="eva:facebook-fill" color="#1877F2" width={32} />,
              },
              {
                name: 'Google',
                value: 341212,
                icon: <Iconify icon="eva:google-fill" color="#DF3E30" width={32} />,
              },
              {
                name: 'Linkedin',
                value: 411213,
                icon: <Iconify icon="eva:linkedin-fill" color="#006097" width={32} />,
              },
              {
                name: 'Twitter',
                value: 443232,
                icon: <Iconify icon="eva:twitter-fill" color="#1C9CEA" width={32} />,
              },
            ]}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppTasks
            title="Intro Tasks"
            list={[
              { id: '1', name: 'Create FireStone Logo' },
              { id: '2', name: 'Add SCSS and JS files if required' },
              { id: '3', name: 'Stakeholder Meeting' },
              { id: '4', name: 'Scoping & Estimations' },
              { id: '5', name: 'Sprint Showcase' },
            ]}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
