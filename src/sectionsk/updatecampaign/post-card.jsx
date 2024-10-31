import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import shadows from '@mui/material/styles/shadows';

// ----------------------------------------------------------------------

export default function PostCard({ post, index }) {
  const { cover, title, view, comment, share, author, createdAt } = post;

  const latestPostLarge = index === -10;

  const latestPost = index === -10 || index === -20;

  const renderAvatar = (
    <div />
  );

  const renderTitle = (
    <Link
      color="inherit"
      variant="subtitle2"
      underline="hover"
      fontSize="17.5px"
      fontFamily=""
      fontWeight="100"
      sx={{
        height: 54,
        overflow: 'hidden',
        WebkitLineClamp: 2,
        marginTop: 1.5,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        ...(latestPostLarge && { typography: 'h3', height: 60 }),
        ...((latestPostLarge || latestPost) && {
          color: 'common.white',
        }),
      }}
    >
      {title}
    </Link>
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
        { number: comment, icon: 'eva:message-circle-fill' },
      ].map((info, _index) => (
        <Stack
          key={_index}
          direction="row"
          sx={{
            ...((latestPostLarge || latestPost) && {
              opacity: 0.48,
              color: 'common.white',
            }),
          }}
        >
          <Iconify width={18} icon={info.icon} sx={{ mr: 0.5 }} />
          <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
        </Stack>
      ))}
    </Stack>
  );

  const renderCover = (
    <div />
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
      {fDate(createdAt)}
    </Typography>
    </Stack>
  );

  const renderStatus = (
    <button
      type="button"
      style={{ 
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#FF9999' ,
        shadows: "none",
        fontSize: "10.8px",
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 5,
        width: 150,
        height: 25,
        borderWidth: 0,
      
      }}
    >
      Public
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

  return (
    <Grid xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 3 : 3}>
      <Card sx = {{ height: 140, }}>
        
        <Box
          sx={{
            mt: 2,
            p: (theme) => theme.spacing(0.005, 2.5, 2, 2.5),
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
  justifyContent="space-between" // Adjusted this to use quotes
  sx={{
    mt: 2,
    color: 'text.disabled',
    width: '100%',
    textAlign: 'right',
    alignItems: 'center', // Changed this to center the items vertically
    justifyContent: 'space-between', // Add this for horizontal spacing

  }}
>
            
          

          {renderDate}
          

          </Stack>
          

          


        </Box>
      </Card>
    </Grid>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};
