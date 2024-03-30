import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { BlogView } from 'src/sectionsk/posts/view';

// ----------------------------------------------------------------------

export default function BlogPage() {
  if (!auth.currentUser) {
    window.location.href = '/login';
  }
  return (
    <>
      <Helmet>
        <title> Posts </title>
      </Helmet>

      <BlogView />
    </>
  );
}
