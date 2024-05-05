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
const { getDocs } = require("firebase/firestore");
const { updateDoc } = require("firebase/firestore");

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

const newUser = async (docName, firmInfo, keywords, smallBlog, bigBlog, chatInfo, competition) => {
    try {
        const userDocRef = doc(`firms/${docName}`);
        await userDocRef.set({

            FIRM_INFO: firmInfo,
            WEEKLY_KEYWORDS: keywords,

            BLOG_DATA: {
                SMALL_BLOG: smallBlog,
                BIG_BLOG: bigBlog,
            },

            CHAT_INFO: chatInfo,
            SETTINGS: {
                MODEL: 2,
                PLAN: "Trial Plan",
                IMAGES: "All",
            },

            LEADS: [{
                ID: 10000000,
                NAME: "Simon Paschal",
                EMAIL: "johnsample@gmail.com",
                NUMBER: "542-123-4568",
                SUMMARY: "Was in a car accident and needs help.",
                DATE_TIME: "04/04/24 | 12:54 PM",
                CONVERSATION: [
                    {role: 'assistant', content: `Hello, welcome to ${docName}! How can I help you today?`},
                    {role: 'user', content: `Hey! Can you guys help me with EB1 Wait Time Expedition?`},
                ]}, { 
                ID: 10000001,
                NAME: "Sample Sarah",
                EMAIL: "sarahsample@gmail.com",
                NUMBER: "542-123-4567",
                SUMMARY: "Looking for asset protection services.",
                DATE_TIME: "04/06/24 | 7:54 PM",
                CONVERSATION: [
                    {role: 'assistant', content: `Hello, welcome to ${docName}! How can I help you today?`},
                    {role: 'user', content: `Hey! I'm looking for Retail Asset Protection help`},
                ]}
            ],

            WEEKLY_POSTS: {
                LAST_DATE: "3/3/3",
                POSTS: [
                    {platform: "LinkedIn", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "LinkedIn", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "LinkedIn", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},

                    {platform: "Facebook", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "Facebook", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "Facebook", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},

                    {platform: "Instagram", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "Instagram", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
                    {platform: "Instagram", content: "<h1>Example Post</h1>This is what a weekly post idea looks like."},
            ]},

            WEEKLY_BLOGS: {
                LAST_DATE: "3/3/3",
                BLOGS: [
                    {content: "<h1>Example Post</h1> <p> This is what a weekly post idea looks like. </p>"},
                    {content: "<h1>Example Post</h1> <p> This is what a weekly post idea looks like. </p>"},
                    {content: "<h1>Example Post</h1> <p> This is what a weekly post idea looks like. </p>"},
                
            ]},

            COMPETITION: competition,

            REVIEWS: {
                LINKS: {
                1: '',
                2: '',
                3: '',
                4: '',
            },
            SELECTION: 1,
            THRESHOLD: 4,
            NEW_REVIEWS: []
        },

            GEN_POSTS: [],

        }, { merge: true });
        console.log('User document created or updated');
    } catch (err) {
        console.log(err);
    }
};

const updateLeads = async () => {
    const sampleLeads = [{
        ID: 10000000,
        NAME: "Sample John",
        EMAIL: "johnsample@gmail.com",
        NUMBER: "542-123-4568",
        SUMMARY: "Was in a car accident and needs help.",
        DATE_TIME: "04/04/24 | 12:54 PM",
        CONVERSATION: [
            {role: 'assistant', content: `Hey there, thanks for visiting us! How can I help you today?`},
            {role: 'user', content: `Hey! Can you guys help me with EB1 Wait Time Expedition?`},
        ]}, { 
        ID: 10000001,
        NAME: "Sample Sarah",
        EMAIL: "sarahsample@gmail.com",
        NUMBER: "542-123-4567",
        SUMMARY: "Looking for asset protection services.",
        DATE_TIME: "04/06/24 | 7:54 PM",
        CONVERSATION: [
            {role: 'assistant', content: `Hello, thanks for visiting us! How can we help you today?`},
            {role: 'user', content: `Hey! I'm looking for Retail Asset Protection help`},
        ]}
    ];

    const CHAT_PROMPT = `Answer as a customer support rep for the firm.`;
    const CHAT_IMAGE = "https://firebasestorage.googleapis.com/v0/b/pentra-beauty.appspot.com/o/Gemini_Generated_Image_w2bk6ew2bk6ew2bk.jpeg?alt=media&token=555ce545-de49-4e1f-becf-9b985933a117";
    const CHAT_THEME = "#204760";

    try {
        const firmsSnapshot = await getDocs(collection('firms'));
        firmsSnapshot.forEach(async (firmDoc) => {
            const firmRef = doc('firms/' + firmDoc.id);
            await updateDoc(firmRef, {
            LEADS: sampleLeads,
            // CHAT_INFO: {
            //     PROMPT: CHAT_PROMPT,
            //     IMAGE: CHAT_IMAGE,
            //     THEME: CHAT_THEME,
            // }
        //     COMPETITION: {
        //         LAST_DATE: '04/25/24',
        //         COMPETITION: [{
        //         NAME: 'Sample Lawyers',
        //         SITE: 'bergplummer.com',
        //         BLOG_PAGE: 'bergplummer.com/blog',
        //         TRAFFIC: [1200, 1400, 1300, 1500],
        //         RANKING_FOR: ['Dallas asset protection', 'Asset protection firms near me', 'Estate protection attorneys'],
        //         RECENT_BLOGS: [
        //           { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
        //           { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
        //           { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
        //           { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
        //         ],
        //         JOBS: [
        //           { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
        //         ],
        //         ORG: {
        //           LINKEDIN: 'https://www.linkedin.com/',
        //           FACEBOOK: 'N/A',
        //         }
        //       },
        //       {
        //         NAME: 'Sample Lawyers',
        //         SITE: 'injuryattorneyofdallas.com',
        //         BLOG_PAGE: 'injuryattorneyofdallas.com/blog',
        //         TRAFFIC: [2650, 2550, 2700, 2650],
        //         RANKING_FOR: ['Texas rental attorneys', 'Real estate lawyers close by', 'Asset protection attorneys'],
        //         RECENT_BLOGS: [
        //           { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
        //           { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
        //           { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
        //           { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
        //         ],
        //         JOBS: [
        //           { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
        //         ],
        //         ORG: {
        //           LINKEDIN: 'https://www.linkedin.com/',
        //           FACEBOOK: 'N/A',
        //         }
        //       },
        //     ]
        // }
        // WEEKLY_KEYWORDS: {
        //     LAST_DATE: '04/25/24',
        //     KEYWORDS: [
        //         {keyword: "Asset Protection", data: [12100, 12100, 12100, 9900]},
        //         {keyword: "Short-Term Rentals", data: [27100, 74000, 27100, 33100]},
        //         {keyword: "Real Estate Investment", data: [90500, 110000, 110000, 110000]},
        //         {keyword: "Legal Services", data: [18100, 22200, 18100, 33100]},
        //         {keyword: "Financial Planning", data: [27100, 40500, 40500, 33100]},
        //         {keyword: "Tax Services", data: [14800, 49500, 40500, 40500]},
        //         {keyword: "Insurance", data: [550000, 673000, 673000, 673000]},
        //         {keyword: "Retirement Planning", data: [90500, 135000, 165000, 165000]},
        //         {keyword: "Estate Planning", data: [33100, 49500, 49500, 40500]},
        //         {keyword: "Wealth Management", data: [27100, 40500, 40500, 60500]},
        //         {keyword: "Investment Advice", data: [3600, 6600, 8100, 6600]},
        //         {keyword: "Business Consulting", data: [22200, 27100, 27100, 27100]},
        //     ]
        // },
        // SETTINGS: {
        //     MODEL: 2,
        //     PLAN: "Trial Plan",
        //     IMAGES: "All",
        // }
    });
        });
        console.log("All firms have been updated successfully.");
    } catch (error) {
        console.error("Error updating: ", error);
    }
};

// uploadSome();
// updateLeads();

let newUserMoment = true;

if (newUserMoment) {
newUser(docName = 'Haley, Bailey & Jones',

firmInfo = {
    CONTACT_US: "https://hbjlawyers.com/contact-us/",
    NAME: "Haley, Bailey & Jones",
    LOCATION: "Dallas, TX",
    DESCRIPTION: 
    `Haley, Bailey & Jones is a Dallas-based law firm distinguished for its broad legal expertise and dedication to client satisfaction. 
    Specializing primarily in probate law & estate planning, but also servicing family, personal injury, and entertainment law, the firm offers comprehensive legal services tailored to the diverse needs of its clientele.
    With a team of adept attorneys, Haley, Bailey & Jones navigates complex legal matters with precision and empathy, ensuring that clients receive strategic counsel and effective representation across a range of practice areas.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdecentral%20(34).png?alt=media&token=328b30fa-7f7a-4dd9-93d1-c18e0399e17e
    `,
    MODEL: 2,
    PLAN: "Marketing Suite",
},

keywords = {
    KEYWORDS: "Probate Attorneys Texas, Estate Planning Attorney, Will attorney near me, Trust Attorney near me, Texas Executor, Estate Administration, Texas Probate Court, Intestate Succession, Texas Estate Tax, Texas Probate Attorney, Texas Estate Law, Asset Distribution",
    LAST_DATE: "05/3/24",
},

smallBlog = [0, 1, 2],

bigBlog = [
{
    TITLE: "News | Love Is In The Heir Initiative",
    LINK: `https://hbjlawyers.com/news-you-cn-use/`,
    CONTENT: `
    This Black History Month we at Haley, Bailey & Jones are rolling out something very special and impactful for our community. The Love is in the “Heir” initiative. We at HBJ acknowledge that our community has not been equipped with the knowledge nor opportunity to get their estate planning affairs in proper order. So, HBJ has made it its goal to provide the knowledge and subsequently empower our community to take the necessary steps to protect themselves, their heirs/legacy and their assets! We want to do this in a month that recognizes the history of our people and community and prompt our community to reach new heights through estate planning!

    We are enthused about the opportunity to offer the Basic Estate Planning option. This option includes the following services that are valued at $1200 but you only pay $500:
    
    Last Will & Testament
    Statutory Durable Power of Attorney
    Medical Power of Attorney
    You are only required to pay half (50%) of the retainer fee in the amount of $250. The remaining balance of $250.00 must be paid prior to the review and approval of the final documents for execution.
    
    We also have the Advanced Estate Planning option. This option includes the following services that are valued at $3,000.00 but you only pay $1,800.00:
    
    Revocable Living Trust w/ Pour Over Last Will & Testament
    Statutory Durable Power of Attorney
    Medical Power of Attorney
    Please note that the Advanced Estate Planning option price does not include the real property deeds that must be executed to transfer real property into your trust. There will be additional fees for those services.
    
    To learn more about HBJ or the Love is in the “Heir” initiative, please follow us on all of our social media platforms to learn more @ HBJLAWYERS.
    
    This service is for TEXAS RESIDENTS ONLY.
    
    For any questions, please feel free to reach out to us at love@hbjlawyers.com or 1.888.HBJLAW4U. You may also text us at 972.598.0212.
    
     
    
    https://www.eventbrite.com/e/love-is-in-the-heir-black-history-month-initiative-tickets-798060750187?aff=oddtdtcreator
    `,
},
{
    TITLE: "HBJ Services | Probate And Estate Planning",
    LINK: `https://hbjlawyers.com/probate-and-estate-planning/`,
    CONTENT: `
    Probate And Estate Planning
Probate ​
Navigating the probate process can be daunting, but with HBJ by your side, you can have confidence in a smooth and efficient resolution. We provide strategic counsel to streamline proceedings and minimize potential challenges. HBJ handles non-contested and contested probate matters including: (the items below should have check marks).
Application to Probate Last Will & Testament and for Issuance of Letters Testamentary
Application to Probate Last Will & Testament as a Muniment of Title
Application for Determination of Heirship without Administration
Application for Determination of Heirship with Court-Created Independent Administration
Small Estate Affidavits
Last Will & Testament Contests
Trust Administration
Estate Planning
From basic wills to intricate trust structures, our services cover a broad spectrum of estate planning needs. We guide you through the entire process, addressing your concerns and ensuring that your wishes are clearly and legally documented. We recognize that estate planning is a deeply personal and often emotional journey. That's why we take the time to understand your unique goals, family dynamics, and concerns. Our client-centric approach ensures that the solutions we develop align with your values and aspirations.
Trusts
Last Will & Testaments
Durable Statutory and Medical Power of Attorney
Directive to Physicians
Transfer on Death Deeds
Lady Bird Deeds
    `
},

{
    TITLE: "HBJ Services | Personal Injury Law",
    LINK: "https://www.taxpayerdeceptionact.com/news?id=12d81640-4aa7-49be-ad87-2fe316a4b03b",

    CONTENT: `
    Personal Injury
    At HBJ we understand the physical, emotional, and financial toll that accidents and injuries can have on individuals and their families. With a commitment to justice and a track record of successful outcomes, we are here to advocate for you during your time of need. We have successfully navigated a wide range of personal injury claims, from motor vehicle accidents to slip and falls. If you or a loved one has suffered an injury due to someone else's negligence, it's crucial to have a dedicated advocate on your side.
    Motor Vehicle Accidents: Whether you've been involved in a car, truck, motorcycle, or pedestrian accident, we have the expertise to handle your case.
    Slip and Fall Injuries: Property owners have a responsibility to maintain safe premises. If you've been injured due to negligence, we are here to hold them accountable.
    Wrongful Death: At HBJ we understand that losing a loved one is an unimaginable tragedy. When that loss is due to someone else's negligence or misconduct, the pain is compounded. Our dedicated team is here to provide compassionate and skilled legal representation for families seeking justice in wrongful death cases across Texas.
    `,
},

// {
//     TITLE: "Coalition Vows to Protect Voters & Vital Local Services from Deceptive Corporate Ballot Measure",
//     LINK: "https://www.taxpayerdeceptionact.com/news?id=28294790-a540-416f-8e44-98327788586d",

//     CONTENT: `
//     FEB
//     1
//     2023
//     PRESS RELEASE
//     Coalition Vows to Protect Voters & Vital Local Services from Deceptive Corporate Ballot Measure
    
//     Put your press release text hCalifornia Business Roundtable initiative steals voters’ power to determine local priorities, lets corporations evade accountability
    
//     Latest poll showed overwhelming opposition from voters
    
//     Sacramento, CA – Today the Alliance for a Better California, League of California Cities, California State Association of Counties, California Special Districts Association, California Alliance for Jobs and the Contract Cities Association joined together to announce strong opposition to the deceptive ballot measure sponsored by the California Business Roundtable (CBRT), the lobbying arm of the largest and wealthiest corporations in California. 
    
//     The coalition of public safety, education, labor, local government and infrastructure groups are vocalizing their opposition as the California Secretary of State’s office announced that the initiative has qualified for the November 2024 ballot. 
    
//     “Educators, nurses and firefighters won’t allow extreme, irresponsible corporations to threaten our democracy - there’s just too much at stake, from the quality of our children’s education to the air they breathe,” said the Alliance for a Better California, an organization that includes SEIU California, the California Teachers’ Association, California Professional Firefighters, California Federation of Teachers, California School Employees Association, California Faculty Association, California Labor Federation and the American Federation of State County and Municipal Employees. 
    
//     “This deceptive initiative eliminates corporate accountability for the damage they do to our environment, strips voters of the power to set funding priorities for our communities, and drains billions in funding from our schools, public safety, and homelessness response to name just a few. We are going to fight with everything we’ve got to protect our democracy and our children’s future,” the Alliance continued.
    
//     “This is the third attempt by deep-pocketed special interest groups to advance an initiative that undermines the rights of local voters to decide what their communities need and jeopardizes the ability of local governments to deliver essential services,” said League of California Cities Executive Director and CEO Carolyn Coleman. “It was a bad idea in 2018, it was a bad idea again in 2022. And it will still be a bad idea in 2024.”
    
//     “Counties continue to oppose this deceptive initiative because it undermines the abilities of voters and locally elected officials to provide critical services. This measure obliterates the constitutional authority of locally elected local governments to determine the right balance between revenue and the degree of local services needed by their communities,” said Graham Knaus, CEO, California State Association of Counties.
    
//     “At this critical time in California’s history, our communities cannot afford to do even less than the status quo. Sadly, this initiative would lock us into a race-to-the-bottom. Overcoming challenges like drought, flooding, and wildfire will require all of us to work together and consider the real costs of undermining our future. When we think of the kind of communities we want to leave our children and grandchildren, we are not content to settle for the ‘minimum amount necessary’ and we are not willing to limit their voice at the ballot box,” said Neil McCormick, Chief Executive Officer, California Special Districts Association.
    
//     "The so-called Taxpayer Protection Act will damage our ability to fund and construct the infrastructure projects that support California's economy. Passage of this measure will mean less safe roads, more congestion and fewer family supporting jobs across the state,” said Michael Quigley, Executive Director, California Alliance for Jobs.
    
//     “If passed, this measure could cause irreparable harm to a city’s ability to provide essential services to its residents. This measure is a wolf in sheep’s clothing,” said Marcel Rodarte, Executive Director, California Contract Cities Association.
    
//     The CBRT measure would create major new loopholes that allow wealthy corporations to avoid paying their fair share for the impacts they have on our communities, while allowing corporations to evade enforcement when they violate environmental, health, safety, and other state and local laws. It would also significantly restrict the ability of local voters, local governments, and state elected officials to fund critical services like public schools, fire and emergency response, public health, parks, libraries, affordable housing, homeless and mental health services, and public infrastructure. Some of the state’s biggest corporations, developers, mega-landlords, and their political committees spent millions of dollars to put the deceptive and self-interested measure before voters.
    
//     Steals power from voters 
//     The initiative would steal power away from voters, prohibiting local advisory measures where voters provide direction to politicians on how they want their local tax dollars spent. The measure would make it harder for voters to pass measures needed to fund local services and local infrastructure. It would also retroactively cancel measures already passed by voters, stripping voters of a say in local decisions. 
    
//     As Los Angeles Times columnist Michael Hiltzik explained, “The so-called Taxpayer Protection and Government Accountability Act is just one more example of how special interests love to claim that they’re getting government off the backs of the people, when their real goal is to saddle up themselves.”
    
//     Eliminates corporate accountability
//     The initiative claims to be about accountability while actually eliminating corporations’ accountability for impacts they have on local infrastructure or damage they do to our air, water, or environment. 
    
//     Threatens schools, vital services and disaster response
//     The initiative would force cuts to public schools, fire and emergency response, law enforcement, public health, parks, libraries, affordable housing, services to support homeless residents, mental health services, and more. It would also reduce funding for critical infrastructure like streets and roads, public transportation, drinking water, new schools, sanitation, and utilities. During a time when our children are still recovering from the impacts of the pandemic, our state is experiencing a deluge of extreme weather disasters, and homeless residents are perishing on our streets, our communities cannot afford for these vital services to be eliminated.
    
//     Strong Voter Opposition
//     A statewide poll conducted last February found voters resoundingly rejected the measure, with 54% of voters opposed and only 25% in support. The remaining 21% were undecided.    
//         `
// },

],

chatInfo = {
    PROMPT: `
    4. Make sure to always follow this conversation flow:
    - First, greet user and ask them if they're an existing client.
      IF (EXISTING_CLIENT) THEN { - Then ask them for their full name and situation. }
      IF (NOT_EXISTING_CLIENT) THEN {
    - First ask them for their full name incase you get disconnected.
    - Then say last thing & ask them for phone number similarly.
    - Then ask about the person's situation.
    - Follow this up with short, relevant probing questions, etc. 
    - When you're sure the main conversation is over, ask for location and email.
      }
    </instruction>

    `,
    IMAGE: "https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-04-06_013307713.png?alt=media&token=bd6e6f2a-15d3-427f-bf4e-3506005391f8",
    THEME: "#a34040",
    IS_CHAT_ON: false,
},

competition = {
    LAST_DATE: "03/31/24",
    COMPETITION: [{
        NAME: 'Sample Lawyers',
        SITE: 'bergplummer.com',
        BLOG_PAGE: 'bergplummer.com/blog',
        TRAFFIC: [1200, 1400, 1300, 1500],
        RANKING_FOR: ['Dallas asset protection', 'Asset protection firms near me', 'Estate protection attorneys'],
        RECENT_BLOGS: [
          { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
          { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
          { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
          { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
        ],
        JOBS: [
          { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
        ],
        ORG: {
          LINKEDIN: 'https://www.linkedin.com/',
          FACEBOOK: 'N/A',
        }
      },
      {
        NAME: 'Sample Lawyers 2',
        SITE: 'injuryattorneyofdallas.com',
        BLOG_PAGE: 'injuryattorneyofdallas.com/blog',
        TRAFFIC: [2650, 2550, 2700, 2650],
        RANKING_FOR: ['Texas rental attorneys', 'Real estate lawyers close by', 'Asset protection attorneys'],
        RECENT_BLOGS: [
          { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
          { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
          { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
          { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
        ],
        JOBS: [
          { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
        ],
        ORG: {
          LINKEDIN: 'https://www.linkedin.com/',
          FACEBOOK: 'N/A',
        }
      }]
},
); } else {console.log('skipped new user')};

//  4. Make sure to always follow this conversation flow:
//    - First, greet user and ask them if they're an existing client.
//      IF (EXISTING_CLIENT) THEN { - Then ask them for their full name and situation. }
//      IF (NOT_EXISTING_CLIENT) THEN {
//    - First ask them for their full name incase you get disconnected.
//    - Then say last thing & ask them for phone number similarly.
//    - Then ask about the person's situation.
//    - Follow this up with short, relevant probing questions like "How have your injuries affected your ability to work?", "Have you visited your doctor in the last 12 months?", "Would you mind elaborating?", etc.
//    - When you're sure the main conversation is over, ask for location and email.
//      }
//    </instruction>
//   <blog-content></blog-content>
