import { Helmet } from 'react-helmet-async';
import LoginView from 'src/sectionsk/login/login-view';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { auth } from 'src/firebase-config/firebase'; // Import auth

export default function LoginPage() {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (!user) {
  //       navigate('/login');
  //     }
  //   });

  //   // Cleanup function
  //   return () => unsubscribe();
  // }, [navigate]);

  return (
    <>
      <Helmet>
        <title> Login | Pentra </title>
      </Helmet>

      <LoginView />
    </>
  );
}