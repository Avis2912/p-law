const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDySSZ4BcVkOP9XWyKWB-8kcRp35unMVBE",
  authDomain: "pentra-beauty.firebaseapp.com",
  projectId: "pentra-beauty",
  storageBucket: "pentra-beauty.appspot.com",
  messagingSenderId: "442585176085",
  appId: "1:442585176085:web:473bd180ee9c03d4b6d61c",
  measurementId: "G-N3ET2JTE5K"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const doc = (path) => db.doc(path);
const collection = (path) => db.collection(path);

const brandsData = collection('firms');

const uploadSome = async () => {
    try {
        const data = await brandsData.get();
        const userDoc = data.docs.find((docc) => docc.id === 'testlawyers');
        if (userDoc) {
            const newPost = {platform: "LinkedIn", content: "whats good"};
            const userDocRef = doc('firms/testlawyers');
            await userDocRef.update({
                'WEEKLY_POSTS.POSTS': [...userDoc.data().WEEKLY_POSTS.POSTS, newPost]
            });
            console.log('New post added');
            process.exit(0); // Exit the process successfully
        } else {
            console.log('Error: User document not found.');
            process.exit(1); // Exit the process with an error code
        }
    } catch (err) {
        console.log(err);
        process.exit(1); // Exit the process with an error code
    }
};

uploadSome();

