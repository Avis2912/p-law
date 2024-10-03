const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyDTHCh3zY33u47WqfBQrmUINYuFe68_0HY",
    authDomain: "pentra-hub.firebaseapp.com",
    projectId: "pentra-hub",
    storageBucket: "pentra-hub.appspot.com",
    messagingSenderId: "153834735221",
    appId: "1:153834735221:web:a5cb4ef6822090f44b9a3c",
    measurementId: "G-HLWN09H5X5"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const doc = (path) => db.doc(path);
const collection = (path) => db.collection(path);

const replaceCompetition = async (firmId1, firmId2) => {
    try {
        const firm1DocRef = doc(`firms/${firmId1}`);
        const firm2DocRef = doc(`firms/${firmId2}`);

        const firm1Doc = await firm1DocRef.get();
        const firm2Doc = await firm2DocRef.get();

        if (!firm1Doc.exists) {
            console.log(`Error: Firm document with ID ${firmId1} not found.`);
            return;
        }

        if (!firm2Doc.exists) {
            console.log(`Error: Firm document with ID ${firmId2} not found.`);
            return;
        }

        const competitionData = firm1Doc.data().COMPETITION;

        await firm2DocRef.update({
            COMPETITION: competitionData
        });

        console.log(`COMPETITION data from firm ${firmId1} has been copied to firm ${firmId2}.`);
    } catch (err) {
        console.log('Error updating COMPETITION data:', err);
    }
};

// Example usage
replaceCompetition('STR Law Guys', 'Raval Trial Law');