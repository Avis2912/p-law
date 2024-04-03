import { Helmet } from 'react-helmet-async';
import { AccountView } from 'src/sectionsk/updatecampaign/view';
import { auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function ConversationsPage() {
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
        <title> Update Campaign </title>
      </Helmet>

      <AccountView />
    </>
  );
}