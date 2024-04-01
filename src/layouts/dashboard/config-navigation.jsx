import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Home',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'SEO Blogger',
    path: '/seo',
    icon: icon('ic_user'),
  },
  {
    title: 'Post Generator',
    path: '/posts',
    icon: icon('ic_blog'),
  },
  {
    title: 'My Site Leads',
    path: '/leads',
    icon: icon('ic_blog'),
  },
  {
    title: 'Competition',
    path: '/competition',
    icon: icon('ic_blog'),
  },
  {
    title: 'Firm Reviews',
    path: '/reviews',
    icon: icon('ic_user'),
  },
  {
    title: 'My Account',
    path: '/account',
    icon: icon('ic_lock'),
  },
  
];

export default navConfig;
