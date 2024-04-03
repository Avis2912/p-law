import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { db, auth } from 'src/firebase-config/firebase';
import { ListNamesView } from 'src/sectionsk/listnames/view';
import { getDocs, addDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const queryParams = new URLSearchParams(window.location.search);
const listName = queryParams.get('listName');
const listId = queryParams.get('listId');
const listItems = [{name: "Amanda Cerny", platforms: [true, false, false], handles: ["@amandacerny", "N/A", "N/A"], followers: [1788, 0, 0], country: "USA"}, ];

export default function ListNamesPage() {
  const navigate = useNavigate();
  const [lists, setLists] = useState([null]);
  const listData = collection(db, 'lists');

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
    // const getLists = async () => {
    //   try {
    //     const data = await getDocs(listData);
    //     const retrievedLists = data.docs?.map((doc) => ({
    //         ...doc.data(),
    //         id: doc.id,
    //     })).filter(list => list.listName === listName);
    
    //     setLists(retrievedLists);
    //   } catch (err) {
    //     alert(err);
    //   }
    // };
  
    // getLists();
  }, []); 

  return (
    <>
      <Helmet>
        <title> Lists | Pentra </title>
      </Helmet>

      <ListNamesView listName={listName} listId={listId} />
    </>
  );
}