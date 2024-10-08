import { Helmet } from 'react-helmet-async';
import BlogView from 'src/sectionsk/weeklyblogs/view/weeklyblogs-view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from 'src/firebase-config/firebase'; // Import auth

export default function BlogPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Drafts | Pentra </title>
      </Helmet>

      <BlogView />
    </>
  );
}