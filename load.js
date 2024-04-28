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

let newUserMoment = false;

if (newUserMoment) {
newUser(docName = 'Vote NO @TDA',

firmInfo = {
    CONTACT_US: "https://www.taxpayerdeceptionact.com",
    NAME: "Vote NO @TDA",
    LOCATION: "Los Angeles, CA",
    DESCRIPTION: 
    `The Taxpayer Deception Act is a misleading ballot measure in California that aims to make it harder for voters to pass measures their communities need and prevent local
    voters from passing advisory measures dictating how they want their tax dollars spent. The initiative would change the rule for enacting a tax increase from the current law,
    which requires a two-thirds vote of each legislative chamber or passage by a majority of voters, to two-thirds of each chamber and a majority of voters.
    It would also redefine numerous governmental fees as taxes subject to the new rule and retroactively invalidate any revenue measures passed since January 1, 2022, unless they're re-ratified in 2025.

    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(31).png?alt=media&token=595741cc-0495-4f2f-8ce1-a604be49c34f
    `,
    MODEL: 2,
    PLAN: "Trial Plan",
},

keywords = {
    KEYWORDS: "CA Taxpayer Deception Act, California Tax Regulations, Supermajority Voting Requirements, LA Legislative Approval, Majority Voter Approval Requirement, Revenue Measure Invalidation, Ratification Deadline 2025, CA Local Tax Measures, LA Advisory Measures, Government Fees Redefined, Local Control CA, Voter Mandates CA",
    LAST_DATE: "04/28/24",
},

smallBlog = [0, 1, 2],

bigBlog = [
{
    TITLE: "Vote NO @TDA Homepage",
    LINK: `https://www.taxpayerdeceptionact.com`,
    CONTENT: `
    Limits Voters' Rights,
Cuts Essential Services

Email

Phone

ZIP Code

By providing your email you agree to receive communications from the Alliance for a Better California. Message frequency varies.

Who's Behind The Taxpayer Deception Act?

The primary funders are multi-billion-dollar wealthy developers and landlords using industry front groups called the California Business Roundtable (CBRT) and the California Business Properties Association.

Say NO to these wealthy developers and landlords and add your name or organization to our coalition today!

THE TAXPAYER DECEPTION ACT Is DANGEROUS

Photo of Endorser
Attacks Voters' Rights

The Taxpayer Deception Act takes away the rights of local voters by making it harder for voters to pass measures their communities need, and by preventing local voters from passing advisory measures dictating how we want our tax dollars spent.

Cuts billions from State & Local Services

According to the independent Legislative Analyst’s Office, this measure will force deep cuts to local public schools, public safety, programs to prevent homelessness, parks, libraries, and all local services.

Photo of Endorser
Allows Big Real Estate to Avoid their Fair share

This ballot measure is a deceptive trick funded with millions of dollars from wealthy real estate developers and landlords. They want us to think this measure would help the average taxpayer, but these corporate special interests wrote this measure to create new loopholes that lower their taxes, help them avoid paying their fair share, and increase the tax burden on working families and small businesses.
    `,
},
{
    TITLE: "Broad Coalition Representing Millions Sounds the Alarm on Dangerous Taxpayer Deception",
    LINK: `https://www.taxpayerdeceptionact.com/news?id=d31efd4b-3f70-43ed-8da9-7311362b3251`,
    CONTENT: `
    MAR
    13
    2024
    PRESS RELEASE
    Broad Coalition Representing Millions Sounds the Alarm on Dangerous Taxpayer Deception
    
    Measure Limits Voter Rights, Puts Schools, Emergency & Disaster Response, Homelessness Services at Risk
    
    Sacramento, CA – Counties, cities, special districts, labor groups and community organizations representing millions of Californians across the state are calling out the California Business Roundtable’s deceptively titled “Taxpayer Protection and Government Accountability Act,” slated for the November 2024 ballot. 
    
    Under the guise of reform, the measure – more accurately described as the Taxpayer Deception Act – limits the ability for voters and state and local governments to fund services by making it harder to raise revenue and pass future ballot measures. It is also retroactive to January 1, 2022, invalidating more than 100 voter-approved ballot measures and new laws. 
    
    “California’s counties are strongly opposed to this dangerous initiative, which will jeopardize the core services our communities rely upon,” said Graham Knaus, Chief Executive Officer, California State Association of Counties. “Funded by a handful of corporate special interests, the measure would undermine voter rights by invalidating measures passed by local voters, imperil core government services for decades, and lead to endless lawsuits that will cost taxpayers.”
    
    “The Taxpayer Deception Act would be a devastating blow to California workers,” Executive Officer, Jay Bradshaw of the Nor Cal Carpenters Union. “Not only would it crater local and state budgets for the upkeep and construction of our roads, freeways and bridges – it would rob hundreds of thousands of workers of the good-paying jobs that keep a roof over their head and keep our economy strong. It will also put-up roadblocks to delivering the housing that all of our communities desperately need. Voters should not be fooled by this deceptive measure, and we urge Californians to vote NO in November.”
    
    “Working Californians are already struggling to make ends meet when paying their rent, at the gas pumps, or buying groceries. The disturbing truth about the reckless Taxpayer Deception Act is that it leaves these struggling Californians without access to critical safety net services including paid family leave, and access to housing that is affordable,” said Sabrina Smith, CEO, California Calls. “By retroactively nullifying more than 130 voter-approved laws, this measure unwinds decades of progress California has made towards equity, opportunity and prosperity for all – which is why each of our 31 grassroots, community based organizations across the state stand together in proud opposition.”
    
    “This dangerous initiative funded by wealthy corporations essentially means 'lights out at city hall' for our cities,” said League of California Cities Executive Director and CEO Carolyn Coleman. “Preventing and reducing homelessness, planning for more housing, picking up the trash, paving streets and roads, and guaranteeing that someone will be there when you dial 911 — this is what’s at stake for residents if this measure passes.”
    
    "Initiative 1935, the ‘Taxpayer Deception Act,’ is irresponsible and unconstitutional,” said Neil McCormick, Chief Executive Officer, California Special Districts Association. “It retroactively invalidates decisions our communities have already approved, stops critical infrastructure projects in their tracks, and threatens the health, safety, and well-being of hardworking families. Local leaders representing communities of all sizes throughout the state stand united against this corporate attack on voters, and its threat to the water, fire protection, healthcare, sanitation, parks and other fundamental local services people need."
    
    The Taxpayer Deception Act was placed on the ballot by the California Business Roundtable and California Business Properties Association and is primarily funded by multi-billion-dollar real estate interests and landlords who want to overturn the will of the voters to avoid paying their fair share.  
    
    THE TAXPAYER DECEPTION ACT THREATENS VITAL PUBLIC SERVICES, UNDERMINES THE DEMOCRATIC PROCESS & CREATES CHAOS BY:
    
    Cutting billions from state and local governments and forcing cuts to safety net services.
    
    Overturning funding for paid family leave, disability insurance, gun violence prevention, and climate programs.
    
    Threatening the safety of roads, freeways, and bridges by permanently eliminating billions in road repair and infrastructure funding.
    
    Allowing just 1/3 of voters to make local funding decisions and block ballot measures over the will of the majority.
    
    Exacerbating deficits and worsening unbalanced budgets.
    `
},

{
    TITLE: "CalPERS, Nation’s Largest Pension Fund Officially Opposes “Reckless” Taxpayer Deception Act",
    LINK: "https://www.taxpayerdeceptionact.com/news?id=12d81640-4aa7-49be-ad87-2fe316a4b03b",

    CONTENT: `
MAR
20
2024
PRESS RELEASE
CalPERS, Nation’s Largest Pension Fund,
Officially Opposes “Reckless” Taxpayer Deception Act 

Sacramento, CA – The California Public Employee Retirement System (CalPERS) Board officially voted on Wednesday to oppose the Taxpayer Deception Act, a misguided ballot measure placed on the November 2024 ballot by corporations and big real estate companies through the California Business Roundtable (CBRT) and California Business Properties Association.

 Under the guise of reform, the Taxpayer Deception Act limits the ability for voters and state and local governments to fund services by making it harder to raise revenue and pass future ballot measures. It’s also retroactive to January 1, 2022, invalidating more than 100 ballot measures and new laws. By gutting state and local government budgets, the measure threatens the  guarantee of a dignified retirement and healthcare security for millions of Californians who dedicated their lives to public service.

 CalPERS’ clear opposition to this initiative comes as a major blow to the California Business Roundtable (CBRT), whose member corporations benefit from a healthy chunk of the pension fund’s investments: nearly $12 billion. CBRT is made up of some two-dozen powerful corporations and multi-billion-dollar real estate interests in which CalPERS invests retirees’ life savings, these include Blackstone, Kilroy Realty, Hudson Pacific Properties, PepsiCo, Chevron, and Wells Fargo.

 “It’s shocking and appalling that the same multi-billion-dollar real estate interests seeking to invest CalPERS members’ money are trying to defund those same members’ pensions,” said Theresa Taylor, CalPERS Board President. “As a CalPERS Board member and member of SEIU Local 1000, my life’s work is to protect retirement security for state and local government workers.”

 “No one who has dedicated their lives to public service should be worried about being able to retire in dignity, but that’s exactly the situation the Taxpayer Deception Act would create by putting the hard-earned retirement dollars of firefighters and nurses at risk,”  said David Miller, Chair, CalPERS Investment Committee. “Additionally, the measure would eviscerate funding for schools, crippling access to quality education for generations to come and threatening every opportunity our kids have to succeed.”

 “The Taxpayer Deception Act could pull the rug out from underneath millions of public servants who have worked their whole lives to retire with dignity,” said Fiona Ma, California State Treasurer and CalPERS Board member. “This measure’s cynical attack on California would come at a cost workers can’t afford to pay.”

 “Having worked in education for many years, I know firsthand how much Public School Employees count on a secure retirement through their golden years,” said Kevin Palkki, CalPERS Board member. “Not only does the Taxpayer Deception Act threaten state and local government funding for emergency response and badly needed social safety net programs to address homelessness — it puts millions of public servants at risk of a well-deserved retirement.” 

“The Taxpayer Deception Act would rob the same workers who power California’s biggest economies and world-class cities of a chance to enjoy their golden years with dignity,” said Ramón Rubalcava, Chair, CalPERS Health and Benefits Committee. “A strong public retirement system is a promise California has kept for generations, but this reckless measure puts the futures of countless hardworking people at risk. It’s just wrong for California.”

 “The Taxpayer Deception Act invalidates more than 100 ballot measures and new laws already passed by voters, devastating local and state government funding for everything from paid family leave to emergency response to homelessness services,” said Yvonne Walker, CalPERS Board member. “Every single Californian will feel the aftershock of this disastrous ballot measure.”

 “A serious threat to pension and retirement funds at the state and local level will be on the November ballot, in the form of the Taxpayer Deception Act,” said Mulissa Willette, CalPERS Board Member. “As written, this careless initiative jeopardizes our ability to meet pension obligations – breaking the promise of a dignified retirement and badly-needed healthcare benefits for millions of current and future retirees.”
    `,
},

{
    TITLE: "Coalition Vows to Protect Voters & Vital Local Services from Deceptive Corporate Ballot Measure",
    LINK: "https://www.taxpayerdeceptionact.com/news?id=28294790-a540-416f-8e44-98327788586d",

    CONTENT: `
    FEB
    1
    2023
    PRESS RELEASE
    Coalition Vows to Protect Voters & Vital Local Services from Deceptive Corporate Ballot Measure
    
    Put your press release text hCalifornia Business Roundtable initiative steals voters’ power to determine local priorities, lets corporations evade accountability
    
    Latest poll showed overwhelming opposition from voters
    
    Sacramento, CA – Today the Alliance for a Better California, League of California Cities, California State Association of Counties, California Special Districts Association, California Alliance for Jobs and the Contract Cities Association joined together to announce strong opposition to the deceptive ballot measure sponsored by the California Business Roundtable (CBRT), the lobbying arm of the largest and wealthiest corporations in California. 
    
    The coalition of public safety, education, labor, local government and infrastructure groups are vocalizing their opposition as the California Secretary of State’s office announced that the initiative has qualified for the November 2024 ballot. 
    
    “Educators, nurses and firefighters won’t allow extreme, irresponsible corporations to threaten our democracy - there’s just too much at stake, from the quality of our children’s education to the air they breathe,” said the Alliance for a Better California, an organization that includes SEIU California, the California Teachers’ Association, California Professional Firefighters, California Federation of Teachers, California School Employees Association, California Faculty Association, California Labor Federation and the American Federation of State County and Municipal Employees. 
    
    “This deceptive initiative eliminates corporate accountability for the damage they do to our environment, strips voters of the power to set funding priorities for our communities, and drains billions in funding from our schools, public safety, and homelessness response to name just a few. We are going to fight with everything we’ve got to protect our democracy and our children’s future,” the Alliance continued.
    
    “This is the third attempt by deep-pocketed special interest groups to advance an initiative that undermines the rights of local voters to decide what their communities need and jeopardizes the ability of local governments to deliver essential services,” said League of California Cities Executive Director and CEO Carolyn Coleman. “It was a bad idea in 2018, it was a bad idea again in 2022. And it will still be a bad idea in 2024.”
    
    “Counties continue to oppose this deceptive initiative because it undermines the abilities of voters and locally elected officials to provide critical services. This measure obliterates the constitutional authority of locally elected local governments to determine the right balance between revenue and the degree of local services needed by their communities,” said Graham Knaus, CEO, California State Association of Counties.
    
    “At this critical time in California’s history, our communities cannot afford to do even less than the status quo. Sadly, this initiative would lock us into a race-to-the-bottom. Overcoming challenges like drought, flooding, and wildfire will require all of us to work together and consider the real costs of undermining our future. When we think of the kind of communities we want to leave our children and grandchildren, we are not content to settle for the ‘minimum amount necessary’ and we are not willing to limit their voice at the ballot box,” said Neil McCormick, Chief Executive Officer, California Special Districts Association.
    
    "The so-called Taxpayer Protection Act will damage our ability to fund and construct the infrastructure projects that support California's economy. Passage of this measure will mean less safe roads, more congestion and fewer family supporting jobs across the state,” said Michael Quigley, Executive Director, California Alliance for Jobs.
    
    “If passed, this measure could cause irreparable harm to a city’s ability to provide essential services to its residents. This measure is a wolf in sheep’s clothing,” said Marcel Rodarte, Executive Director, California Contract Cities Association.
    
    The CBRT measure would create major new loopholes that allow wealthy corporations to avoid paying their fair share for the impacts they have on our communities, while allowing corporations to evade enforcement when they violate environmental, health, safety, and other state and local laws. It would also significantly restrict the ability of local voters, local governments, and state elected officials to fund critical services like public schools, fire and emergency response, public health, parks, libraries, affordable housing, homeless and mental health services, and public infrastructure. Some of the state’s biggest corporations, developers, mega-landlords, and their political committees spent millions of dollars to put the deceptive and self-interested measure before voters.
    
    Steals power from voters 
    The initiative would steal power away from voters, prohibiting local advisory measures where voters provide direction to politicians on how they want their local tax dollars spent. The measure would make it harder for voters to pass measures needed to fund local services and local infrastructure. It would also retroactively cancel measures already passed by voters, stripping voters of a say in local decisions. 
    
    As Los Angeles Times columnist Michael Hiltzik explained, “The so-called Taxpayer Protection and Government Accountability Act is just one more example of how special interests love to claim that they’re getting government off the backs of the people, when their real goal is to saddle up themselves.”
    
    Eliminates corporate accountability
    The initiative claims to be about accountability while actually eliminating corporations’ accountability for impacts they have on local infrastructure or damage they do to our air, water, or environment. 
    
    Threatens schools, vital services and disaster response
    The initiative would force cuts to public schools, fire and emergency response, law enforcement, public health, parks, libraries, affordable housing, services to support homeless residents, mental health services, and more. It would also reduce funding for critical infrastructure like streets and roads, public transportation, drinking water, new schools, sanitation, and utilities. During a time when our children are still recovering from the impacts of the pandemic, our state is experiencing a deluge of extreme weather disasters, and homeless residents are perishing on our streets, our communities cannot afford for these vital services to be eliminated.
    
    Strong Voter Opposition
    A statewide poll conducted last February found voters resoundingly rejected the measure, with 54% of voters opposed and only 25% in support. The remaining 21% were undecided.    
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
    Also MAKE SURE to give the user a relevant youtube LINK whenever you can. These links are provided below.
    Provide them in the format: <a href="{LINK}" target="_blank"> {TITLE} </a>.
    - When you're sure the main conversation is over, ask for location and email.
      }
    </instruction>

    <youtube-links>

    Limited Partnership: The Holding Company Strategy That Gives You Short-Term Rental Protection!: https://youtu.be/VNCpoXF2Cb0

    Living Trusts 101: Everything You Need To Know For Rental Property Owners! (2023): https://youtu.be/9uJ6eI9tWBY

    Critical Mistakes With Short Term Rental LLCs: Learn The Right Way To Protect Your Properties (2023): https://youtu.be/QX_zfVkXkqA

    Short-Term Rental Insurance: Does A 2nd Homeowner’s Policy Protect You? (2023): https://youtu.be/fHsCF0XWPFk

    Revocable Or Irrevocable Trusts? Which Is Right For You? (2023): https://youtu.be/yjabLjADdAA

    Co-Hosting Short Term Rentals: How to Protect Yourself and Maximize Profits (2023): https://youtu.be/OzR8iFbb4Zs

    Wyoming LLC – Do They Protect Your Real Estate Assets? (2023): https://youtu.be/x3Zx2OALKL0

    How to Shield Retirement Accounts from Lawsuits: https://youtu.be/290WlSAQqXI

    How We Shield Short-Term Rentals from Lawsuits: https://youtu.be/nlt3MgNCslM

    How Land Trusts Could Save You MILLIONS: https://youtu.be/gvwbuBprIHY

    LAWYER Explains: Good Better & Best Approach for Asset Protection: https://youtu.be/0phz3_Hm-w8

    LAWYER EXPLAINS: 13 Myths About Real Estate LLCs: https://youtu.be/dSDWiskSA18

    LAWYER: 10 Asset Protection Myths Holding You Back: https://youtu.be/jNEwxz989Y8

    LAWYER: This Investor Got BAD Advice & What To Do Instead: https://youtu.be/cdNm3enzIzo

    </youtube-links>

   <blog-content>
    {
        TITLE: "How to Shield Retirement Accounts from Lawsuits",
        LINK: 'https://www.strlawguys.com/how-to-shield-retirement-accounts-from-lawsuits/',
        CONTENT: This detailed post explains how 401(k) accounts have unlimited federal protection from creditors under ERISA, while IRAs have a federal bankruptcy exemption limit around $1.4 million that is adjusted yearly for inflation. It warns that investing self-directed IRA funds directly into real estate can expose those assets to liability from lawsuits or tenant incidents. The author recommends holding the IRA assets in an LLC to maintain protection, and using a holding company structure for additional privacy and charging order protection benefits.
    },
    {
        TITLE: "Don't Make Critical Mistakes With Short-Term Rental LLCs: Learn the RIGHT Way to Protect Your Properties!",
        LINK: 'https://www.strlawguys.com/dont-make-critical-mistakes-with-short-term-rental-llcs-learn-the-right-way-to-protect-your-properties/',
        CONTENT: This post stresses the importance of having proper commercial insurance coverage for short-term rentals, as residential policies often exclude commercial activities. It explains why forming an LLC is crucial for separating personal and business assets, protecting the owner from premises liability lawsuits. The author advocates using LLCs over corporations for real estate due to the tax advantages and flexibility of moving assets without triggering taxable events.
    },
    {
        TITLE: "What Grant Cardone Gets Wrong About Airbnb",
        LINK: "https://www.strlawguys.com/what-grant-cardone-gets-wrong-about-airbnb/",
        CONTENT: Challenging Grant Cardone's views, this article argues that top-tier, well-managed Airbnb properties can generate 3-4 times the cash flow of long-term multifamily rentals. It suggests using technology to automate guest communication, monitoring, and dynamic pricing. The post addresses concerns about regulations by emphasizing proper market research. It also recommends having a local team or co-host to handle on-site issues, while the owner can be hands-off.
    },
    
    </blog-content>
    `,
    IMAGE: "https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/image_2024-04-06_013307713.png?alt=media&token=bd6e6f2a-15d3-427f-bf4e-3506005391f8",
    THEME: "#a34040",
    IS_CHAT_ON: true,
},

competition = {
    LAST_DATE: "03/31/24",
    COMPETITION: [{
        NAME: 'Sample PAC',
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
        NAME: 'Sample PAC 2',
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
