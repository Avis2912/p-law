import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { AppView } from 'src/sectionsk/overview/view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AppPage() {
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
        <title> Home | Pentra* </title>
      </Helmet>

      <AppView />
    </>
  );
}