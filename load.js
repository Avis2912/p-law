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
newUser(docName = 'Raval Trial Law',

firmInfo = {
    CONTACT_US: "https://ravaltriallaw.com/contact-us/",
    NAME: "Raval Trial Law",
    LOCATION: "Houston, TX",
    DESCRIPTION: 
    `Raval Trial Law is a Houston based litigation law firm offering sophisticated representation to a range of clients
     in insurance litigation matters. Still, our belief is that in order for advocacy to be truly effective, 
     there must be a “bite” waiting behind the “bark.” We prepare thoroughly for the prospect of trial litigation
     and are willing and able to try a case to its conclusion, if necessary.

     Raval Trial Law is presently primarily focused on life insurance and long term disability insurance.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fdecentral%20(37).png?alt=media&token=c6bad835-768d-444e-8f91-db508b9a8fcd
`,
    MODEL: 2,
    PLAN: "Full Suite Plan",
},

keywords = {
KEYWORDS: "Life Insurance, Long-Term Disability Insurance, Insurance Litigation, Houston Law Firm",
LAST_DATE: "06/06/24",
},

smallBlog = [0, 1],

bigBlog = [
{
    TITLE: "Long-Term Disability Insurance vs Short-Term Disability Insurance Explained",
    LINK: `https://ravaltriallaw.com/long-term-vs-short-term/`,
    CONTENT: `
    Disability insurance provides financial security and peace of mind to those looking for additional protection if they can no longer work due to an injury or disabling illness. Americans suffer chronic and debilitating illnesses more and more every year. These injuries and ailments can dramatically impact a person’s ability to work. Thus, many workers have the option of obtaining disability insurance to supplement their income in times of medical crisis.

    What is Texas Disability Coverage?
    Disability insurance is a form of insurance designed to supplement a person’s income while that person is out of work – often related to a medical illness. This type of insurance allows workers to supplement their income during medical treatment and / or recovery. Depending on the coverage plan, insurance may cover between a couple of months to a year or more of income.

    Texas is one of many states that does not offer government-funded disability coverage. Instead, Texans must utilize Social Security Disability Insurance (SSDI), Supplemental Security Income (SSI), Veterans disability benefits (applicable to U.S. Veterans), or private disability coverage. This blog’s primary focus is privately funded disability insurance plans.

    Minimum Standards for Disability Coverage
    Texas law refers to short-term disability and long-term disability insurance as “disability income protection coverage.” Under 28 Tex. Admin. Code § 3.3075, the minimum standard for disability income protection coverage includes the following:

    The plan must provide a periodic payment of at least $100 per month, payable through age 62 and payable for at least $50 after age 62.
    The plan must contain an elimination period of 90, 180, or 365 days, depending on the policyholder’s circumstances.
    The plan must have a maximum time period for payable benefits of at least six months.
    Insurance companies cannot offer disability income protection coverage plans in the state of Texas without abiding by these minimum standards.

    The Differences Between Long-Term Disability Insurance and Short-Term Disability Insurance Coverage
    Hands hovering over image of a person in a wheelchair. Long term disability vs short term.Disability insurance provides a policyholder with supplemental income while on leave from their employment due to a disability. However, there are two forms of disability coverage based on the type of disability a person is experiencing and the duration of their disability.

    Short-term disability insurance coverage allows a person to obtain supplemental income while dealing with a disabling affliction. This type of insurance can last three to six months, depending on the disability. Most short-term disability insurance plans cover approximately 40 percent to 70 percent of a person’s income when they become eligible for coverage. Short-term disability insurance coverage only covers afflictions that can be recovered from over a short period of time.

    Long-term disability insurance coverage allows a person to supplement their income after a crippling injury or illness that leaves them unable to work for the foreseeable future or even for the rest of their lives. Long-term disability coverage typically pays 60 percent of a person’s gross monthly wage during the coverage period.

    Long-term disability coverage can span a year or more, including the duration of time from disability inception until the insured becomes eligible for Social Security or retirement. The terms of coverage will vary by policy.

    Understanding Disability Coverage
    Those seeking disability coverage from private insurance should understand what they can expect in most disability insurance policies. See below for a breakdown of standard disability insurance policies and their clauses.

    Eligibility Clause
    After a policyholder has purchased the plan and commenced paying monthly premiums, a particular set of circumstances must occur before they can utilize their disability benefits:

    The policyholder must complete a mandatory waiting period before becoming eligible for benefits under the plan.
    Plans typically include an assessment conducted by a medical professional who can adequately evaluate the claim for disability benefits by reviewing the policyholder’s injury or illness.
    The insurance company typically conducts an independent third-party review of the claim by another medical professional of its own choosing.
    Pre-Existing Condition Clause
    Most clauses governing pre-existing conditions do not preclude a person with a pre-existing condition from purchasing disability insurance coverage and utilizing their benefits when the need arises.

    Instead, a pre-existing condition clause usually encompasses illnesses and injuries that occurred within the prior three months before obtaining coverage. In those cases, the insurance company may prohibit a policyholder from obtaining income benefits from the plan for the first six months of coverage.

    After the preliminary six months of premiums have been paid, the policyholder will likely have to enter a waiting period. Once the waiting period has ended, the policyholder will probably be eligible for benefits.

    Waiting Period Clause (Long-Term Disability Insurance)
    Disability insurance form. Long term vs short term disability.As stated above, policyholders may have to engage in a waiting period under a disability plan before obtaining benefits. This waiting period is similar to a probationary period to deter users from receiving benefits directly after purchasing coverage. Under most waiting period clauses, a policyholder will likely have to wait anywhere from 180 days to six months to qualify for coverage. Often, policyholders must utilize their employer-provided sick and benefit time before receiving income benefits from a disability plan.

    Coverage Period
    The coverage period depends on the nature of the affliction and the plan’s parameters. For short-term plans, a person can expect to see between three to six months of benefits. However, this depends on the policyholder’s illness and whether it is a short-term affliction. For long-term plans, policyholders should expect benefits for as long as they are disabled, which can easily reach a year or more of benefits.

    Monthly Benefits
    Monthly benefits range from 40 percent to 70 percent of the policyholder’s income, depending on the type of coverage and policy terms. Most plans will calculate how much to provide in monthly benefits using a person’s average weekly wage or gross monthly wage, which all depends on the policy and the person’s occupation. For example, if a person earns $2,000 a month in wages, they can expect to receive $800 to $1,400 a month in disability benefits.

    Can I Use Disability Insurance While on FMLA Leave?
    The short answer is yes. The Family Medical Leave Act offers eligible employees 12 weeks of unpaid leave due to a qualifying medical or family event. During the leave period, the employee’s position with their employer is protected from termination. Qualifying events can include:

    Birth of a child.
    Adoption or foster care of a child within one year of placement.
    Affliction of an illness or injury that renders an employee unable to perform their essential job functions.
    Providing care to a qualifying family member.
    When on FMLA, a person may be eligible for disability benefits depending on the type of plan they purchase. For long-term disability insurance coverage, FMLA leave will likely expire before a person is eligible for disability insurance coverage, which means the benefit may only be utilized after they are no longer on FMLA leave. However, because short-term disability insurance has a shorter eligibility window, a policyholder may use disability insurance to supplement their income while on leave.

    Contact Us About Your Disability Claim Today
    Disability insurance can be a savior to many experiencing a long-term or short-term disability. However, understanding a disability insurance policy and the claims process can be difficult. If you have questions or concerns about your disability coverage, please contact one of our Houston disability insurance lawyers today at Berg Plummer Johnson & Raval, LLP for a consultation
    `,
},
{
    TITLE: "Types of Life Insurance Exclusions",
    LINK: `https://ravaltriallaw.com/types-of-exclusions/`,
    CONTENT: `
    Life insurance provides a financial safety net for surviving family members when someone dies unexpectedly. Life insurance proceeds must be paid to the beneficiaries in a timely manner. But there are circumstances which can excuse an insurance company from the obligation to pay benefits.

    The person on whose life the insurance policy is underwritten has entered into a contract with the insurance company. In that contract, the insurance company has promised to pay a certain sum of money to beneficiaries designated by the policy owner upon the owner’s death. However, in order to trigger the insurance company’s obligation to pay, the policy owner must comply with certain conditions and no policy exclusion can apply.
    
    Life insurance companies are allowed to avoid paying the benefits on a life insurance policy if one of the coverage exclusions permitted in Texas applies. Insurance companies may sometimes argue an exclusion applies when the claim is actually legitimate.
    
    It can be devastating to families to have a life insurance claim denied after the already harsh impact of losing a loved one. Life insurance companies need to be held to the commitments made to policy owners. A Houston life insurance lawyer can help beneficiaries collect the life insurance proceeds they are entitled to.
    
    Permissible Life Insurance Policy Exclusions Under Texas Law
    With limited exceptions, life insurance companies operating in Texas cannot exclude coverage based on a particular cause of death. The Texas Insurance Code’s life insurance section, 1101.055, lists the causes of death that insurance companies are allowed to exclude:
    
    Death by suicide whether the decedent was mentally competent or not
    Death as the result of a hazardous occupation
    Death as the result of aviation activities
    Death by Suicide
    Exclusions of coverage, when the cause of death is self-inflicted, are aimed at discouraging financial benefit as a motive for suicide. The exclusion of coverage when death is by suicide only lasts for two years after a policy is issued. After two years, a life insurance policy must pay benefits regardless of how the policy owner died except for a beneficiary who was involved in willfully bringing about the policy owner’s death.
    
    Hazardous Occupation
    Life insurance policies may exclude coverage when death is the result of engaging in an occupation where the risk of death is greater than average. Occupations are to be distinguished from hobbies and recreational activities which cannot be excluded.
    
    Military service and occupations such as construction, oil and gas extraction, law enforcement, and commercial fishing are among some of the occupations a life insurance company may choose not to underwrite. For the exclusion to apply, the excluded hazardous occupation must be listed in the policy.
    
    Aviation Activities
    Hang glider. Types of Life Insurance ExclusionsLife insurance policies may exclude coverage when death is caused by certain aviation activities stated in the policy. The Texas Department of Insurance says the following types of aviation activities are acceptable to exclude:
    
    Duties aboard an aircraft as a pilot or member of a flight crew
    Assisting in the operation of an aircraft
    Giving or receiving training regarding an aircraft
    Being aboard an aircraft for any purpose other than as a passenger
    Hang gliding
    Para-planing
    Death by descending or falling from an aircraft is not considered an excludable aviation activity. Thus, skydiving cannot be an excluded cause of death in a life insurance policy but hang gliding could be.
    
    Insurance Companies Have A Two-Year Window to Contest Coverage
    Limiting the amount of time a life insurance company has to challenge the obligation to pay benefits protects consumers from having coverage voided years after a policy is issued. Life Insurance policies in Texas are required to contain language stating they will be uncontestable if the insured lives two years from the date the policy is issued and pays the premiums.
    
    After the contestability period, life insurance companies generally cannot deny the payment of claims based on misrepresentations made by the policyholder. But there is no limit on the contestability period when a policyholder has committed fraud. Fraud voids the contract and the obligation to pay.
    
    There are some circumstances under which the contestability period may be extended. Life insurance companies can choose to include policy language that extends the contestability period for challenging the violation of policy conditions relating to military service during a time of war.
    
    Misrepresentations May Reduce Proceeds but Rarely Void Life Insurance Contracts
    A misrepresentation as to age in a life insurance application will not void the insurance company’s obligation to pay but the payout will be reduced to the amount of insurance that the policy owner could have purchased with the premiums paid had the correct age been given.
    
    The Texas Insurance Code says a misrepresentation made in an application to an insurance company will only void the contract if it is material to the risk or contributes to the circumstances triggering the insurance company’s obligation to pay.
    
    The Supreme Court of Texas recently clarified when a misrepresentation made on an application would be sufficient to excuse a life insurance company from paying the policy amount during the contestability period. The policy owner had indicated ‘no’ on a medical history question. Upon reviewing the policy owner’s medical records, it was discovered that the question should have been answered ‘yes’. The insurance company tried to deny paying the benefits based on the insured’s misrepresentation.
    
    The issue was whether a misrepresentation need only be of a material fact affecting the risk assumed or whether the applicant must also intend to deceive the insurance company. The Texas Insurance Code makes no mention of intent as necessary for a misrepresentation to void a life insurance contract; however, common law does.
    
    The Texas high court upheld the longstanding principle that there must be an intent to deceive in order for a material inaccuracy to void an insurer’s obligation to pay.
    
    What Happens When Your Life Insurance Claim is Denied?
    Life insurance policy papers. Types of life insurance exclusions.The problem with insurance companies is that they are for-profit businesses. The more claims they pay, the less money they make. Insurance companies have a strong incentive to limit the payment of claims as much as they can legally get away with. To protect against the perverse incentive to deny clains, insurance companies are required by Texas law to settle claims in good faith. An insurance company that acts in bad faith can be held liable for damages – often beyond the value of the actual policy.
    
    Misrepresentation is a common reason life insurance companies attempt to deny paying claims. If a life insurance claim is denied based on a misrepresentation by the policy owner, the insurance company cannot avoid paying the claim unless the misrepresentation was both significant to the insurance company’s decision to underwrite the risk and made with the intention to influence the company into issuing the policy.
    
    There is typically an appeal process where life insurance claimants can refute the insurance company’s reasons for denying the claim. Getting legal help at this stage of the process can help persuade the insurance company to reverse its decision and pay the claim. It will also lay the foundation for a more successful claim in court should you need to move into civil litigation to recover what you are rightfully owed.
    
    Where To Get Help Fighting the Wrongful Denial of a Life Insurance Claim
    After a loved one has passed, the last thing a grieving family needs is a hassle with an insurance company over paying a claim. Unfortunately, life insurance claim denials are all too common and can create hardships, adding more anguish to an already difficult situation.
    
    At Berg Plummer Johnson & Raval, LLP, we help life insurance beneficiaries challenge claim denials and force insurance companies to honor their contractual obligations to pay claims.
    `
},

{
    TITLE: "What To Do If a Life Insurance Policy Claim Is Denied",
    LINK: "https://ravaltriallaw.com/policy-denied/",

    CONTENT: `
    Life insurance is usually purchased to make sure a beneficiary has some financial means if the policyholder should die. Life insurance contracts promise to pay a beneficiary in a timely manner upon proof of death and compliance with policy terms and conditions.

However, because insurance companies would rather not pay out any more than is necessary, they will look very closely at the circumstances of the policyholder’s death and try to determine if there is any way to avoid paying the life insurance benefit.

Life insurance companies are heavily regulated in Texas and are expected to evaluate claims in good faith and deal fairly with claimants. When companies unfairly delay or deny legitimate claims, beneficiaries have the right to challenge those decisions.

Why Insurance Companies Deny Life Insurance Claims
Companies reserve the right to deny paying life insurance benefits if certain policy conditions are not met by the policyholder or the beneficiaries. When a life insurance company denies a claim for benefits it is usually for one of the following reasons:

Premium payments were not made: If the policyholder missed paying the premiums, the policy may have lapsed. However, if only a payment or two were recently missed, there may be a window of opportunity to resolve the matter.
Death occurred under contestable circumstances: Contestable circumstances are one of the most common reasons for a life insurance claim denial. Every policy is different and may have unique exclusions or specific contestable timeframes. Generally, if a person’s death is ruled a suicide or they were involved in illegal activity at the time of death, a life insurance policy claim may be denied.
Information was misrepresented on the application for coverage: In some cases, a claim may be denied if the information on the application is thought to be false. For example, if the policyholder inflated their income or failed to disclose any prior health concerns.
Exclusion of coverage applies: Life insurance policies will cover most forms of death. However, many policies will exclude certain high-risk behaviors and activities. For example, a policy may not cover death attributed to substance abuse or skydiving.
Speaking to an experienced life insurance lawyer can help you understand the details of your denial and pursue any opportunity to appeal the decision.

Life Insurance Claims Denied During the Contestability Period
Life insurance policies in Texas have a two-year contestability period. That means if a policyholder dies within two years of purchasing a life insurance policy, the issuing insurance company has the right to investigate the circumstances of the death and may be able to deny paying benefits.

The contestability period is intended to give insurance companies the opportunity to detect fraudulent claims. There is also a standard exclusion in life insurance policies denying coverage if a policyholder dies by suicide during the contestability period. A life insurance claim might also be denied if it is discovered that the policyholder provided inaccurate information on the application for coverage.

Once the contestability period has expired, the only way an insurance company can legally deny paying benefits other than for non-payment of premiums or an applicable policy exclusion is to show the policyholder intentionally provided false information that was significant to underwriting the risk.

Life Insurance Claim Denial for Misrepresentation on the Application for Coverage
The Texas Insurance Code says a misrepresentation on a life insurance application will not void coverage unless:

It is of a material fact
It affects the risks assumed
Material facts with regard to life insurance will be the personal information requested on the life insurance application. Risks are rated based on the answers given. If the information provided is inaccurate, the appropriate premiums will not be charged, and a risk may be underwritten that would not otherwise be eligible for coverage.

The law further states that a life insurance claim cannot be denied based on a misrepresentation in the application after the two-year contestability period unless the misrepresentation was:

Material to the risk; and
Intentionally made
The specific requirement that a misrepresentation be intentional to void a life insurance claim after the contestability period led some insurance companies to believe a misrepresentation during the contestability period only had to be material to the risk in order to deny a life insurance claim.

The Texas Supreme Court recently clarified the issue of an applicant’s intent when misrepresentations are made in life insurance applications in an opinion published on April 28, 2023:

“Adhering to our precedent, we therefore hold that insurers must plead and prove intent to deceive to avoid contractual liability based on a misrepresentation in an application for life insurance, whether the policy is contestable or not.”

 Thus, a life insurance claim cannot be denied at any time for a misrepresentation in the insurance application unless it can be proven the misrepresentation was made with the intent to deceive the insurance company into issuing the policy.

Typical Exclusions of Coverage in Life Insurance Policies
Texas law allows life insurance companies to settle life insurance claims for less than the face amount of the policy when a policyholder’s death occurs in any of the following ways:

By suicide during the contestability period
Engaging in a hazardous occupation
Engaging in aviation activities
The occupations which are considered hazardous and the prohibited aviation activities must be explicitly stated in the policy.

How to Challenge an Insurance Company when a Life Insurance Claim is Denied
When a life insurance claim is made, it means someone has died, and often family members are still struggling with their loss when they receive the claim denial. The insurance company’s actions can cause additional suffering during an already difficult time. The beneficiaries can usually appeal the insurance company’s decision but will have to provide additional evidence to get the insurance company to change its position.

Insurance companies are required to provide written reasons for denying coverage. If the reason for the denial is non-payment of premiums, the insurance company likely has the right to deny coverage. Similarly, if the cause of death is excluded by the policy terms, the insurance company may have a valid reason for rejecting the claim. Challenging these denials requires a detailed investigation into the circumstances and the help of an experience life insurance claims denial lawyer.

Claiming the policyholder misrepresented information in the insurance application is a common reason given by life insurance companies when denying a claim. But in order to avoid paying a life insurance claim, the misrepresentation must be both material (related to the risk being underwritten) and intentional (wanting the insurance company to rely on the false information).

Proving the mental state of someone who is unavailable to question can be difficult for an insurance company, and the evidence must be compelling for a court to rule in favor of denying payment of life insurance benefits.

Courts and juries don’t like insurance companies trying to get out of paying covered claims. Unless the misrepresented information would have caused the insurance company to decline the risk in the first place, a life insurance benefit will likely be payable less any additional premium that would have been charged if the insurer had accurate information when assessing the risk.

Don’t Risk Losing Life Insurance Benefits
Life insurance proceeds are often needed to provide for surviving family members. Delays and denials by insurance companies can cause unnecessary hardships and may indicate an insurance company acted in bad faith.

A Houston insurance litigation attorney whose practice is to help beneficiaries who have had life insurance claims denied knows how to investigate the reasons given for denial and get the information necessary to persuade an insurance company to pay a legitimate life insurance claim without further delay. Contact us today and find out how Berg Plummer Johnson & Raval, LLP can help with your denied life insurance claim.
    `,
},

{
    TITLE: "Can Insurance Companies Deny Cancer Treatment?",
    LINK: "https://ravaltriallaw.com/deny-cancer-treatment/",

    CONTENT: `
    The answer to the question of “Can insurance companies deny cancer treatment?” is often different from the answer to the question of “Do insurance companies deny cancer treatment?”

    Although federal law often prohibits insurance companies from denying certain vital cancer treatments, patients are often forced to fight for coverage. In some cases, patients may even end up paying for the necessary treatment out of their own pockets because they cannot afford to lose time waiting to receive an insurer’s authorization before beginning treatment. Some patients may be forced to take legal action against their insurance company to get the vital coverage they need. One of the most common reasons why cancer patients must fight insurance companies is that they have been denied coverage for proton beam therapy treatment.
    
    Federal Law Places Requirements on Health Insurance Companies
    The Affordable Care Act made numerous changes in the law that governs how and when insurance companies must cover illnesses like cancer. Health insurance providers are no longer able to deny coverage on account of pre-existing conditions, nor can they impose yearly or lifetime caps on the amount of coverage that they provide. Insurance plans must cover essential health benefits that include cancer treatments.
    
    In practice, insurance companies push the limits as far as they can to save themselves money. It is, unfortunately, all too common for patients to either have to fight to get the coverage they need or have it denied altogether.
    
    Health Insurance Companies Have Often Flouted the Law
    A relatively recent survey by the Texas Medical Association revealed that roughly one in every four people have had coverage for treatment prescribed by their doctor denied by an insurance company, notwithstanding the requirements of the Affordable Care Act. This includes people who have critically needed life-saving cancer treatment. Some patients’ conditions grew worse after having been denied the treatment or taking the time to fight the denial of coverage.
    
    Insurance companies give many reasons for their denial of coverage of certain medical treatments to save themselves money at the expense of cancer patients, including:
    
    The cancer treatment is medically unnecessary
    The treatment is experimental in nature
    The specific provider of the treatment is out of the insurer’s network
    To insurance companies, it does not matter that a doctor has recommended a treatment or that it may save the patient’s life. All that matters is that a cancer treatment may be expensive and will hurt the insurance company’s bottom line. Patients are already facing a tough battle in their fight against cancer. Unfortunately, they may also be forced to fight another battle: getting their insurance company to authorize payment for the treatment of that cancer.
    
    Cancer treatments such as proton beam therapy are prescribed out of medical necessity. Presumably, they would meet the requirements for coverage under the Affordable Care Act. In a dispute with your insurer, the burden of proof may shift to you to prove that proton beam therapy is both a recognized treatment and medically necessary. Even if you can prove both with ease, you can still expect a fight on your hands.
    
    You Can Contest the Insurance Company’s Denial of Your Cancer Treatment
    Under the law, you have a right to challenge the denial of cancer treatments. Unfortunately, the appeals process takes time, and time may not be on your side when you are undergoing treatment for cancer. Nonetheless, you owe it to yourself and your family to fight as hard as you can for all the necessary and required treatments. Before filing your appeal, you should closely review the exact language of your health insurance policy because recent changes to federal law allow for policies that are less comprehensive in nature. In addition, you can and should consult an insurance coverage lawyer during the administrative appeals process.
    
    Before you appeal your insurer’s decision to deny your cancer treatment, you should take several steps that can increase your chances of success, including:
    Gathering documentation that conclusively shows that the treatment is medically necessary
    Compiling additional medical records that detail your medical history and the prior course(s) of your treatment(s)
    Contacting your medical providers to help obtain supportive evidence of medical necessity
    Consulting with an insurance lawyer who can advise you on the appeals process
    Insurance companies are required to offer an internal appeals process wherein you can contest the denial of benefits. However, without legal representation, the internal appeals process can become  a rubber stamp of the initial decision that was made. Insurance companies rarely take an objective look at their own decisions, even though there may be legal consequences for decisions that violate the law.
    
    You Can Take Your Case to Court if Necessary
    There is an additional external check on the conduct of insurance companies. You can always take your insurance company to court and file a lawsuit to compel it to cover your cancer treatment. In the meantime, you would need to retain legal counsel and go through the entire court process and win your case. A court would provide an objective review of whether your cancer treatment would be required under federal law.
    
    In addition, state law also serves as a constraint on an insurance company’s behavior. If the insurance company has unreasonably denied your coverage, it could be subject to a bad faith lawsuit. Further, if there are many people who have had the same treatment denied, a class action lawsuit against the insurance company may even be possible. For example, Aetna recently settled a class action lawsuit alleging that it wrongfully denied cancer treatments. A class of 142 patients who were wrongfully denied proton beam therapy treatments received a total of $3.4 million.
    
    In another case, a judge lambasted United Healthcare for its “immoral and barbaric” conduct in denying coverage for proton beam therapy treatment. The judge, who was himself a cancer survivor, stated that “it is undisputed among legitimate medical experts that proton radiation therapy is not experimental and causes much less collateral damage than traditional radiation.”
    
    You can and should fight back when your insurance company has wrongfully denied your cancer treatment. Not only can you legally force it to cover your treatment, but you may win additional damages in court. Also, fighting back could lead to negative news headlines for insurance companies and cause them public relations and reputational nightmares. An experienced insurance claims denial attorney knows how to leverage the court of public opinion to help support your legal battle against your health insurance company.
    `
},

{
    TITLE: "Why Government Plans Are Exempt From ERISA",
    LINK: "https://ravaltriallaw.com/why-government-plans-are-exempt-from-erisa/",

    CONTENT: `
    If you have been denied benefits provided through an employer-sponsored plan, your claim will generally fall under the Employee Retirement Income Security Act (ERISA). ERISA is a federal law that governs most employee benefit plans. While ERISA was originally enacted to safeguard employees’ retirement and pension benefits, its reach and scope has been expanded over the years.

But not all employee benefit plans fall under ERISA. When Congress crafted ERISA, it wanted to reduce abuses in the system for private employee pensions. However, it decided that state and local governments should be free to decide the best way to protect their employees. This became an established part of the law. Under ERISA, a government plan means any plan “established or maintained” by the federal government, a state government or political subdivision, or by any agency or instrumentality of any of the foregoing. 29 U.S.C. §1002(32). Courts have defined “established” to include plans created under a collective bargaining agreement between a government unit and a union.

This means that employees who fall under the government plan exemption are not subject to ERISA. There are many reasons why it is beneficial to get out from ERISA’s reach. Like other states, Texas has laws governing life, accidental death, disability, and health insurance that are more fair to insurance claimants and allow them to sue an insurance company for breach of contract, insurance bad faith, and punitive damages. Emotional distress damages and other damages caused by insurance company’s bad faith may be recoverable under Texas law but are not recoverable in ERISA cases.

Determining whether a matter is governed by ERISA can be a complex process, but this is one factor to keep in mind when a plan may be established or maintained by the government. If you have been denied ERISA benefits, a Houston ERISA attorney at Berg Plummer Johnson & Raval, LLP can help you file a case and recover the compensation you deserve. For more information on filing an ERISA claim, call our firm today at (713) 526-0200 or contact us online to schedule a consultation. Our lawyers offer unique, cost-effective fee arrangements and will fight for your rights throughout the entire duration of your case.
    `
},

{
    TITLE: "The Mental Health Parity Act Explained And Why It Matters",
    LINK: "https://ravaltriallaw.com/why-government-plans-are-exempt-from-erisa/",

    CONTENT: `
    Mental illness affects a significant number of Americans, and many of them are not able to get the treatment they need. Even when health plans cover mental health benefits, they can be harder to access and less comprehensive than other types of health benefits.

    The Mental Health Parity Act (MHPA) of 1996 was the original legislative attempt to force providers of group health insurance for employees to furnish the same levels of coverage for mental health benefits as were provided for medical / surgical (M/S) benefits.
    
    Prior to the enactment of the MHPA, health benefit providers had been slow to recognize that mental health disorders were as important in terms of needing effective treatment as physical health conditions. Federal legislation over the years has expanded the scope of the MHPA to press health benefit providers to make mental health treatment as accessible as other health benefits.
    
    Though improvements in access to mental health treatment are being made, parity with access to M/S benefits has not been achieved, and legislative efforts to enforce compliance by health benefit plan providers continue.
    
    Mental Illness and Substance Use in America
    According to the Substance Abuse and Mental Health Services Administration (SAMHSA) annual survey on mental illness and substance use levels, one in four adults – over 83 million Americans – had a mental illness. More than 12 million adults had serious thoughts of suicide, and 1.7 million attempted to take their lives.
    
    Over 46 million people ages 12 and above met the criteria for having a substance use disorder, with 30 million people classified as having an alcohol use disorder and 24 million people classified as having a drug use disorder. The highest incidence of substance use disorder was among young adults ages 18 to 25.
    
    The Mental Health Parity and Addiction Equity Act (MHPAEA)
    The MHPAEA (Parity Law) was passed in 2008 and added addiction diseases to the mental health parity requirement. The Parity Law requires group health coverage providers to make financial requirements and treatment limitations no more restrictive for mental health or substance use disorders (MH / SUD) than for other medical and surgical benefits.
    
    The Affordable Care Act (ACA)
    Effective in 2014, the ACA expanded the reach of mental health and substance use disorder parity to small group and individual health plan providers and made MH / SUD coverage mandatory as an essential health benefit under the affected plans.

    Latest Developments in Mental Health Parity Law
    Recognizing how much work still remains to achieve mental health parity, the Department of Labor, along with HHS and the Treasury Department, have proposed a rule designed to make parity a reality for more people seeking MH / SUD services.
    
    The proposed rule would require group health plan providers to present actual data showing how a person’s access to treatment is affected by the limitations placed on benefits. Attention will focus on how provider networks are constructed and whether they promote access to benefits.
    
    The rule would also change how NQTL criteria are analyzed for purposes of compliance and set forth required content elements for analysis.
    
    Parity in Texas
    Under the Texas Administrative Code, a health benefit plan that provides both M / S and MH / SUD benefits must comply with the following regarding lifetime aggregate or annual dollar limit restrictions:
    
    If there are no limits or limits on less than one-third of the medical/surgical benefits, there can be no limits on MH / SUD benefits.
    If there are limits on at least two-thirds of M / S benefits, they must be applied in a way that does not distinguish mental health / substance use disorders, or there must not be a more restrictive limit on MH / SUD benefits.
    Non-quantitative treatment limitations imposed on MH / SUD benefits must be similar to and applied no more stringently than NQTL applied to M / S benefits.
    
    What You Can Do if a Parity Violation is Suspected with Regard to MH / SUD Benefits
    Under current federal and state laws, many but not all health benefit plans are required to provide MH / SUD benefits. If your health plan has benefits for MH / SUD, they must be as easy to access as your other medical benefits. Any limitations on mental health benefits can be no more restrictive than the limitations on M / S benefits.
    
    If you’ve had an insurance claim for mental health or substance use treatment denied and you believe the treatment limitations violate parity requirements, Berg Plummer Johnson & Raval, LLP may be able to help you get compensation. Our Texas health insurance lawyers have decades of experience helping clients obtain the benefits they are entitled to. In Houston, contact Berg Plummer Johnson & Raval, LLP to discuss your health benefit plan and how to get your claim covered.
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
