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
        } else {console.log('Error: User document not found.'); process.exit(1); }
    } catch (err) {
        console.log(err);
        process.exit(1); // Exit the process with an error code
    }
};

const newUser = async (docName, bigBlog, competition, firmInfo) => {
    try {
        const userDocRef = doc(`firms/${docName}`);
        await userDocRef.set({

            FIRM_INFO: firmInfo,

            BLOG_DATA: {
                LINK_LIST: {
                    "How to get the compensation you deserve": "https://www.1800lionlaw.com/blog/how-to-get-the-compensation-you-deserve",
                    "What to do after a car accident": "https://www.1800lionlaw.com/blog/what-to-do-after-a-car-accident",
                    "How to protect your assets": "https://www.1800lionlaw.com/blog/how-to-protect-your-assets",
                },
                SMALL_BLOG: [
                "How to get the compensation you deserve",
                "What to do after a car accident",
                "How to protect your assets",
                ],
                BIG_BLOG: bigBlog,
            },

            LEADS: [{
                NAME: "Sample John",
                EMAIL: "johnsample@gmail.com",
                NUMBER: "542-123-4567",
                SUMMARY: "Was in a car accident and needs help.",
                DATE_TIME: "04/04/24 | 12:54 PM",
                CONVERSATION: [
                    {assistant: `Hello, welcome to ${docName}! How can I help you today?`},
                    {user: `I was in a car accident and I need help.`},
                ]}, { 
                NAME: "Sample Sarah",
                EMAIL: "sarahsample@gmail.com",
                NUMBER: "542-123-4567",
                SUMMARY: "Looking for asset protection services.",
                DATE_TIME: "04/06/24 | 7:54 PM",
                CONVERSATION: [
                    {assistant: `Hello, welcome to ${docName}! How can I help you today?`},
                    {user: `Hey! I am looking for asset protection services.`},
                ]}
            ],

            WEEKLY_POSTS: {
                LAST_DATE: "03/31/24",
                POSTS: [
                    {platform: "LinkedIn", content: "<h1>Example Post</h1><br>This is what a weekly post idea looks like."},
                    {platform: "Facebook", content: "<h1>Example Post</h1><br>This is what a weekly post idea looks like."},
                    {platform: "Instagram", content: "<h1>Example Post</h1><br>This is what a weekly post idea looks like."},
            ]},

            COMPETITION: competition,

            REVIEWS: {
                LINKS: {
                    "Google": "https://www.google.com",
                    "Yelp": "https://www.yelp.com",
                    "Facebook": "https://www.facebook.com",
                },
                SELECTION: {"Google": "https://www.google.com/reviews"},
            },

            GEN_POSTS: [],

        }, { merge: true });
        console.log('User document created or updated');
    } catch (err) {
        console.log(err);
    }
};

// uploadSome();
newUser(docName = 'testlawyers',

firmInfo = {
    CONTACT_US: "www.1800lionlaw.com",
    NAME: "Test Lawyers",
    LOCATION: "Atlanta, GA",
    DESCRIPTION: "We are a law firm that specializes in personal injury cases. We are dedicated to helping our clients get the compensation they deserve.",
    IMAGE: 'https://firebasestorage.googleapis.com/v0/b/pentra-beauty.appspot.com/o/Gemini_Generated_Image_w2bk6ew2bk6ew2bk.jpeg?alt=media&token=555ce545-de49-4e1f-becf-9b985933a117',
    MODEL: 2,
    PLAN: "Full Suite",
},

bigBlog = [
    {
        TITLE: "How to get the compensation you deserve",
        CONTENT: "If you have been injured in an accident, you may be entitled to compensation. Here are some tips to help you get the compensation you deserve.",
        LINK: "https://www.1800lionlaw.com/blog/how-to-get-the-compensation-you-deserve",
    },
    {
        TITLE: "What to do after a car accident",
        CONTENT: "If you have been in a car accident, it is important to take the right steps to protect yourself and your rights. Here are some things you should do after a car accident.",
        LINK: "https://www.1800lionlaw.com/blog/what-to-do-after-a-car-accident",
    },
    {
        TITLE: "How to protect your assets",
        CONTENT: "Protecting your assets is important to ensure that your loved ones are taken care of in the future. Here are some tips to help you protect your assets.",
        LINK: "https://www.1800lionlaw.com/blog/how-to-protect-your-assets",
    },
    ],
    
competition = {
    LAST_DATE: "03/31/24",
    MartinLawyers: {
        TRAFFIC: {"April": 32000, "March": 30000, "February": 28000},
        BLOGS_THIS_MONTH: {
            'Title 1 || 31/03/24': 'https://www.martinlawyers.com/blog/title-1'
        },
        LINKEDIN_DATA: {
            EMPLOYEE_DISTRIBUTION: {},
            EMPLOYEE_GROWTH: [],
            JOB_OPENINGS: [{}],
        }
    }
},
);
