import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const PostsPage = lazy(() => import('src/pages/posts'));
export const CompetitionPage = lazy(() => import('src/pages/competition'));
export const KeywordsPage = lazy(() => import('src/pages/keywords'));
export const ReviewPage = lazy(() => import('src/pages/review'));
export const ReviewsPage = lazy(() => import('src/pages/reviews'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignUpPage = lazy(() => import('src/pages/signup'));
export const SeoPage = lazy(() => import('src/pages/seo'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const WeeklyBlogsPage = lazy(() => import('src/pages/weeklyblogs'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AccountPage = lazy(() => import('src/pages/account'));
export const LeadsPage = lazy(() => import('src/pages/leads'));
export const QueuePage = lazy(() => import('src/pages/queue'));
export const AnalyticsPage = lazy(() => import('src/pages/analytics'));


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <SeoPage />, index: true },
        { path: '/', element: <SeoPage /> },
        { path: 'home', element: <IndexPage /> },
        { path: 'review', element: <ReviewPage /> },
        { path: 'reviews', element: <ReviewsPage /> },
        { path: 'keywords', element: <KeywordsPage /> },
        { path: 'seo', element: <SeoPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'queue', element: <QueuePage /> },
        { path: 'weeklyblogs', element: <WeeklyBlogsPage /> },
        { path: 'posts', element: <PostsPage /> },
        { path: 'competition', element: <CompetitionPage /> },
        { path: 'leads', element: <LeadsPage /> },
        { path: 'account', element: <AccountPage /> },
        { path: 'analytics', element: <AnalyticsPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      path: 'signup',
      element: <SignUpPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
