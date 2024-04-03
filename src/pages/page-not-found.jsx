import { Helmet } from 'react-helmet-async';
import { NotFoundView } from 'src/sectionsk/error';
import { auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function NotFoundPage() {
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
        <title> 404 Page Not Found </title>
      </Helmet>

      <NotFoundView />
    </>
  );
}