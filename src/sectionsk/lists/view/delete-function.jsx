import { db } from 'src/firebase-config/firebase';
import { deleteDoc, doc } from 'firebase/firestore';


export const deleteList = async (listId) => {
  const listDoc = doc(db, 'lists', listId);
  try {
    await deleteDoc(listDoc);
  } catch (err) {
    alert(err);
  }
};
