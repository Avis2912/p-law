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
const collection = (path) => db.collection(path);

const updateFirmsWithQueue = async () => {
    try {
        const firmsSnapshot = await collection('firms').get();
        const strategyData = {};
        const queueData = {
            SCHEDULED: [],
            PUBLISHED: [
            //   { date: '10/24/2024', title: 'Content Marketing Trends', content: '', time: '4:30 PM', posts: [] },
            ],
            DRAFTS: []
        };
        const competitionData = {
        };

        const batch = db.batch();

        firmsSnapshot.forEach(doc => {
            const firmRef = doc.ref;
            batch.update(firmRef, { QUEUE: queueData, COMPETITION: competitionData, STRATEGY: strategyData });
        });

        await batch.commit();
        console.log('ALL fields added to all firm documents');
    } catch (error) {
        console.error('Error updating firms with QUEUE:', error);
    }
};

updateFirmsWithQueue();