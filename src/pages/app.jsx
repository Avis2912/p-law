import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { AppView } from 'src/sectionsk/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }  return (
    <>
      <Helmet>
        <title> Home | Pentra* </title>
      </Helmet>

      <AppView />
    </>
  );
}
