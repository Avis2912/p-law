import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, updateMetadata, getMetadata } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDySSZ4BcVkOP9XWyKWB-8kcRp35unMVBE",
  authDomain: "pentra-beauty.firebaseapp.com",
  projectId: "pentra-beauty",
  storageBucket: "pentra-beauty.appspot.com",
  messagingSenderId: "442585176085",
  appId: "1:442585176085:web:473bd180ee9c03d4b6d61c",
  measurementId: "G-N3ET2JTE5K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
const storage = getStorage(app);

export async function getCoverImages() {
  const coversRef = ref(storage, 'covers');
  const result = await listAll(coversRef);
  const cover_images = {};

  const downloadURLPromises = result.items.map(item => getDownloadURL(item));
  const downloadURLs = await Promise.all(downloadURLPromises);

  const metadataPromises = result.items.map(item => getMetadata(item));
  const metadatas = await Promise.all(metadataPromises);

  for (let i = 0; i < metadatas.length; i += 1) {
    const id = metadatas[i].customMetadata?.customID;
    if (id) {
      cover_images[id] = downloadURLs[i];
    }
  }

  return cover_images;
}

export async function getImageByID(id) {
  const coversRef = ref(storage, 'covers');
  const result = await listAll(coversRef);

  const metadataPromises = result.items.map(item => getMetadata(item));
  const metadatas = await Promise.all(metadataPromises);

  for (let i = 0; i < metadatas.length; i += 1) {
    if (metadatas[i].customMetadata?.customID === id.toString()) {
      return getDownloadURL(result.items[i]);
    }
  }

  throw new Error('Image with specified ID not found.');
}

export async function addNewImage(file) {
  const coversRef = ref(storage, 'covers');
  const allImages = await listAll(coversRef);
  
  // Finding the highest customID among existing images
  const metadataPromises = allImages.items.map(item => getMetadata(item));
  const metadatas = await Promise.all(metadataPromises);
  
  let maxID = 0;
  metadatas.forEach(metadata => {
    if (metadata.customMetadata?.customID && +metadata.customMetadata.customID > maxID) {
      maxID = +metadata.customMetadata.customID;
    }
  });

  // Set the customID for the new image as maxID + 1
  const newID = maxID + 1;

  const newImageRef = ref(storage, `covers/image_${newID}.jpg`);
  await uploadBytes(newImageRef, file, {
    customMetadata: {
      'customID': newID.toString()
    }
  });

  return newID;  // Return the customID of the new image for reference
}

export const creator_avatars = getCoverImages();
