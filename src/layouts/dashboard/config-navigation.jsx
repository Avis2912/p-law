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
    title: 'Blog Generator',
    path: '/seo',
    icon: icon('ic_blog'),
  },
  {
    title: 'Weekly Blogs',
    path: '/weeklyblogs',
    icon: icon('ic_blog'),
  },
  {
    title: 'Social Posts',
    path: '/posts',
    icon: icon('ic_blog'),
  },
  {
    title: 'Site Leads',
    path: '/leads',
    icon: icon('ic_user'),
  },
  {
    title: 'Firm Reviews',
    path: '/reviews',
    icon: icon('ic_user'),
  },
  {
    title: 'Competition',
    path: '/competition',
    icon: icon('ic_user'),
  },
  {
    title: 'My Account',
    path: '/account',
    icon: icon('ic_lock'),
  },
  
];

export default navConfig;
