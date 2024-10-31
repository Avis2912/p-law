import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, updateMetadata, getMetadata } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDTHCh3zY33u47WqfBQrmUINYuFe68_0HY",
  authDomain: "pentra-hub.firebaseapp.com",
  projectId: "pentra-hub",
  storageBucket: "pentra-hub.appspot.com",
  messagingSenderId: "153834735221",
  appId: "1:153834735221:web:a5cb4ef6822090f44b9a3c",
  measurementId: "G-HLWN09H5X5"
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
