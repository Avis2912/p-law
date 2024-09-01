import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import AccountView from 'src/sectionsk/account/view/account-view';
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
        <title> Account | Pentra </title>
      </Helmet>

      <AccountView />
    </>
  );
}