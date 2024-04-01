import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { auth } from 'src/firebase-config/firebase';
import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import shadows from '@mui/material/styles/shadows';
import { CardActionArea } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage'; // Import necessary Firebase Storage functions


// ----------------------------------------------------------------------

export default function PostCard({ campaign, index, }) {
  // const { cover, title, conversations, author, createdAt } = post;

  const latestPostLarge = index === -10;

  const latestPost = index === -10 || index === -20;

  const [pfp, setPfp] = useState('/assets/images/avatars/bg1.png');

  

 useEffect (() => {
  const getPfp = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `brands/${auth.currentUser.email}/${campaign.campaign_id}`);
      const downloadUrl = await getDownloadURL(storageRef);
      setPfp(downloadUrl);
      return null;
    } catch (err) {
      console.error('Error fetching image:', err);
      return ''; // Return an empty string if there's an error
    }
  };
  getPfp();
 }, [campaign.campaign_id]);

  const renderAvatar = (
    <Avatar

      // alt={author.name}

      // src={author.avatarUrl}

      sx={{
        zIndex: 9,
        width: 32,
        height: 32,
        position: 'absolute',
        left: (theme) => theme.spacing(3),
        bottom: (theme) => theme.spacing(-2),
        ...((latestPostLarge || latestPost) && {
          zIndex: 9,
          top: 24,
          left: 24,
          width: 40,
          height: 40,
        }),
      }}
    />
  );

  const renderTitle = (
    <>
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      sx={{
        height: 47,
        width: '100%',
        fontSize:'16px',
        overflow: 'hidden',
        WebkitLineClamp: 2,
        marginTop: 3.8,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h5', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {campaign ? campaign.campaign_name : "N/A"}
      <Typography>
            {campaign ? campaign.campaign_description : "N/A"}
    </Typography>
    </Link>
    </>
  );

  const renderInfo = (
    <Stack
      direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="left"
      width="100%"
      paddingLeft="4px"
      sx={{
        mt: 3,
        color: 'text.disabled',
        width: '100%',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
      {[
        { number: 20, icon: 'eva:message-circle-fill' },
      ].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          alignItems="center"
          sx={{
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={18} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography fontSize="12px" variant="caption">{campaign.campaign_respondees.length}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderCover = (
    <Box
      component="img"
      alt="campaign picture"
      src={pfp}
      sx={{
        top: 0,
        width: 1,
        height: 260,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderDate = (
    <Stack
    direction="row"
      flexWrap="wrap"
      spacing={1.5}
      justifyContent="left"
      width="100%"
    >
    <Typography
      variant="caption"
      component="div"
      sx={{
        mb: 2,
        marginTop: 1.5,
        width: "30",
        justifyContent: "center",
        color: 'text.disabled',
        ...((latestPostLarge || latestPost) && {
          opacity: 0.48,
          color: 'common.white',
        }),
      }}
    >
      {campaign ? campaign.campaign_date : "N/A"}
    </Typography>
    </Stack>
  );

  const renderStatus = (
    <button
      type="button"
      style={{ 
        color: 'white',
        fontWeight: '600',
        backgroundColor: campaign.campaign_status ? '#79c97e' : '#f07e75',
        shadows: "none",
        fontSize: "10.8px",
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 50,
        width: 120,
        height: 25,
        borderWidth: 0,
      
      }}
    >
      {campaign.campaign_status ? "Live" : "Over"}
    </button>
  );
  

  const renderShape = (
    <SvgColor
      color="paper"
      sx={{
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: 'absolute',
        color: 'background.paper',
      }}
    />
  );

  const handleClick = () => {
    window.location.href = `/campaignpage?id=${campaign.campaign_id}&name=${campaign.campaign_name}`
  }

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 3 : 3}>
      <Card sx = {{ height: 380, }} onClick={() => handleClick()}>
        <CardActionArea>
        <Box
          sx={{
            position: 'relative',
            pt: 'calc(100% * 3 / 4)',
            ...((latestPostLarge || latestPost) && {
              pt: 'calc(100% * 4 / 3)',
              '&:after': {
                top: 0,
                content: "''",
                width: '100%',
                height: '100%',
                position: 'absolute',
                bgcolor: (theme) => alpha(theme.palette.grey[900], 0),
              },
            }),
            
          }}
        >


          {renderCover}
        </Box>

        <Box
          sx={{
            mt: 2,
            p: (theme) => theme.spacing(5.5, 2.5, 2, 2.5),
            ...((latestPostLarge || latestPost) && {
              width: 1,
              bottom: 0,
              position: 'absolute',
            }),
          }}

          
        >

          {renderTitle}

          <Stack
  direction="row"
  flexWrap="none"
  spacing={1}
  justifyContent="space-evenly" // Adjusted this to use quotes
  sx={{
    mt: 2,
    color: 'text.disabled',
    width: '100%',
    textAlign: 'right',
    alignItems: 'center', // Changed this to center the items vertically
    justifyContent: 'space-evenly', // Add this for horizontal spacing

  }}
>
            
          

          {renderInfo}


          {renderDate}
          {renderStatus}


          </Stack>
          

          


        </Box>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  campaign: PropTypes.object.isRequired,
  index: PropTypes.number,
};
