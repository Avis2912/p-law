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
            LAST_DATE: "03/31/24",
            COMPETITION: [{
                NAME: 'Sample Firm',
                COMP_SITE: 'bergplummer.com',
                ADS: {
                    ADS: [
                        {preview: 'https://tpc.googlesyndication.com/archive/simgad/16467954415080738021'},
                        {preview: 'https://tpc.googlesyndication.com/archive/simgad/16467954415080738021'},
                    ],
                    SPEND: "$13,000"
                },
                TRAFFIC: {
                    TRAFFIC: [1200, 1400, 1300, 1500],
                    RANKING_FOR: [
                        {
                            KEYWORD: 'Dallas asset protection',
                            MONTHLY_SEARCHES: [1000, 1200, 1100, 1300],
                            EST_VOLUME: 1000, COMPETITION: 'LOW',
                        },
                        {
                            KEYWORD: 'Asset protection firms near me',
                            MONTHLY_SEARCHES: [800, 900, 1000, 1100],
                            EST_VOLUME: 800, COMPETITION: 'LOW',
                        },
                        {
                            KEYWORD: 'Estate protection attorneys',
                            MONTHLY_SEARCHES: [700, 800, 900, 1000],
                            EST_VOLUME: 700, COMPETITION: 'LOW',
                        }
                    ],
                },
                BLOGS: [
                    { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
                    { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
                    { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
                    { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
                ],
                JOBS: [
                    { TITLE: 'FT Realtor', POSTED: 'A Month Ago', LINK: 'hi.com', LOCATION: 'Dallas, TX', SALARY: '$100,000', TYPE: 'Full-Time' },
                    { TITLE: 'Real Estate Attorney', POSTED: 'Two Weeks Ago', LINK: 'hello.com', LOCATION: 'Dallas, TX', SALARY: '$150,000', TYPE: 'Full-Time' },
                    { TITLE: 'Financial Planner', POSTED: 'Three Weeks Ago', LINK: 'hey.com', LOCATION: 'Dallas, TX', SALARY: '$90,000', TYPE: 'Full-Time' },
                    { TITLE: 'Estate Planning Attorney', POSTED: 'Four Weeks Ago', LINK: 'howdy.com', LOCATION: 'Dallas, TX', SALARY: '$120,000', TYPE: 'Full-Time' },
                ],
                REVIEWS: [{
                    NAME: 'Alice Johnson', REVIEW: 'Excellent service and support!',
                    PFP: "https://lh3.googleusercontent.com/a-/ALV-UjUfSRpYaFVPK4EjE-zcezcB-SgVZOGuVbZwO_dUN1ZDrFkg_Tnw=s40-c-rp-mo-br100",
                    RATING: 5, DATE: '10/01/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'Bobby Brown', REVIEW: 'Very professional and helpful!',
                    PFP: "https://www.georgetown.edu/wp-content/uploads/2022/02/Jkramerheadshot-scaled-e1645036825432-1050x1050-c-default.jpg",
                    RATING: 5, DATE: '10/05/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'Charlie Davis', REVIEW: 'Highly recommend their services!',
                    PFP: "https://www.jordanharbinger.com/wp-content/uploads/2018/09/be-the-most-interesting-360x360.jpg",
                    RATING: 5, DATE: '10/10/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'David Evans', REVIEW: 'Great team and great results!',
                    PFP: "https://media.licdn.com/dms/image/v2/C5603AQHNO4MdXRNaWw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516828507141?e=2147483647&v=beta&t=5FnMImfL0l2S785EoDOxB7o-b4vPKDZKU4XqMSxzR3s",
                    RATING: 5, DATE: '10/15/21', REVIEW_URL: 'https://www.google.com/',
                }
            ],
            },
            {
                NAME: 'Sample Firm 2',
                COMP_SITE: 'injuryattorneyofdallas.com',
                ADS: {
                    ADS: [
                        {preview: 'https://tpc.googlesyndication.com/archive/simgad/16467954415080738021'},
                        {preview: 'https://tpc.googlesyndication.com/archive/simgad/16467954415080738021'},
                    ],
                    SPEND: "$15,000"
                },
                TRAFFIC: {
                    TRAFFIC: [1500, 1600, 1700, 1800],
                    RANKING_FOR: [
                        {
                            KEYWORD: 'Dallas injury attorney',
                            MONTHLY_SEARCHES: [1100, 1200, 1300, 1400],
                            EST_VOLUME: 1100, COMPETITION: 'MEDIUM',
                        },
                        {
                            KEYWORD: 'Best injury lawyer in Dallas',
                            MONTHLY_SEARCHES: [900, 1000, 1100, 1200],
                            EST_VOLUME: 900, COMPETITION: 'MEDIUM',
                        },
                        {
                            KEYWORD: 'Personal injury attorney Dallas',
                            MONTHLY_SEARCHES: [800, 900, 1000, 1100],
                            EST_VOLUME: 800, COMPETITION: 'MEDIUM',
                        }
                    ],
                },
                BLOGS: [
                    { TITLE: 'How to Choose the Right Injury Attorney', DATE: '10/01/21', LINK: 'example4.com' },
                    { TITLE: 'Understanding Personal Injury Claims', DATE: '10/05/21', LINK: 'example5.com' },
                    { TITLE: 'Steps to Take After an Accident', DATE: '10/10/21', LINK: 'example6.com' },
                    { TITLE: 'The Importance of Legal Representation in Injury Cases', DATE: '10/15/21', LINK: 'example7.com' },
                ],
                JOBS: [
                    { TITLE: 'FT Injury Attorney', POSTED: 'A Month Ago', LINK: 'hi.com', LOCATION: 'Dallas, TX', SALARY: '$100,000', TYPE: 'Full-Time' },
                    { TITLE: 'Personal Injury Lawyer', POSTED: 'Two Weeks Ago', LINK: 'hello.com', LOCATION: 'Dallas, TX', SALARY: '$150,000', TYPE: 'Full-Time' },
                    { TITLE: 'Legal Assistant', POSTED: 'Three Weeks Ago', LINK: 'hey.com', LOCATION: 'Dallas, TX', SALARY: '$90,000', TYPE: 'Full-Time' },
                    { TITLE: 'Paralegal', POSTED: 'Four Weeks Ago', LINK: 'howdy.com', LOCATION: 'Dallas, TX', SALARY: '$120,000', TYPE: 'Full-Time' },
                ],
                REVIEWS: [{
                    NAME: 'Alice Johnson', REVIEW: 'Excellent service and support!',
                    PFP: "https://lh3.googleusercontent.com/a-/ALV-UjUfSRpYaFVPK4EjE-zcezcB-SgVZOGuVbZwO_dUN1ZDrFkg_Tnw=s40-c-rp-mo-br100",
                    RATING: 5, DATE: '10/01/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'Bobby Brown', REVIEW: 'Very professional and helpful!',
                    PFP: "https://www.georgetown.edu/wp-content/uploads/2022/02/Jkramerheadshot-scaled-e1645036825432-1050x1050-c-default.jpg",
                    RATING: 5, DATE: '10/05/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'Charlie Davis', REVIEW: 'Highly recommend their services!',
                    PFP: "https://www.jordanharbinger.com/wp-content/uploads/2018/09/be-the-most-interesting-360x360.jpg",
                    RATING: 5, DATE: '10/10/21', REVIEW_URL: 'https://www.google.com/',
                },
                {
                    NAME: 'David Evans', REVIEW: 'Great team and great results!',
                    PFP: "https://media.licdn.com/dms/image/v2/C5603AQHNO4MdXRNaWw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1516828507141?e=2147483647&v=beta&t=5FnMImfL0l2S785EoDOxB7o-b4vPKDZKU4XqMSxzR3s",
                    RATING: 5, DATE: '10/15/21', REVIEW_URL: 'https://www.google.com/',
                }
            ],
            }]
        };

        const batch = db.batch();

        firmsSnapshot.forEach(doc => {
            const firmRef = doc.ref;
            batch.update(firmRef, { 
                // QUEUE: queueData, 
                COMPETITION: competitionData,
                // STRATEGY: strategyData 
            });
        });

        await batch.commit();
        console.log('ALL fields added to all firm documents');
    } catch (error) {
        console.error('Error updating firms with QUEUE:', error);
    }
};

updateFirmsWithQueue();