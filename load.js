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

const newUser = async (docName, firmInfo, smallBlog, bigBlog, competition) => {
    try {
        const userDocRef = doc(`firms/${docName}`);
        await userDocRef.set({

            FIRM_INFO: firmInfo,

            BLOG_DATA: {
                SMALL_BLOG: smallBlog,
                BIG_BLOG: bigBlog,
            },

            LEADS: [{
                NAME: "Sample John",
                EMAIL: "johnsample@gmail.com",
                NUMBER: "542-123-4568",
                SUMMARY: "Was in a car accident and needs help.",
                DATE_TIME: "04/04/24 | 12:54 PM",
                CONVERSATION: [
                    {assistant: `Hello, welcome to ${docName}! How can I help you today?`},
                    {user: `Hey! Can you guys help me with EB1 Wait Time Expedition?`},
                ]}, { 
                NAME: "Sample Sarah",
                EMAIL: "sarahsample@gmail.com",
                NUMBER: "542-123-4567",
                SUMMARY: "Looking for asset protection services.",
                DATE_TIME: "04/06/24 | 7:54 PM",
                CONVERSATION: [
                    {assistant: `Hello, welcome to ${docName}! How can I help you today?`},
                    {user: `Hey! I am looking for EB5 application help.`},
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
newUser(docName = 'Morgan & Weisbrod',

firmInfo = {
    CONTACT_US: "https://www.morganweisbrod.com",
    NAME: "Morgan & Weisbrod",
    LOCATION: "Dallas, TX",
    DESCRIPTION: `

    At Morgan & Weisbrod LLP, we have decades of experience working alongside disabled clients in Texas, Oklahoma, Arkansas, New Mexico, Arizona, and Colorado who need and deserve financial support. We are Board Certified Specialists in SS and VA Disability Law; it’s all we do. Over the past 48 years, have won millions of dollars in past due benefits for the thousands of SS, SSI and VA Disability clients we have represented. As you struggle to adjust to life with your debilitating health condition, you should not have to struggle against the Social Security system. Let us fight for your legal rights while you focus on your health and family.
    Our law firm focuses solely on disability claim cases, and we have more Board-Certified Social Security Disability attorneys than any other law firm in the United States.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(28).png?alt=media&token=85bbfc48-1b8a-4b66-9828-b61a14aae608
    
    `,
    MODEL: 2,
    PLAN: "Full Suite",
},

smallBlog = [0, 1, 3, 4],

bigBlog = [
{
    TITLE: "What Is Your Onset Date?    ",
    LINK: `https://www.morganweisbrod.com/blogs/what-is-your-social-security-disability-onset-date/`,
    CONTENT: `

    Long-Term Disability Insurance vs Short-Term Disability Insurance Explained
    by Amar Raval
    Dec 11, 2023
    Doctor touching shoulders of patient in a wheelchair. long term disability vs short term.
    You will not receive a Social Security disability check on the day that you become disabled. Instead, you will have to apply for Social Security disability benefits and part of the application will include proving when you became disabled. The date when you became disabled is known as your Social Security disability onset date.

    How to Establish a Disability Onset Date
    If you were hurt and became disabled as a result of a sudden accident, it may be easy to provide the date when your disability started. However, if you have a medical condition or illness, it might be more difficult to pinpoint the exact date on which you became disabled.
    
    The Social Security Administration (SSA) will consider the following factors in determining your onset date:
    
    The date that you designate as your alleged onset date on your Social Security disability application.
    The date on which you stopped working or stopped working enough to earn a significant income.
    Your doctor’s opinion as to when your disability began and you became unable to work.
    Your medical records.
    It is important that the onset date be accurate because you may be eligible to receive Social Security disability beginning five months after your established onset date. In some cases, you may be able to receive compensation for months when your Social Security disability application was pending.
    
    What If You Try to Work and You Are Unsuccessful?
    In some cases, people with disabilities will attempt to work after their onset dates of disability. Unfortunately, they may find that their health problems only allow them to work for brief periods of time. This is what SSA calls an “unsuccessful work attempt.”  An unsuccessful work attempt occurs after a “significant break” from the time you stopped working or reduced your work and earnings below substantial gainful activity levels. Generally, the SSA considers a significant break to be at least 30 consecutive days or when you are forced to change to another type of work or employer.
    
    You may be concerned that your unsuccessful work attempt will impact your disability onset date. However, if your work activity after your onset date of disability is considered an unsuccessful work attempt, it will not affect the date you alleged that you became disabled.
    
    There are so many factors to look at when trying to pin down which is the correct onset date of disability. That is why it is important to sit down with your attorney and to fully discuss these issues before deciding what date is appropriate.
    
    If you have questions about your established onset date or any other aspect of your Social Security disability application, please read our FREE report, Social Security Disability: What You Need to Know and start a live chat with us today.
    `,
},
{
    TITLE: "Questions You Should Expect To Be Asked During A Social Security Disability Hearing",
    LINK: `https://www.morganweisbrod.com/blogs/common-questions-in-a-social-security-disability-hearing/`,
    CONTENT: `
    
    You never wanted to go to a hearing, but now that your Social Security disability application has been denied you are going to have to go to a hearing in order to get the benefits you deserve. You may be anxious about the process and curious about what you should expect. You deserve to know as much as possible before you get into the hearing room so that you are comfortable and able to fully participate in the proceedings. Below are two ways you can learn about the hearing process so that you can prepare for the big day.

Know What Questions to Expect
You may be more comfortable if you know what kinds of questions to expect during the hearing. The administrative law judge will likely ask you for your name, Social Security number, age, mailing address, height and weight. After that, you should be prepared to answer questions such as:

What is your formal education?
Do you have any vocational training?
Are you currently working?
What was your last job and what were your job responsibilities?
Have you tried working since you became disabled?
Where else have you worked in the last 15 years and what were your job responsibilities?
What is your diagnosis?
What treatments have you tried?
Do your treatments have any side effects?
How does your disability impact your daily activities?
How does your disability impact your ability to take care of yourself?
How long can you sit, stand, or walk without needing a break?
How much can you lift?
How often do you need to take breaks?
Do you have any issues getting along with supervisors, co-workers, clients, or customers?
Do you have any difficulties concentrating or remembering things?
Not every question will be asked at your hearing, but it is important to be prepared and to know how to answer the questions that pertain to your disability before you walk into the hearing room.

Work With a Lawyer Who Will Thoroughly Prepare You for Your Hearing
Our board certified Social Security disability lawyers will not let you go to your hearing unprepared. We will use our experience to anticipate what the administrative law judge wants to know and to help you anticipate the questions that will be asked of you so that you can prepare your answers.

To learn more about how to prepare for a Social Security disability hearing, please contact us at any time via this website or phone.

    `
},

{
    TITLE: "Three Tips For Getting Your Social Security Disability Application Approved If You Suffer From Hemophilia",
    LINK: "https://www.morganweisbrod.com/blogs/how-to-prepare-an-ssdi-application-if-you-have-hemophilia/",

    CONTENT: `
    Not everyone who suffers from hemophilia is going to qualify for Social Security disability benefits. In order to get the benefits you deserve, you are going to have to submit a convincing application to the Social Security Administration that proves you qualify for such benefits.

How to Submit a Strong Application
Social Security disability applications must be filled out honestly and convincingly. If there is any doubt about the severity of your medical condition or about any aspect of your application, your request for disability benefits will be denied. You can help prevent this from happening to you by:

Making sure you are organized and prepared before you submit an application. You want to have all of the information you need to fill out your application ready before you begin filling it out. This includes, but is not limited to, information about your work history, prior hospitalizations, and how your hemophilia is impacting your activities of daily living.
Submitting the right medical evidence. People with mild hemophilia are not going to qualify for benefits. Accordingly, medical tests, observations, and treatments are going to be considered as part of your disability application. While evidence from any doctor may be considered, documentation from your hematologist may be especially convincing.
Working with an experienced Social Security disability lawyer. There are many details that, together, make a convincing Social Security disability application. A board certified lawyer can make sure that all of the relevant details are included in your application and that all of your rights are protected as you apply for these important benefits.
These three steps may seem simple, but they can mean the difference between having a disability application approved and having to appeal a denied application. Accordingly, we encourage you to follow these three tips and to learn more about your rights before you submit your application. You can get started right now, for free, by downloading a complimentary copy of our book, Social Security Disability: What You Need to Know.


    `,
},

{
    TITLE: "The Importance Of Your Doctor’s Opinion To Your Social Security Disability Claim",
    LINK: "https://www.morganweisbrod.com/blogs/disability-lawyer-blog-your-doctors-opinion-counts-texas-disability-blog/",

    CONTENT: `
    Why Your Doctor’s Opinion Counts & How to Obtain It

In a claim for Social Security disability benefits, it may seem like the Social Security Administration is getting the opinion of every doctor but your own.  Social Security will often obtain the opinions of their own consultative doctors, who only examine you once. They may also ask doctors who have never examined you to describe your work-related limitations based only on the paper medical records in your file.

So, where does YOUR doctor’s opinion fit into all of this? Does Social Security even have to consider what your own doctor says?

The answer is yes! Social Security’s own regulations and rulings provide that if your treating doctor offers an opinion about what you can and cannot do in the workplace, the person deciding your case must consider what your doctor says.  In fact, Social Security’s rules state that usually, your doctor’s opinion should be given greater weight than the opinion of a doctor who has not treated you.  Also, the longer that doctor has treated you, the more weight it will generally be given.  This means your doctor’s opinion about your limitations can make a big impact on your case.

What is the best way to get your doctor’s opinion? At Morgan & Weisbrod, we will usually create customized forms, called Interrogatories or Medical Source Statements, for your doctor to complete. These forms are basically questionnaires aimed at getting the most essential information about your limitations from your doctor.  For example, if you have severe back pain, we might ask your doctor how long you can stand, walk and sit, and whether it’s medically necessary for you to lie down several hours a day to alleviate pain.  Or, for instance, if you struggle with mental impairments like depression or anxiety, we will ask your psychiatrist or psychologist how often  you experience difficulty concentrating, whether you can follow complex versus simple instructions, and whether you can be expected to interact appropriately with co-workers, supervisors, and the public. Usually, we will mail these forms to you and ask that you take them to your doctor to be completed.

Often, the challenging part is ensuring that your doctor completes the forms.  We cannot force your doctor to do this. Sometimes, treating doctors are hesitant to complete forms for various reasons. However, there are some points you can make to your doctor if he or she is reluctant to help. If you encounter this problem, keep the following talking points in mind:

     *Explain that your doctor’s opinion can make a big difference in your Social Security disability case. It might even make the difference between winning and losing your claim.
     *If your doctor tells you that your lawyer already has his/her treatment notes and that should be enough information, politely disagree. Explain that their treatment notes do not necessarily discuss all of the functional limitations addressed in the forms. For example, do their notes indicate how much weight you can lift or how long you can sit, stand, or walk? Often, they do not address those details.
     *If your doctor says you need to see a “disability doctor” or have a functional capacity evaluation (“FCE”) performed, tell them that under Social Security’s rules, this is not required. In fact, it’s much more helpful to get your doctor’s opinion, based on multiple office visits, than to go to a doctor who will only evaluate you once.*Explain that your doctor need not perform any additional examinations; his or her answers can be based on his or her knowledge of your conditions and treatment history.*Tell your doctor that if you win your disability case, you will start receiving either Medicaid or Medicare. Many doctors are unaware of this fact. However, once they learn this, they sometimes see the “big picture” and realize that winning this claim is not just about the monthly dollar benefits, but also about obtaining regular (and often better) medical attention through the Medicaid or Medicare program.If your doctor agrees that you cannot work, the best thing he/she can do to help you win your case is answer a few simple questions about your limitations. Making this small effort will help the judge understand exactly how your conditions keep you from working.

    `,
},

{   
    TITLE: "Five Things You Need To Know Before Seeking Social Security Disability Benefits For A Bullous Disease",
    LINK: `https://www.morganweisbrod.com/blogs/social-security-disability-eligibility-for-bullous-diseases/`,
    CONTENT: `
    You are suffering. Your medical condition may have affected your range of motion or fluid filled blisters may have developed on the palms of your hands, the soles of your feet, or your perineum/groin area and even the simplest of tasks may be difficult. Social Security disability may be an option for you if you are unable to work, but before you apply there are some things that you should know.

    Be Prepared Before You Apply for Social Security Disability Benefits
    Before you submit an application, it is important to know that:
    
    1. There Are Multiple Conditions That Are Considered Bullous Diseases
    According to the Merck Manual bullous diseases include, but are not limited to:
    
    Bullous pemphigoid
    Dermatitis herpetiformis
    Epidermolysis bullosa acquisita
    Linear Immunoglobulin A disease
    Mucous membrane pemphigoid
    Pemphigus foliaceus
    Pemphigus vulgaris
    These conditions all have one thing in common: they result in raised and fluid-filled blisters that are greater than or equal to 10 mm in diameter. These blisters are known as bullae.
    
    2. Bullous Diseases Are Included in the Social Security Administration’s Listing of Impairments
    If you have a bullous disease and you meet the requirements in Section 8.03 in the Listing of Impairments, you will qualify for Social Security disability benefits. In order to qualify pursuant to this listing, you need a diagnosis and you must have extensive skin lesions that persist for at least three months despite your compliance with a prescribed treatment plan.
    
    3. You Need Certain Evidence to Submit With Your Application
    It is important to provide the Social Security Administration with information about your condition. This includes, but may not be limited to:
    
    A description of your lesions. This should include their sizes, locations, and information about how long you’ve had them.
    Impact of your lesions. The Social Security Administration will want to know how your lesions impact your activities of daily living and your ability to work.
    Medical test findings that confirm your diagnosis. This could include, for example, biopsy results.
    The idea is to provide honest and accurate information about your medical condition to the Social Security Administration for its consideration.
    
    4. Your Treatment Is Important
    Unless you have a good reason for foregoing medical treatment, you cannot receive Social Security disability benefits until you demonstrate that you have complied with your doctor’s treatment plan. Treatments for bullous diseases may include different medications such as anti-inflammatories, corticosteroids, or medications to suppress the immune system.
    
    5. A Social Security Disability Lawyer Can Help You
    Applying for Social Security disability benefits can be tricky. If any part of your application is incomplete or unclear, your application can be denied. An experienced Social Security disability lawyer can help prevent this from happening to you. Please contact us today via this website or by phone to schedule an initial consultation with one of our board certified lawyers so that we can talk about getting you the benefits you deserve.
        
        `
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
