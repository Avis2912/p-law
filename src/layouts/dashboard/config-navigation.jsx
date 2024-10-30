import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';
import { palette } from 'src/theme/palette';

// ----------------------------------------------------------------------

const hexToRBGA = (hex, alpha) => {
  let r = 0; let g = 0; let b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}




const icon = (name, width=16, height=16) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  <Box sx={(theme) => ({ width: '25px', height: '25px', backgroundColor: hexToRBGA('#ffffff', 0.15), borderRadius: '4.5px',
      display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '11px' })}>
  <Icon icon={name} width={width} height={height} />
  </Box>
);

const navConfig = [
  // {
  //   title: 'Home',
  //   path: '/',
  //   icon: icon('ic_analytics'),
  // },
  { 
    title: 'Blog Creator',
    path: '/seo',
    icon: icon('fa-brands:blogger-b', 14.5, 14.5),
  },
  {
    title: 'Content Pane',
    path: '/weeklyblogs',
    icon: icon('fluent:content-view-16-filled'),
  },
  {
    title: 'Social Pane',
    path: '/posts',
    icon: icon('solar:posts-carousel-horizontal-bold', 16.5, 16.5),
  },
  {
    title: 'SEO Strategy',
    path: '/keywords',
    icon: icon('fa-solid:chess-king', 13.5, 13.5),
  },
  {
    title: 'Competition',
    path: '/competition',
    icon: icon('ri:spy-fill'),
  },
  {
    title: 'Firm Reviews',
    path: '/reviews',
    icon: icon('material-symbols:reviews-rounded', 14, 14),
  },
  {
    title: 'Site Leads',
    path: '/leads',
    icon: icon('fluent:chat-32-filled', 14, 14),
  },
  {
    title: 'Post Queue',
    path: '/queue',
    icon: icon('heroicons:queue-list-16-solid'),
  },
  {
    title: 'My Account',
    path: '/account',
    icon: icon('mdi:account-box'),
  },
  
];

export default navConfig;
