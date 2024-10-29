import SvgColor from 'src/components/svg-color';
import Iconify from 'src/components/iconify';
import { Icon } from '@iconify/react';
import Box from '@mui/material/Box';

// ----------------------------------------------------------------------


const icon = (name, width=16, height=16) => (
  // <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  <Box sx={{ width: '25px', height: '25px', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '4px',
      display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'absolute', bottom: '11px' }}>
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
    icon: icon('solar:posts-carousel-horizontal-bold'),
  },
  {
    title: 'SEO Strategy',
    path: '/keywords',
    icon: icon('fa-solid:chess-king', 14, 14),
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
