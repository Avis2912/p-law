import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { ConversationsView } from 'src/sectionsk/campaignpage/view';
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
        <title> Campaign Page </title>
      </Helmet>

      <ConversationsView />
    </>
  );
}