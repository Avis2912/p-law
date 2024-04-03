import { Helmet } from 'react-helmet-async';
import { CreatorsView } from 'src/sectionsk/seo/view';
import React, { useState, useEffect } from 'react';
import { auth } from 'src/firebase-config/firebase';
import { useNavigate } from 'react-router-dom';

export default function SeoPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Simulate a network request or some loading process
    setTimeout(() => {
      setIsLoading(false); // Hide the loading spinner after the "loading process" is done
    }, 1); // Example: 2 seconds delay. Adjust as needed.
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div />
        {/* Replace "Loading..." with your loading component or spinner */}
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title> SEO | Pentra </title>
      </Helmet>

      <CreatorsView />
    </>
  );
}