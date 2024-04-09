import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { BlogView } from 'src/sectionsk/campaigns/view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
        <title> Campaigns </title>
      </Helmet>

      <BlogView />
    </>
  );
}