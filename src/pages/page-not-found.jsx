import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { NotFoundView } from 'src/sectionsk/error';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }
    return (
    <>
      <Helmet>
        <title> 404 Page Not Found </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}
