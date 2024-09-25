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
newUser(docName = 'Morvay Consulting',

firmInfo = {
    CONTACT_US: "https://www.morvayconsulting.com/contact",
    NAME: "Morvay Consulting",
    LOCATION: "New York, NY",
    DESCRIPTION: 
    `Morvay Consulting Group specializes in providing Executive Sponsorship services to law firms, accounting firms, and other professional services firms.
     They focus on helping clients maximize their project return on investment (ROI) through dedicated consulting support. The firm emphasizes investing in people, encouraging employees, and creating an environment that allows for learning from failures to build cohesive and trusting teams. 
     Morvay Consulting Group offers strategic guidance and support to help professional services firms improve their operations and achieve measurable results. 
    `,  
    IMAGE: `
https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/user_imgs%2Fdecentral%20(43).png?alt=media&token=d2484ce1-ac1d-4b15-9b94-8067f16652d1
`,
    MODEL: 2,
    PLAN: "Full Suite Plan",
},

keywords = {
    KEYWORDS: "Executive Sponsorship, Consulting Services, Professional Services Consulting, Law Firm Consulting, Accounting Firm Consulting, Project ROI, Consulting Support, Strategic Guidance, Operations Improvement, Measurable Results, Team Building, Employee Encouragement, Learning from Failures, Consulting Group, New York Consulting, Consulting Firm NY, Consulting Services NY, Professional Services Firm Consulting, Consulting for Law Firms, Consulting for Accounting Firms",
    LAST_DATE: "25/09/24",
},

smallBlog = [0],

bigBlog = [
{
    TITLE: "Executive Sponsorship: A Case Study",
    LINK: `https://ridleylawoffices.com/why-is-a-living-trust-important/`,
    CONTENT: `
Executive Sponsorship
Transforming a Stalled ERP Implementation into a Resounding Success  
In the rapidly evolving landscape of law and accounting firms, effective project management and streamlined operations are paramount. Morvay Consulting Group, led by Jacob Morvay, specializes in rescuing and revitalizing complex projects that have gone off track using the Executive Sponsorship model of project management. This case study showcases the successful turnaround of a stalled ERP implementation utilizing the Executive Sponsorship method.

Background
The firm had embarked on an ambitious project to upgrade its ERP system from a legacy platform in place for over 10 years to a new platform, while also implementing a new paperless billing solution. However, midway through, the project had come to a complete halt, with work paused indefinitely. The situation was dire, with multiple challenges threatening the project's success.

Challenges
Despite having strong support from firm leadership, the project had stalled. The first step was to determine why.

Team Dynamics
The project team was understaffed, and existing team members were not collaborating effectively. People were worried about individual consequences for bad decisions versus overall project success.

Vendor Relationships
The project relied heavily on third party vendor support to implement the solution. The vendor relationships had deteriorated due to changing timelines and targets. The vendors did not trust the team, and the team did not trust the vendors.

Written Plan and Goals
There was no formal project plan specifying key deadlines, deliverables, and goals. Individual teams were working on different parts of the project without a view to the overall goals, because they were not clearly established.

Approach
By focusing on bringing people together to work towards a common goal, while ensuring they had the resources to be successful, the project began to turn around.

Listening and Understanding
The first step was to ask open questions and listen to the concerns of different groups within the firm. The approach for the internal finance team was a focus on team building, encouraging mutual support and collaboration. For the HR and IT teams, the start was to assess their level of  integration with the project and quickly establish strong working relationships with the other teams, fostering a collaborative environment.

By pausing the project to reassess the situation, engaging with all vendors to understand their perspectives, and adjusting vendor relationships as needed, the firm developed a comprehensive project plan with stakeholder buy-in.

Engaging Leadership
The team worked closely with the firm’s attorney leadership to define what success would look like and helped them understand the additional financial investments needed. By collaborating with them to develop a clear communication strategy, the firm ensured all stakeholders were informed and aligned.

Leadership moved to a role of supporting the project as cheerleaders and enforcers, rather than getting involved in daily decisions. It was impressed upon leadership the importance of using the solutions themselves to set an example.

Building Culture and Collaboration
Team members were identified into three groups: proactive supporters of the project, persuadable adversaries, and active resistors. Clear expectations were set for all groups, and the project teams were balanced to include both supporters and persuadable adversaries. Resistors were coached  to adopt the necessary changes. 

The firm created clear roles and responsibilities within the team, with a robust structure to raise concerns and objections. This allowed team members to feel heard and valued. The firm assigned specific team members to particular parts of the project, significantly increasing their independent decision-making authority. They empowered those closest to the functions to lead decision-making, ensuring the best outcomes for the project.

Defining Success
The firm set clear and measurable goals for the team as a whole, and for individual contributors. This helped team members understand their role within the project while also focusing on the larger institutional goals. Having defined goals allows team members to self-assess, increasing confidence.

Building Trust and Engagement
The firm instituted regular meetings for managers and their teams, provided opportunities for junior members to take on bigger roles, and ensured continuous feedback. They  organized social activities to foster personal connections among team members, and encouraged open communication, promoting a culture of experimentation and support.

To trust in others, you must first trust yourself. It was essential to conduct an honest assessments of team members' skills relative to their roles and brought in third-party help to supplement and support areas where internal capabilities were lacking.

Technology and Vendor Adjustments
The firm replaced the outdated paperless billing solution with a new vendor offering a proactive partnership and a superior product. They used the feedback from project vendors to change the approach and better utilize their skills,  which was one of the major contributors to finishing the project under budget.

Results
The ERP implementation and the firm-wide launch of paperless billing were completed 9 months ahead of the original schedule. The new paperless billing solution improved the efficiency and speed of client billing, leading to a record high billing and collection year for the firm.

Measuring Success
There are many ways to measure success; meeting your project goals is just one of them. In addition to going live ahead of schedule and under budget, the firm recognized longer-term cultural change that ensured strong overall adoption.

Stakeholder Advocacy
Many skeptical partners became advocates through understanding their concerns and addressing them effectively. As a result, they became advocates of the new system. Strong senior leadership from the firm’s attorney leaders was integral to the partner adoption.

Team Culture Transformation
The team developed a strong sense of ownership, knowing that their collaborative efforts were crucial to the project’s success. There was a noticeable improvement in interpersonal relationships and enhanced collaboration, both within the finance function and across the firm, which continued after the project ended.

Conclusion
The firm had embarked on an ambitious project to upgrade its ERP system from a legacy platform in place for over 10 years to a new platform, while also implementing a new paperless billing solution. However, midway through, the project had come to a complete halt, with work paused indefinitely. The situation was dire, with multiple challenges threatening the project's success.

Want to Learn More? Contact us.

Name
(required)
First Name
Last Name
Email
(required)
Message
Send


    `,
},
// {
//     TITLE: "What Are The Costs Associated With Probate In California?",
//     LINK: `https://ridleylawoffices.com/what-are-the-costs-associated-with-probate-in-california/`,
//     CONTENT: `
//     What Are The Costs Associated With Probate In California?
//     Sep 24, 2024
//     Hi, I’m Eric Ridley, an estate planning lawyer based in California. Today, let’s unravel the often complex and misunderstood topic of probate costs in California. Understanding these costs is crucial for anyone involved in estate planning or handling an estate after a loved one’s passing. So, let’s dive in and make sense of it together.

//     Probate Court Fees
//     Probate in California begins with court fees, which are like the entry ticket to the probate process. These fees are set by the state and vary depending on the estate’s value. For instance, for an estate valued at $150,000, the court fee might be a few hundred dollars. As the estate value increases, so do these fees, reaching into the thousands for larger estates. These fees are unavoidable and are the first step in the probate journey.

//     Understanding the Costs for Attorney Fees
//     Attorney fees in probate can be significant but are essential for facing the process. In California, attorney fees for probate are determined by a statutory formula. They’re calculated as a percentage of the estate’s total value. For example, an estate worth $200,000 might incur attorney fees of around $7,000. These fees pay for the legal guidance and professional needed to ensure the estate is managed and distributed correctly.

//     Compensating for Time and Effort of Executor Fees
//     The executor of an estate, who is responsible for managing and finalizing the deceased’s affairs, is also entitled to compensation. This compensation is typically a percentage of the estate’s value, similar to attorney fees. For an estate valued at $300,000, the executor’s fee might be about $9,000. This fee compensates the executor for their time, effort, and the responsibilities they undertake in administering the estate.

//     A Lesser-Known Expense 
//     In some cases, executors may be required to post a bond before they can administer the estate. This bond acts as insurance to protect the beneficiaries against possible mismanagement of the estate. The cost of the bond varies based on the estate’s size and the specifics of the case.

//     Appraisal and Business Valuation Fees 
//     Estates often contain various assets, from real estate to business interests, all of which need to be appraised. Appraisal fees are paid to professionals who determine the value of these assets. Similarly, if the estate includes business interests, business valuation professionals are hired, and their fees also add to the probate costs.

//     Costs for Managing and Selling Real Estate 
//     If the estate includes real estate that needs to be managed or sold, there are additional costs involved. These can consist of expenses for maintaining the property, real estate agent commissions, and any costs related to selling the property, like repairs or staging.

//     Accounting Fees and Tax Preparation
//     Managing an estate’s financial affairs often requires professional accounting services. Accountants may be needed to prepare final tax returns for the deceased and the estate. These services come with fees, which are deducted from the estate’s assets.

//     Miscellaneous Probate Costs 
//     There are also miscellaneous costs to consider, like court filing fees for various documents, costs for certified copies of court documents, and postage and mailing expenses. While individually small, these costs can add up.

//     Avoiding or Minimizing Probate Costs through Estate Planning 
//     Many of these probate costs can be reduced or even eliminated with proper estate planning. Tools like living trusts, joint ownership, and proper beneficiary designations on retirement accounts and life insurance policies can help bypass the probate process. It’s worth exploring these options to preserve more of your estate for your beneficiaries.

//     The Role of an Estate Planning Attorney 
//     As an estate planning attorney, my role is to guide you through these complexities. I can help you understand the potential costs of probate for your estate and work with you to develop strategies to minimize these costs. Effective estate planning can save your beneficiaries time, money, and stress.

//     The probate process in California can be daunting, especially considering the various costs involved. However, with the right guidance and planning, you can make informed decisions to protect your estate’s value and ensure your wishes are honored. If you’d like to learn more or need assistance with estate planning, I’m here to help. Contact me at (805) 244-5291 or visit our website for a free initial strategy session. Together, we can create a plan that suits your family’s needs and brings you peace of mind.

//     Posted in Probate
//     `
// },

// {
//     TITLE: "I’m Not Rich. Do I Need an Estate Plan?",
//     LINK: "https://ridleylawoffices.com/im-not-rich-do-i-need-estate-plan/",
//     CONTENT: `
//  One of the most common myths about estate planning I hear over and over again is, “I don’t have any money. Why would I need an estate plan?”

// It is easy to understand why someone might think this – after all, estate planning is for rich people, right?

// This is a dangerous myth!
// In fact, it is often people with minimal assets who need estate planning the most. Confused?

// Let me give you an example:

// Nathan had $10,000 in his checking account. He didn’t have an estate plan because, until recently, he thought estate planning was only for people who were rich.

// One day he was injured at work. He became incapacitated, and was no longer able to manage his finances on his own. He needed to access the money in his checking account to pay for the medical bills.

// Nathan’s adult daughter tried to access the account, but the bank told him she didn’t have legal authority to access it. By the way, if Nathan had been married and his wife’s name wasn’t on the account, the Bank would have told his wife the same thing.

// Nathan’s daughter did finally get access to the account, but only after going through an extremely difficult and costly court process called “probate.” Nathan’s daughter had to get court permission before she could act on her father’s behalf. That took a lot of time and ate up much of the $10,000.

// Billionaires like Elon Musk and Warren Buffett would be just fine if this happened to them.

// Nathan, however, had to pay for filing fees and attorney fees and his daughter was really worried throughout the entire process.

// Incredible as it sounds, it was exponentially more important for Nathan to have an estate plan in this case than it is for someone like Elon Musk.

// This is a heartbreaking example of how quickly things can get messy without basic planning in place – and how the importance of estate planning has little to do with how much money you have.

// If you are interested in learning how estate planning can save your family time, money, and heartache, start by scheduling your free planning session with me online here or by calling me at (805) 244-5291.

// We will cover the biggest fears when it comes to estate planning, how to protect your family and your assets, how to get started, how much it will cost, and much more.

// I know this is a lot to take in! Feel free to hit reply with any questions at all. Eric Ridley Attorney at Law Law Office of Eric ridleyeric@ridleylawoffices.com(805) 244-5291www.ridleylawoffices.com

// This is a scary scenario that can be easily avoided. The first step is to learn more by calling me right now. I will guide you as to the path, for you to make the best decisions for your family.
//     `,
// },

// {
//     TITLE: "Can Insurance Companies Deny Cancer Treatment?",
//     LINK: "https://ravaltriallaw.com/deny-cancer-treatment/",

//     CONTENT: `
//     The answer to the question of “Can insurance companies deny cancer treatment?” is often different from the answer to the question of “Do insurance companies deny cancer treatment?”

//     Although federal law often prohibits insurance companies from denying certain vital cancer treatments, patients are often forced to fight for coverage. In some cases, patients may even end up paying for the necessary treatment out of their own pockets because they cannot afford to lose time waiting to receive an insurer’s authorization before beginning treatment. Some patients may be forced to take legal action against their insurance company to get the vital coverage they need. One of the most common reasons why cancer patients must fight insurance companies is that they have been denied coverage for proton beam therapy treatment.
    
//     Federal Law Places Requirements on Health Insurance Companies
//     The Affordable Care Act made numerous changes in the law that governs how and when insurance companies must cover illnesses like cancer. Health insurance providers are no longer able to deny coverage on account of pre-existing conditions, nor can they impose yearly or lifetime caps on the amount of coverage that they provide. Insurance plans must cover essential health benefits that include cancer treatments.
    
//     In practice, insurance companies push the limits as far as they can to save themselves money. It is, unfortunately, all too common for patients to either have to fight to get the coverage they need or have it denied altogether.
    
//     Health Insurance Companies Have Often Flouted the Law
//     A relatively recent survey by the Texas Medical Association revealed that roughly one in every four people have had coverage for treatment prescribed by their doctor denied by an insurance company, notwithstanding the requirements of the Affordable Care Act. This includes people who have critically needed life-saving cancer treatment. Some patients’ conditions grew worse after having been denied the treatment or taking the time to fight the denial of coverage.
    
//     Insurance companies give many reasons for their denial of coverage of certain medical treatments to save themselves money at the expense of cancer patients, including:
    
//     The cancer treatment is medically unnecessary
//     The treatment is experimental in nature
//     The specific provider of the treatment is out of the insurer’s network
//     To insurance companies, it does not matter that a doctor has recommended a treatment or that it may save the patient’s life. All that matters is that a cancer treatment may be expensive and will hurt the insurance company’s bottom line. Patients are already facing a tough battle in their fight against cancer. Unfortunately, they may also be forced to fight another battle: getting their insurance company to authorize payment for the treatment of that cancer.
    
//     Cancer treatments such as proton beam therapy are prescribed out of medical necessity. Presumably, they would meet the requirements for coverage under the Affordable Care Act. In a dispute with your insurer, the burden of proof may shift to you to prove that proton beam therapy is both a recognized treatment and medically necessary. Even if you can prove both with ease, you can still expect a fight on your hands.
    
//     You Can Contest the Insurance Company’s Denial of Your Cancer Treatment
//     Under the law, you have a right to challenge the denial of cancer treatments. Unfortunately, the appeals process takes time, and time may not be on your side when you are undergoing treatment for cancer. Nonetheless, you owe it to yourself and your family to fight as hard as you can for all the necessary and required treatments. Before filing your appeal, you should closely review the exact language of your health insurance policy because recent changes to federal law allow for policies that are less comprehensive in nature. In addition, you can and should consult an insurance coverage lawyer during the administrative appeals process.
    
//     Before you appeal your insurer’s decision to deny your cancer treatment, you should take several steps that can increase your chances of success, including:
//     Gathering documentation that conclusively shows that the treatment is medically necessary
//     Compiling additional medical records that detail your medical history and the prior course(s) of your treatment(s)
//     Contacting your medical providers to help obtain supportive evidence of medical necessity
//     Consulting with an insurance lawyer who can advise you on the appeals process
//     Insurance companies are required to offer an internal appeals process wherein you can contest the denial of benefits. However, without legal representation, the internal appeals process can become  a rubber stamp of the initial decision that was made. Insurance companies rarely take an objective look at their own decisions, even though there may be legal consequences for decisions that violate the law.
    
//     You Can Take Your Case to Court if Necessary
//     There is an additional external check on the conduct of insurance companies. You can always take your insurance company to court and file a lawsuit to compel it to cover your cancer treatment. In the meantime, you would need to retain legal counsel and go through the entire court process and win your case. A court would provide an objective review of whether your cancer treatment would be required under federal law.
    
//     In addition, state law also serves as a constraint on an insurance company’s behavior. If the insurance company has unreasonably denied your coverage, it could be subject to a bad faith lawsuit. Further, if there are many people who have had the same treatment denied, a class action lawsuit against the insurance company may even be possible. For example, Aetna recently settled a class action lawsuit alleging that it wrongfully denied cancer treatments. A class of 142 patients who were wrongfully denied proton beam therapy treatments received a total of $3.4 million.
    
//     In another case, a judge lambasted United Healthcare for its “immoral and barbaric” conduct in denying coverage for proton beam therapy treatment. The judge, who was himself a cancer survivor, stated that “it is undisputed among legitimate medical experts that proton radiation therapy is not experimental and causes much less collateral damage than traditional radiation.”
    
//     You can and should fight back when your insurance company has wrongfully denied your cancer treatment. Not only can you legally force it to cover your treatment, but you may win additional damages in court. Also, fighting back could lead to negative news headlines for insurance companies and cause them public relations and reputational nightmares. An experienced insurance claims denial attorney knows how to leverage the court of public opinion to help support your legal battle against your health insurance company.
//     `
// },

// {
//     TITLE: "Why Government Plans Are Exempt From ERISA",
//     LINK: "https://ravaltriallaw.com/why-government-plans-are-exempt-from-erisa/",

//     CONTENT: `
//     If you have been denied benefits provided through an employer-sponsored plan, your claim will generally fall under the Employee Retirement Income Security Act (ERISA). ERISA is a federal law that governs most employee benefit plans. While ERISA was originally enacted to safeguard employees’ retirement and pension benefits, its reach and scope has been expanded over the years.

// But not all employee benefit plans fall under ERISA. When Congress crafted ERISA, it wanted to reduce abuses in the system for private employee pensions. However, it decided that state and local governments should be free to decide the best way to protect their employees. This became an established part of the law. Under ERISA, a government plan means any plan “established or maintained” by the federal government, a state government or political subdivision, or by any agency or instrumentality of any of the foregoing. 29 U.S.C. §1002(32). Courts have defined “established” to include plans created under a collective bargaining agreement between a government unit and a union.

// This means that employees who fall under the government plan exemption are not subject to ERISA. There are many reasons why it is beneficial to get out from ERISA’s reach. Like other states, Texas has laws governing life, accidental death, disability, and health insurance that are more fair to insurance claimants and allow them to sue an insurance company for breach of contract, insurance bad faith, and punitive damages. Emotional distress damages and other damages caused by insurance company’s bad faith may be recoverable under Texas law but are not recoverable in ERISA cases.

// Determining whether a matter is governed by ERISA can be a complex process, but this is one factor to keep in mind when a plan may be established or maintained by the government. If you have been denied ERISA benefits, a Houston ERISA attorney at Berg Plummer Johnson & Raval, LLP can help you file a case and recover the compensation you deserve. For more information on filing an ERISA claim, call our firm today at (713) 526-0200 or contact us online to schedule a consultation. Our lawyers offer unique, cost-effective fee arrangements and will fight for your rights throughout the entire duration of your case.
//     `
// },

// {
//     TITLE: "The Mental Health Parity Act Explained And Why It Matters",
//     LINK: "https://ravaltriallaw.com/why-government-plans-are-exempt-from-erisa/",

//     CONTENT: `
//     Mental illness affects a significant number of Americans, and many of them are not able to get the treatment they need. Even when health plans cover mental health benefits, they can be harder to access and less comprehensive than other types of health benefits.

//     The Mental Health Parity Act (MHPA) of 1996 was the original legislative attempt to force providers of group health insurance for employees to furnish the same levels of coverage for mental health benefits as were provided for medical / surgical (M/S) benefits.
    
//     Prior to the enactment of the MHPA, health benefit providers had been slow to recognize that mental health disorders were as important in terms of needing effective treatment as physical health conditions. Federal legislation over the years has expanded the scope of the MHPA to press health benefit providers to make mental health treatment as accessible as other health benefits.
    
//     Though improvements in access to mental health treatment are being made, parity with access to M/S benefits has not been achieved, and legislative efforts to enforce compliance by health benefit plan providers continue.
    
//     Mental Illness and Substance Use in America
//     According to the Substance Abuse and Mental Health Services Administration (SAMHSA) annual survey on mental illness and substance use levels, one in four adults – over 83 million Americans – had a mental illness. More than 12 million adults had serious thoughts of suicide, and 1.7 million attempted to take their lives.
    
//     Over 46 million people ages 12 and above met the criteria for having a substance use disorder, with 30 million people classified as having an alcohol use disorder and 24 million people classified as having a drug use disorder. The highest incidence of substance use disorder was among young adults ages 18 to 25.
    
//     The Mental Health Parity and Addiction Equity Act (MHPAEA)
//     The MHPAEA (Parity Law) was passed in 2008 and added addiction diseases to the mental health parity requirement. The Parity Law requires group health coverage providers to make financial requirements and treatment limitations no more restrictive for mental health or substance use disorders (MH / SUD) than for other medical and surgical benefits.
    
//     The Affordable Care Act (ACA)
//     Effective in 2014, the ACA expanded the reach of mental health and substance use disorder parity to small group and individual health plan providers and made MH / SUD coverage mandatory as an essential health benefit under the affected plans.

//     Latest Developments in Mental Health Parity Law
//     Recognizing how much work still remains to achieve mental health parity, the Department of Labor, along with HHS and the Treasury Department, have proposed a rule designed to make parity a reality for more people seeking MH / SUD services.
    
//     The proposed rule would require group health plan providers to present actual data showing how a person’s access to treatment is affected by the limitations placed on benefits. Attention will focus on how provider networks are constructed and whether they promote access to benefits.
    
//     The rule would also change how NQTL criteria are analyzed for purposes of compliance and set forth required content elements for analysis.
    
//     Parity in Texas
//     Under the Texas Administrative Code, a health benefit plan that provides both M / S and MH / SUD benefits must comply with the following regarding lifetime aggregate or annual dollar limit restrictions:
    
//     If there are no limits or limits on less than one-third of the medical/surgical benefits, there can be no limits on MH / SUD benefits.
//     If there are limits on at least two-thirds of M / S benefits, they must be applied in a way that does not distinguish mental health / substance use disorders, or there must not be a more restrictive limit on MH / SUD benefits.
//     Non-quantitative treatment limitations imposed on MH / SUD benefits must be similar to and applied no more stringently than NQTL applied to M / S benefits.
    
//     What You Can Do if a Parity Violation is Suspected with Regard to MH / SUD Benefits
//     Under current federal and state laws, many but not all health benefit plans are required to provide MH / SUD benefits. If your health plan has benefits for MH / SUD, they must be as easy to access as your other medical benefits. Any limitations on mental health benefits can be no more restrictive than the limitations on M / S benefits.
    
//     If you’ve had an insurance claim for mental health or substance use treatment denied and you believe the treatment limitations violate parity requirements, Berg Plummer Johnson & Raval, LLP may be able to help you get compensation. Our Texas health insurance lawyers have decades of experience helping clients obtain the benefits they are entitled to. In Houston, contact Berg Plummer Johnson & Raval, LLP to discuss your health benefit plan and how to get your claim covered.
//     `
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
    THEME: "#B35261",
    IS_CHAT_ON: false,
},

competition = {
    LAST_DATE: "03/31/24",
    COMPETITION: [{
        NAME: 'Sample Lawyers',
        SITE: 'bergplummer.com',
        COMP_SITE: 'bergplummer.com/blog',
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
        COMP_SITE: 'injuryattorneyofdallas.com/blog',
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
