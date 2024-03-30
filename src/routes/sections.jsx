import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const IndexPage = lazy(() => import('src/pages/app'));
export const PostsPage = lazy(() => import('src/pages/posts'));
export const ListsPage = lazy(() => import('src/pages/lists'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const SignUpPage = lazy(() => import('src/pages/signup'));
export const SeoPage = lazy(() => import('src/pages/seo'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const AccountPage = lazy(() => import('src/pages/account'));
export const InfluencerPage = lazy(() => import('src/pages/influencer'));
export const ConversationsPage = lazy(() => import('src/pages/conversations'));
export const ListNamesPage = lazy(() => import('src/pages/listnames'));
export const NewCampaignPage = lazy(() => import('src/pages/newcampaign'));
export const UpdateCampaignPage = lazy(() => import('src/pages/updatecampaign'));
export const CampaignPage = lazy(() => import('src/pages/campaignpage'));







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
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'seo', element: <SeoPage /> },
        { path: 'posts', element: <PostsPage /> },
        { path: 'lists', element: <ListsPage /> },
        { path: 'listnames', element: <ListNamesPage /> },
        { path: 'conversations', element: <ConversationsPage /> },
        { path: 'account', element: <AccountPage /> },
        { path: 'influencer', element: <InfluencerPage /> },
        { path: 'newcampaign', element: <NewCampaignPage /> },
        { path: 'campaignpage', element: <CampaignPage /> },
        { path: 'updatecampaign', element: <UpdateCampaignPage /> },




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
