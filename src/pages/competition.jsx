import { Helmet } from 'react-helmet-async';
import ListsView from 'src/sectionsk/competition/view/competition-view';
import { auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ListsPage() {
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
        <title> Competition | Pentra </title>
      </Helmet>

      <ListsView />
    </>
  );
}