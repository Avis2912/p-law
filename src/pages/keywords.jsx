import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import UserView from 'src/sectionsk/keywords/view/keywords-view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function UserPage() {
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
        <title> Keywords | Pentra </title>
      </Helmet>

      <UserView />
    </>
  );
}