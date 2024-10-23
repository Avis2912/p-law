import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
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
    icon: icon('ic_blog'),
  },
  {
    title: 'Content Pane',
    path: '/weeklyblogs',
    icon: icon('ic_blog'),
  },
  {
    title: 'Social Pane',
    path: '/posts',
    icon: icon('ic_blog'),
  },
  {
    title: 'SEO Strategy',
    path: '/keywords',
    icon: icon('ic_blog'),
  },
  {
    title: 'Competition',
    path: '/competition',
    icon: icon('ic_user'),
  },
  {
    title: 'Firm Reviews',
    path: '/reviews',
    icon: icon('ic_user'),
  },
  {
    title: 'Site Leads',
    path: '/leads',
    icon: icon('ic_user'),
  },
  {
    title: 'Post Queue',
    path: '/queue',
    icon: icon('ic_blog'),
  },
  {
    title: 'My Account',
    path: '/account',
    icon: icon('ic_lock'),
  },
  
];

export default navConfig;
