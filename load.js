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
newUser(docName = 'Burn Law',

firmInfo = {
    CONTACT_US: "https://edwardharringtonheyburn.com",
    NAME: "Burn Law",
    LOCATION: "Philadelphia, PA",
    DESCRIPTION: 
    `Heyburn Law is a legal firm that specializes in various areas of law, including commercial litigation and personal injury.
The firm is known for its commitment to providing personalized legal services tailored to the needs of its clients. With a team of experienced attorneys, Heyburn Law focuses on achieving favorable outcomes through strategic legal representation.
Their reputation is built on a foundation of integrity, professionalism, and a client-centered approach.
    `,  
    IMAGE: `
https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdecentral%20(45).png?alt=media&token=c4fea7ed-fcfd-4621-a516-6d3c842afad0
`,
    MODEL: 2,
    PLAN: "Full Suite Plan",
},

keywords = {
    KEYWORDS: "Commercial Litigation, Personal Injury, Legal Services, Experienced Attorneys, Strategic Legal Representation, Client-Centered Approach, Integrity, Professionalism, Philadelphia Law Firm, Heyburn Law, Personalized Legal Services, Favorable Outcomes, Legal Expertise, Commitment to Clients, Legal Firm Reputation",
    LAST_DATE: "15/10/24",
},

smallBlog = [0, 1],

bigBlog = [
{
    TITLE: "Michigan Supreme Court Decision: Daher v. Prime Healthcare Services-Garden City, LLC – A Comparison with New Jersey Law on Wrongful Death",
    LINK: `https://edwardharringtonheyburn-com-859775.hostingersite.com/michigan-supreme-court-decision-daher-v-prime-healthcare-services-garden-city-llc-a-comparison-with-new-jersey-law-on-wrongful-death/`,
    CONTENT: `
Introduction

In the landmark case of Daher v. Prime Healthcare Services-Garden City, LLC, the Michigan Supreme Court addressed the scope of recoverable damages under the state’s wrongful death act (WDA), specifically whether damages for lost future earnings are permissible. This case highlights critical differences between Michigan’s wrongful death laws and those in New Jersey, offering a comprehensive understanding of how wrongful death claims are treated in these two jurisdictions.

Case Background

Nawal Daher and Mohamad Jomaa, as co-personal representatives of their son Jawad Jumaa’s estate, filed a lawsuit against Prime Healthcare Services-Garden City, LLC, and the attending physicians for negligence and medical malpractice. Thirteen-year-old Jawad was misdiagnosed with torticollis and later died from bacterial meningitis. The plaintiffs sought damages under the WDA, including for lost future earnings.

Michigan Supreme Court’s Analysis

Justice Viviano, writing for a unanimous court, reaffirmed the precedent set by Baker v. Slack, which held that damages for lost earning capacity are not available under the WDA. The court emphasized that neither the 1971 nor the 1985 amendments to the WDA altered this exclusion. The court’s decision underscored that recoverable damages under the WDA are limited to:

1. Medical and funeral expenses

2. Pain and suffering of the deceased

3. Loss of financial support

4. Loss of society and companionship

Comparison with New Jersey Wrongful Death Law

New Jersey’s wrongful death statute provides a more expansive scope of recoverable damages compared to Michigan. Key differences include:

1. Lost Future Earnings: Unlike Michigan, New Jersey explicitly allows for the recovery of lost future earnings. The New Jersey Wrongful Death Act permits compensation for the economic value of the decedent’s life, which includes future earnings and financial contributions the decedent would have provided to their dependents.

2. Non-Economic Damages: Both states allow for the recovery of non-economic damages such as loss of companionship. However, New Jersey also permits recovery for the loss of household services and guidance, reflecting a broader interpretation of compensatory damages.

3. Pain and Suffering: New Jersey allows for the recovery of damages for the decedent’s conscious pain and suffering before death under the Survival Act, a distinction that is more restrictive in Michigan’s wrongful death framework.

4. Mental Anguish and Emotional Distress: New Jersey excludes recovery for mental anguish and emotional distress under its wrongful death act but allows it under the Survival Act, provided specific criteria are met. Michigan does not generally permit these types of damages under its wrongful death act.

Practical Implications

The Michigan Supreme Court’s decision in Daher v. Prime Healthcare Services-Garden City, LLC, underscores the state’s conservative approach to wrongful death damages, specifically excluding lost future earnings. This contrasts sharply with New Jersey’s more liberal stance, which allows for comprehensive economic recovery, including lost future earnings.

Legal practitioners in Michigan must navigate these constraints and advise their clients accordingly, focusing on the types of damages that are explicitly permitted. Conversely, attorneys in New Jersey can pursue a broader range of compensatory damages for their clients, reflecting the state’s more inclusive legislative framework.

Conclusion

The Michigan Supreme Court’s ruling in Daher v. Prime Healthcare Services-Garden City, LLC, reinforces the limited scope of recoverable damages under the state’s wrongful death act, emphasizing statutory and historical interpretations. In comparison, New Jersey’s wrongful death statute provides a more extensive range of recoverable damages, including lost future earnings and various non-economic contributions. Understanding these differences is crucial for legal professionals handling wrongful death claims in these states, ensuring that they effectively advocate for their clients’ rights within the respective legal frameworks.
    `,
},
{
    TITLE: "Federal Judge Rules New Jersey’s AR-15 Ban Unconstitutional",
    LINK: `https://edwardharringtonheyburn-com-859775.hostingersite.com/federal-judge-rules-new-jerseys-ar-15-ban-unconstitutional/`,
    CONTENT: `
    Introduction
In a landmark decision, a federal judge has ruled that New Jersey’s ban on AR-15 rifles is unconstitutional. This ruling, which challenges the state’s strict gun control measures, has significant implications for Second Amendment rights and state-level firearm regulations.

Case Background
New Jersey implemented a ban on AR-15 rifles as part of its broader efforts to regulate assault weapons and reduce gun violence. The AR-15, a popular semi-automatic rifle, has been at the center of national debates on gun control, often associated with its use in several high-profile mass shootings.

Legal Issues
The central legal issue in this case revolves around the Second Amendment, which protects an individual’s right to keep and bear arms. Plaintiffs argued that the AR-15 ban infringed upon this constitutional right, claiming that the rifle is commonly owned for lawful purposes such as self-defense and sporting.

Court’s Decision
The federal judge ruled in favor of the plaintiffs, stating that New Jersey’s ban on AR-15 rifles was indeed unconstitutional. The judge emphasized that the AR-15 is widely owned and used by law-abiding citizens, and therefore, its prohibition violates the Second Amendment. However, the ruling did uphold New Jersey’s cap on magazine capacities, limiting them to 10 rounds.

Implications
This decision marks a significant victory for gun rights advocates and sets a precedent for similar legal challenges in other states with restrictive gun laws. The ruling may prompt a re-evaluation of existing and proposed firearm regulations, balancing public safety concerns with constitutional rights.

Conclusion

The federal court’s ruling against New Jersey’s AR-15 ban underscores the ongoing legal and political battles over gun control in the United States. As states grapple with finding effective measures to curb gun violence, this case highlights the complex interplay between state regulations and constitutional freedoms.

References:

CBS News Report on the Ruling
Second Amendment of the United States Constitution
This article provides an analysis of the recent ruling on New Jersey’s AR-15 ban, reflecting the broader national conversation on gun rights and regulations.
    `,
},

{
    TITLE: "New Developments in Young Thug’s YSL RICO Trial: Judge held second secret ex parte meeting",
    LINK: "https://edwardharringtonheyburn-com-859775.hostingersite.com/new-developments-in-young-thugs-ysl-rico-trial-judge-held-second-secret-ex-parte-meeting/",

    CONTENT: `
 July 31, 2024
Edward Harrington Heyburn
The ongoing RICO trial involving rapper Young Thug and the alleged YSL street gang has recently seen significant judicial changes and motions. Here’s an update on the key events and what they mean for the trial:

Judge Recusal and New Appointment
Judge Ural Glanville, who had been overseeing the trial, was recused following a controversial ex parte meeting in June. The meeting, held without the defense present, involved Judge Glanville, prosecutors, and a witness, leading to accusations of bias and a lack of transparency. Superior Court Judge Rachel Krause ruled that, to maintain public confidence in the judicial system, Glanville should be removed from the case.

Judge Shukura Ingram has now taken over the case. Ingram has a background in both criminal and civil cases and has emphasized the need for maintaining decorum and professionalism in the courtroom. She has instituted new rules, such as prohibiting food and earbuds in the courtroom and setting strict hours for court sessions.

Recent Motions and Hearings
The trial resumed with major motions being heard, including a renewed bond request for Young Thug. His attorneys argue that he should be granted a bond due to his strong community ties, lack of flight risk, and harsh jail conditions. They propose strict monitoring and house arrest as conditions for his release.

Additionally, motions for mistrial have been filed by co-defendants, citing concerns about fairness and judicial conduct. The prosecution has also sought to restrict defense attorneys from making public comments to the media, aiming to ensure a fair trial.

Impact and Future of the Trial
Judge Ingram’s appointment and the recent motions have added complexity to an already lengthy and high-profile trial. The case, which began in November 2023, has been marked by numerous delays and contentious legal battles. The trial is expected to continue at a brisk pace under Judge Ingram’s supervision, though it remains uncertain how long it will ultimately take to reach a conclusion.

For further details, you can follow the live updates and watch the trial proceedings on 11Alive or The Fader.

Here is the law on when it is appropriate for a judge to conduct an ex parte hearing or meeting.

Legal Brief on Ex Parte Communications in Georgia
Introduction
This brief addresses the circumstances under which a judge in Georgia may appropriately engage in an ex parte meeting with a party’s attorney. Ex parte communications, which involve discussions with one party without the presence of the opposing party, are generally disfavored in the judicial system to maintain fairness and impartiality. However, there are specific situations where such communications may be permitted under Georgia law.

Legal Framework
The primary sources governing ex parte communications in Georgia include the Georgia Code of Judicial Conduct, statutory provisions, and case law interpretations.

Georgia Code of Judicial Conduct
The Georgia Code of Judicial Conduct provides the foundational guidelines for judges regarding ex parte communications. Rule 2.9 of the Code specifically addresses this issue:

Rule 2.9(A): “A judge shall not initiate, permit, or consider ex parte communications, or consider other communications made to the judge outside the presence of the parties or their lawyers, concerning a pending or impending matter, except as follows: (1) When circumstances require it, ex parte communication for scheduling, administrative purposes, or emergencies that do not deal with substantive matters or issues on the merits is permitted, provided: (a) the judge reasonably believes that no party will gain a procedural or tactical advantage as a result of the ex parte communication, and (b) the judge makes provision promptly to notify all other parties of the substance of the ex parte communication and allows an opportunity to respond.”
Rule 2.9(B): “A judge may obtain the written advice of a disinterested expert on the law applicable to a proceeding before the judge, if the judge gives advance notice to the parties of the person to be consulted and the subject matter of the advice and affords the parties reasonable opportunity to object and respond to the notice and to the advice received.”
Rule 2.9(C): “A judge may consult with court staff and court officials whose functions are to aid the judge in carrying out the judge’s adjudicative responsibilities, or with other judges, provided the judge makes reasonable efforts to avoid receiving factual information that is not part of the record.”
These rules establish that ex parte communications are generally prohibited unless they fall within specific exceptions for administrative purposes, emergencies, or obtaining expert legal advice.

Statutory Provisions
Georgia statutory law also touches on the issue of ex parte communications, emphasizing the necessity for judicial impartiality and fairness.

O.C.G.A. § 15-1-8: This statute underscores the importance of judicial conduct free from bias or prejudice, implicitly supporting the restrictions on ex parte communications to avoid any appearance of impropriety.
Case Law
Georgia case law provides further clarification on the application of these rules and statutes in various contexts.

State v. Belt: In this case, the Supreme Court of Georgia held that a judge’s ex parte communication with one party without notifying the other party could lead to a violation of the due process rights of the uninformed party. The court emphasized that such communications must be limited to non-substantive matters and should be disclosed promptly to all parties.
In re Inquiry Concerning Judge Harvey: This judicial disciplinary case reiterated the importance of avoiding ex parte communications that could create an appearance of bias or favoritism. The Georgia Judicial Qualifications Commission found that Judge Harvey’s ex parte meetings with one party’s attorney, which included substantive discussions about the case, were inappropriate and violated the Code of Judicial Conduct.
Permissible Ex Parte Communications
Under the established legal framework, the following scenarios may permit ex parte communications:

Administrative Matters: Judges may engage in ex parte communications for scheduling and other administrative purposes, provided no party gains an advantage and all parties are promptly informed.
Emergency Situations: In emergencies, judges may have ex parte communications if it is necessary to address immediate issues that cannot wait for a formal hearing.
Expert Legal Advice: Judges may seek written advice from a disinterested expert on the law applicable to a case, with prior notice and opportunity for parties to respond.
Consultation with Court Staff: Judges may consult with court staff and officials, provided they avoid receiving information outside the official record.
Conclusion
Ex parte communications in Georgia are heavily regulated to ensure judicial impartiality and fairness. While generally prohibited, they are allowed in specific, narrowly defined circumstances primarily for administrative, emergency, or consultative purposes. Judges must adhere strictly to the guidelines provided by the Georgia Code of Judicial Conduct, statutory provisions, and relevant case law to avoid any appearance of bias or impropriety.

References
Georgia Code of Judicial Conduct, Rule 2.9
O.C.G.A. § 15-1-8
State v. Belt
In re Inquiry Concerning Judge Harvey
    `
},


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
        NAME: 'Sample Firm',
        COMP_SITE: 'bergplummer.com',
        ADS: {
            ADS: [],
            SPEND: "$13,000"
        },
        TRAFFIC: 
        {
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
          { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
        ],
        REVIEWS: [{
          NAME: 'Tim Smith', REVIEW: 'Amar was of great help!',
          PFP: "https://lh3.googleusercontent.com/a-/ALV-UjUfSRpYaFVPK4EjE-zcezcB-SgVZOGuVbZwO_dUN1ZDrFkg_Tnw=s40-c-rp-mo-br100",
          RATING: 5, DATE: '09/12/21', REVIEW_URL: 'https://www.google.com/',
        },
        {
          NAME: 'Jane Doe', REVIEW: 'Great service!',
          PFP: "https://lh3.googleusercontent.com/a-/ALV-UjUfSRpYaFVPK4EjE-zcezcB-SgVZOGuVbZwO_dUN1ZDrFkg_Tnw=s40-c-rp-mo-br100",
          RATING: 5, DATE: '09/12/21', REVIEW_URL: 'https://www.google.com/',
        },
        {
          NAME: 'Stephan Time', REVIEW: 'John was very helpful!',
          PFP: "https://lh3.googleusercontent.com/a-/ALV-UjUfSRpYaFVPK4EjE-zcezcB-SgVZOGuVbZwO_dUN1ZDrFkg_Tnw=s40-c-rp-mo-br100",
          RATING: 5, DATE: '09/12/21',REVIEW_URL: 'https://www.google.com/',
      }],
     },

    //   {
    //     NAME: 'Sample Firm 2',
    //     COMP_SITE: 'injuryattorneyofdallas.com',
    //     TRAFFIC: [2650, 2550, 2700, 2650],
    //     RANKING_FOR: ['Texas rental attorneys', 'Real estate lawyers close by', 'Asset protection attorneys'],
    //     RECENT_BLOGS: [
    //       { TITLE: 'How to Protect Short-Term Tental Assets', DATE: '09/12/21', LINK: 'test.com' },
    //       { TITLE: 'Effective Real Estate Investment Strategies', DATE: '09/15/21', LINK: 'example1.com' },
    //       { TITLE: 'Understanding The Best Legal Services for Financial Planning', DATE: '09/18/21', LINK: 'example2.com' },
    //       { TITLE: 'The Importance of Insurance in Retirement Planning', DATE: '09/21/21', LINK: 'example3.com' },
    //     ],
    //     JOBS: [
    //       { TITLE: 'Lawyer', POSTED: 'A Month Ago', LINK: 'hi.com' },
    //     ],
    //     ORG: {
    //       LINKEDIN: 'https://www.linkedin.com/',
    //       FACEBOOK: 'N/A',
    //     }
    //   }

    ]
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
