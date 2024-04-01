import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { ConversationsView } from 'src/sectionsk/campaignpage/view';

// ----------------------------------------------------------------------

export default function ConversationsPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> Campaign Page </title>
      </Helmet>

      <ConversationsView />
    </>
  );
}
