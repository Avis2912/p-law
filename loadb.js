const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");
const axios = require('axios');

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

const fetchAndStoreBlogs = async (username, domain) => {
    try {
        const response = await axios.get(`https://${domain}/wp-json/wp/v2/posts`);
        const blogs = response.data.map(blog => ({
            TITLE: blog.title.rendered,
            CONTENT: blog.content.rendered,
            LINK: blog.link
        }));

        const userDocRef = doc(`firms/${username}`);
        await userDocRef.update({
            BLOG_DATA: { 
                BIG_BLOG: blogs
            }, 
        }, { merge: true });
        console.log('Blogs fetched and stored');
    } catch (error) {
        console.error('Error fetching and storing blogs:', error);
    }
};

fetchAndStoreBlogs('Ridley Law Offices', 'ridleylawoffices.com');
