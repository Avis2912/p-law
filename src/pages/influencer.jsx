import { Helmet } from 'react-helmet-async';
import { auth } from 'src/firebase-config/firebase';
import { InfluencerView } from 'src/sectionsk/influencer/view';
import { useState, useEffect } from 'react';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// ----------------------------------------------------------------------
const queryParams = new URLSearchParams(window.location.search);
const pentra_id = queryParams.get('pentra_id');

export default function ListsPage() {
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        navigate('/login');
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, [navigate]); // Only navigate is a dependency

  return (
    <>
      <Helmet>
        <title> {pentra_id} </title>
      </Helmet>

      <InfluencerView/>
    </>
  );
}