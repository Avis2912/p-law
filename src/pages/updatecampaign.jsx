import { Helmet } from 'react-helmet-async';

import { AccountView } from 'src/sectionsk/updatecampaign/view';
import { auth } from 'src/firebase-config/firebase';
// ----------------------------------------------------------------------

export default function ConversationsPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> Update Campaign </title>
      </Helmet>

      <AccountView />
    </>
  );
}
