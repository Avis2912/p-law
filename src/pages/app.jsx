import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { AppView } from 'src/sectionsk/overview/view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Router } from 'express';


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
    {/* <Router> */}
      <Helmet>
        <title> Home | Pentra* </title>
      </Helmet>

      <AppView />
      {/* <Route path="/blog/:id" component={CreatorsView} /></Router> */}
    </>
  );
}