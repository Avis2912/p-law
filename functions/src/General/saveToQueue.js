import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from 'src/firebase-config/firebase';

export default async function (type, content) {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
      if (userDoc.exists()) {
        const firmRef = doc(db, 'firms', userDoc.data().FIRM);
        const firmDoc = await getDoc(firmRef);
        
        if (firmDoc.exists()) {
          const h1Match = content.match(/<h1>(.*?)<\/h1>/);
          const title = h1Match ? h1Match[1] : 'Untitled';
          const currentDate = new Date();
          const date = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
          const time = currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
          
          const queueData = firmDoc.data().QUEUE || {};
          const updatedQueue = {
            ...queueData,
            [type]: [
              ...(queueData[type] || []),
              {
                content,
                title,
                date,
                time,
              }
            ]
          };
          
          await updateDoc(firmRef, { QUEUE: updatedQueue });
        }
      }
    } catch (err) {
      console.error(err);
    }
};