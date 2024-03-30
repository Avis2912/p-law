import { Helmet } from 'react-helmet-async';
import { CreatorsView } from 'src/sectionsk/creators/view';
import React, { useState, useEffect } from 'react'; // <-- Import useState and useEffect
import { auth } from 'src/firebase-config/firebase';
// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true); // <-- Loading state
  if (!auth.currentUser) {
    window.location.href = '/login';
  }
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
        <title> Creators | Pentra </title>
      </Helmet>

      <CreatorsView />
    </>
  );
}
