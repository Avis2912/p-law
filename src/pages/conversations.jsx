import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { ConversationsView } from 'src/sectionsk/conversations/view';

// ----------------------------------------------------------------------

export default function ConversationsPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> Conversations </title>
      </Helmet>

      <ConversationsView />
    </>
  );
}
