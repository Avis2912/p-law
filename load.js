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

const newUser = async (docName, firmInfo, smallBlog, bigBlog, chatInfo, competition) => {
    try {
        const userDocRef = doc(`firms/${docName}`);
        await userDocRef.set({

            FIRM_INFO: firmInfo,
            KEYWORDS: keywords,

            BLOG_DATA: {
                SMALL_BLOG: smallBlog,
                BIG_BLOG: bigBlog,
            },

            CHAT_INFO: chatInfo,

            LEADS: [{
                NAME: "Simon Paschal",
                EMAIL: "johnsample@gmail.com",
                NUMBER: "542-123-4568",
                SUMMARY: "Was in a car accident and needs help.",
                DATE_TIME: "04/04/24 | 12:54 PM",
                CONVERSATION: [
                    {role: 'assistant', content: `Hello, welcome to ${docName}! How can I help you today?`},
                    {role: 'user', content: `Hey! Can you guys help me with EB1 Wait Time Expedition?`},
                ]}, { 
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
            // LEADS: sampleLeads,
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
        SETTINGS: {
            MODEL: 2,
            PLAN: "Trial Plan",
            IMAGES: "All",
        }
    });
        });
        console.log("All firms have been updated successfully.");
    } catch (error) {
        console.error("Error updating: ", error);
    }
};

// uploadSome();
updateLeads();

let newUserMoment = false;

if (newUserMoment) {
newUser(docName = 'STR Law Guys',

firmInfo = {
    CONTACT_US: "https://www.strlawguys.com/contact-us/",
    NAME: "STR Law Guys",
    LOCATION: "Mansfield, TX",
    DESCRIPTION: 
    `STR LAW GUYS is a legal services provider that specializes in asset protection strategies for short-term rental investors.
     They offer customized asset protection plans to help investors protect their short-term rental properties and overall net worth.
     The company aims to provide clarity, peace of mind, and effective legal protection for short-term rental investors through their tailored asset protection solutions.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(30).png?alt=media&token=7fb86b8f-7aa6-4364-9151-4974e7c4805d
    `,
    MODEL: 2,
    PLAN: "Full Suite",
},

keywords = [
    {keyword: "Asset Protection", data: [4200, 5500, 1300, 6500]},
    {keyword: "Short-Term Rentals", data: [4200, 5500, 1300, 6500]},
    {keyword: "Real Estate Investment", data: [4200, 5500, 1300, 6500]},
    {keyword: "Legal Services", data: [4200, 5500, 1300, 6500]},
    {keyword: "Financial Planning", data: [4200, 5500, 1300, 6500]},
    {keyword: "Tax Services", data: [4200, 5500, 1300, 6500]},
    {keyword: "Insurance", data: [4200, 5500, 1300, 6500]},
    {keyword: "Retirement Planning", data: [4200, 5500, 1300, 6500]},
    {keyword: "Estate Planning", data: [4200, 5500, 1300, 6500]},
    {keyword: "Wealth Management", data: [4200, 5500, 1300, 6500]},
    {keyword: "Investment Advice", data: [4200, 5500, 1300, 6500]},
    {keyword: "Business Consulting", data: [4200, 5500, 1300, 6500]},
],

smallBlog = [0, 1],

bigBlog = [
{
    TITLE: "How to Shield Retirement Accounts from Lawsuits",
    LINK: `https://www.strlawguys.com/how-to-shield-retirement-accounts-from-lawsuits/`,
    CONTENT: `
    Can A Lawyer Take My IRA In A Lawsuit?

    You have been served! A process server showed up at your front door and handed you lawsuit papers and now you have to show up to court. Is it possible that they can take your retirement accounts? All of that hard-earned money that you have spent time working for an employer on at your W-2 job. Can they take that away from you or maybe you have an IRA or a 401k? Are there any such thing as exempt assets in a lawsuit or bankruptcy? In short, yes there are, and we are going to cover those exactly today as the subject of this YouTube video.

    By the way, if you wait around until the end of this video, I will also give you a free eBook: Five strategies to protect your short-term rentals and give you peace of mind.

    Let us jump into this. Number one, we are going to take a look at the differences between a 401k protection and an IRAs protection under both federal and state law. Let us say you have a 401k. Most 401K plans in the United States are protected under the Employee Retirement Income Securities Act (ERISA). Essentially, this federal law states that it provides substantial protection for all 401K assets in the event that a creditor comes after you or even if you have to file for bankruptcy. So, ERISA generally shields all 401K assets regardless of their value so you have unlimited protection with no cap on the amount of money that you can shield from a lawsuit or from a creditor. I am going to give you an example of that here in just a minute. So complete and total protection under a 401k. Let us talk about IRAs for a minute.


    IRA Protections Under Federal And State Laws

    We are going to talk and break it down into two parts: you can talk about the federal side of this for protection and then we are going to talk for a few moments as it relates to state level protection. So, what about IRAs? IRAs are protected under federal bankruptcy laws for the most part. Essentially, the Federal Protection for IRAs and bankruptcy is adjusted every year. It is usually increased for inflation. Right now, we are close to around the 1.4 million mark for IRA accounts. That means you are shielded by the federal government in the event of bankruptcy of about 1.4 million dollars in an IRA account.

    What about state level variations? The level of protection for an IRA in each state can vary dramatically. Let me go over a few of the differences. In some states where you receive the highest protection you can have a fully exempt IRA from bankruptcy proceedings. For instance, states like Texas, Florida and Nevada provide you complete and total protection in those States and so you know that even if you have an IRA, maybe you have a SEP IRA account or maybe you have a Roth IRA, those are going to be exempt from collection from a creditor or in a lawsuit. If you have an IRA and you have those state level protections on the other hand you have to be very careful.

    You have some states that have no specific provisions for IRAs, and, in fact, you can end up being somewhat vulnerable. States like California, New York and Georgia have less protection for you to know that in the event something happens that you are not going to have to worry about that for your IRA. Now we know the protection from a lawsuit for retirement accounts generally we have covered that now for a 401k and an IRA.

    Self-Directed IRA’s For Real Estate Investments?

    But what if you decide to open up a self-directed IRA and now you want to dip that money into a real estate investment? Does IRA money become vulnerable the moment that you choose to invest in real estate? Well, let me just tell you right now, the simple answer to that is yes, it does. It becomes extremely vulnerable, and I want to dip back down to where we were moments ago. Anytime you start talking about possible asset protection threats to an IRA, we have to look at it from two perspectives.

    Number one, we are going to talk about preventing creditors of the IRA owner from collecting against the IRA to satisfy the judgment. Let us talk about this for a second. Here is where an IRA provides an enormous amount of protection. We covered this a little bit already, but I want to go back to this for a minute. Let us say an individual defaults on a personal loan and gets a judgment against them. Something comes up, you just cannot pay it, you default on the loan completely. The creditor may collect from all over the place, from your personal bank accounts, from your brokerage accounts, from literally wages and all other non-exempt assets, but they cannot collect from the individual’s IRA accounts or their 401K accounts or retirement plans even in the case of a bankruptcy.

    This is really important, even in the case of a bankruptcy, a retirement plan is still considered an exempt asset. What I mean by that is that this makes retirement accounts an extremely valuable vehicle to protect your assets. However, understand that is if a judgment is brought against you personally.

    But now let us cover the second issue. What if you have a situation where an IRA can also be protected from claims arising out of investments and activities within the IRA? The most common example of this is when someone chooses to open a self-directed IRA to invest in a short-term rental or invest in a long-term rental or multi-family, some type of real estate investment. Here is the problem, self-directed IRA accounts can create liabilities for the IRA and maybe liabilities for the IRA owner as well.

    One example: let us say you have a self-directed IRA, and you own a rental property, and the tenant slips and falls or there is some type of swimming pool accident or something serious happens there. The tenant can then sue the self-directed IRA, consequently those IRA assets, including the property and other assets within that IRA account, can be collected potentially by the creditor. Now, what about the IRA owner’s personal assets, though? Can they collect those? Here is where you have to really be aware of this. So, we know here’s the general rule, if you take an IRA and you begin to invest in short-term rentals, if you don’t have asset protection, not only can they get access to the actual property and any of the value there, but they can actually get into the IRA itself in order to exercise and satisfy that judgment.

    Now, the question though is, can they also get to your personal assets outside of the IRA because you are the one who put the IRA together? That is one of the questions that comes up here. Let us say the plaintiff against the IRA decides they are going to sue the IRA, but also going to also sue the actual individual that set up the IRA personally because there is more damages here than they have in their retirement account to satisfy that judgment.

    Let me give you some insight here. Under Internal Revenue Code section 408, the Internal Revenue Service basically and the government code essentially says that an IRA is merely a trust that is created when an individual establishes an IRA by signing IRS Form 5305 with a bank or a qualified custodian. Now, courts have analyzed IRAs as trusts or special deposits held by individuals for their benefit. In other words, listen, the IRA is very much treated similarly to a revocable living trust. Why does that matter? Well, because as we have talked about before on other videos, a revocable living trust by itself provides no asset protection.

    If you set up an IRA account, you dip it down into investing in short-term rentals or other types of rental real estate, and then you get sued, not only can they sue into the IRA, but if there’s more damages than what your retirement account has, they can actually now sue into your individual assets and your bank accounts and anything else that you own in order to satisfy that judgment. Extremely important to understand that. So, you can face similar risks in the event of a lawsuit because now you have taken an exempt asset, which normally an IRA account would be an exempt asset, you have moved it into a high-risk asset for which you can be personally liable.

    What we recommend at STR Law Guys is that anytime you are going to open up a self-directed IRA, it is really important to explore the option of taking that IRA and encapsulating it in the ownership of an LLC. Now, what happens is you are taking it out of your personal name, you are separating your possible obligation of them being able to sue through the IRA and into your assets, and you are now putting it into an LLC where you separate your ownership from the control of that asset. Very important.

    An LLC prevents creditors of that LLC from pursuing the LLC owner, which would be the IRA itself, which would then also mean it would help prevent them from pursuing you individually. What do we look at here? Instead of the IRA directly owning a rental property – because this is how most people set it up – they will just take a self-directed IRA, and the IRA owns the rental property. We do not want to do that.

    Now, what we would rather do is we have it owned by the LLC. The IRA purchases it, but that IRA is actually held within that LLC, and now the LLC is the one that does all the leasing out to the tenant, whether it’s the short-term rental lease, whether it’s a long-term rental, you name it, whatever it is, whatever high-risk rental activity that’s going on, it’s all going to be done now through the name of the LLC that now provides you individual protection and it also protects your IRA from a potential lawsuit. Really important that you do this so that you protect your retirement accounts when you choose to put them in real estate.

    To take it further, one of the things that we would recommend at STR Law Guys is to also consider taking that self-directed IRA, and yes, you want it to be owned in an LLC, you place that within an LLC, but now you can actually have that LLC as a single-member owned by a holding company, whether it’s a Wyoming LLC or an Arizona Limited Partnership holding company.

    By using a holding company strategy, you gain two more benefits. Number one, you establish privacy. It is going to be difficult for any potential creditor or plaintiff to be able to see who actually owns that retirement account because now you are private based upon the privacy laws that exist in Wyoming and Arizona. But secondly, you get something even more important, which is known as charging order protection. Charging order protection essentially allows you that even if you get sued and you lose the lawsuit, that creditor or plaintiff cannot make you sell that property in order to pay and satisfy that judgment. In other words, you can keep renting out the property, you can keep paying your mortgage, you can even potentially pay yourself a management fee for what you do on it cannot take a distribution, but there is so much flexibility that you have.

    Why does this matter? Look, having been a previous plaintiff’s attorney who is brought these types of lawsuits, it is important to understand how this works. Essentially, you are disincentivizing that attorney from wanting to sue through to the LLC. You are creating an incentive now for them to go down to that insurance to seek an insurance settlement because they know even if they win, they kind of sort of lose. They cannot make you sell the property in order to satisfy that judgment. So, these are just a few of the examples here, and my point is to learn more about this strategy, check out this video where I discuss how to persuade a lawyer not to sue your rental property.
    `,
},
{
    TITLE: "Don’t Make Critical Mistakes With Short-Term Rental LLCs: Learn the RIGHT Way to Protect Your Properties!",
    LINK: `https://www.strlawguys.com/dont-make-critical-mistakes-with-short-term-rental-llcs-learn-the-right-way-to-protect-your-properties/`,
    CONTENT: `
Don’t Make Critical Mistakes With Short-Term Rental LLCs: Learn the RIGHT Way to Protect Your Properties!

Are you making critical mistakes with short-term rental LLCs? Let’s learn how to protect your properties right now.

Hi, I’m Jeff Hampton with Str law guys. Welcome to our YouTube channel. Today, I’m going to talk to you a little bit about LLCs, real estate LLC’s specifically for short-term rentals. Are you using them the right way? Are they actually protecting you? By the way, if you wait around till the end of this video, I’ll also provide you with a free eBook: “Five Strategies to Protect Your Short-Term Rentals and Give You Peace of Mind.”


Okay, so Point number one, we have to even ask the question, why do we need an LLC anyway? Some people don’t think they need an LLC; they think they have insurance. I think they have plenty of protection. Well, let’s just talk about this. I’m a big believer in layered asset protection Strategies, but before we discuss why an LLC is important to protect your real estate, let’s first examine a layer that you really need. And I’m a big believer in layered asset protection. This is a layer you absolutely need when you’re looking to invest in a short-term rental. And that layer is, you need to make sure you have good, whether it’s long-term rental or short-term rental, you need to have good insurance. And it’s critical when you look at this, when you’re talking about a short-term rental. And I have a different video series covering specifically short-term rental insurance. Okay, but this is really critical. You need to make sure you have good commercial insurance coverage for your short-term rental because if you don’t, a lot of times people come to me with second home policies. They tell me, “Hey, look, this should cover it. I’m not seeing any concerns.” Well, you know your Insurance, your insurance is actually what, 70-80 pages long if you actually look at what you have. And if you go through the entire insurance policy, you’re going to find, and most of the time, there’s a section, always a section at the very bottom that talks about exclusions. And in that exclusion section, it’s really important to make sure that you don’t have a second home renters’ policy or a second home residential policy because the reason why that is, you have to understand, short-term rentals are not only inherently high-risk activities, but they are always labeled commercial activity.

So, look in your residential policy or your commercial policy, whichever that’s labeled, go in there and look at the very bottom and look at the exclusion section. Do you see something called commercial exclusions? Do you see something called business activity exclusions? If you see anything specific along those lines, I can promise you right now, every single time, an insurance company is going to be labeling a short-term rental as commercial or business activity. If it’s in there, you’re excluded.

Also, be careful. Very often, they’ll only give you $250,000-$300,000 worth of insurance protection. You need to try, as far as premises liability goes, you need to have at least a million dollars coverage, generally speaking. And you need to make sure you have enough dwelling coverage to replace the entire property in case of fire or some sort of loss. So, it’s a really in-depth analysis you need to do to make sure you have good insurance because that is layer number one anytime, you’re talking about protecting your short-term rental.

Now, why do we need an LLC? Let’s get into that.

Back to what we were talking about originally when you look at an LLC, it’s really important. I’m going to give you a true story. Somebody who essentially, somebody that came to us and decided, “Look, I don’t really think I need any sort of short-term rental protection. I don’t need an LLC at all.” Well, they end up getting into a pretty serious situation at their short-term rental. And as a result of someone being injured there, they get sued.

Well, after their suit, it appeared, here’s the problem. They had multiple short-term rentals. They look like a big target, right? Why were they a big target? Because they had multiple short-term rentals. They were all in their personal name. Personal injury attorneys start doing pretty serious research as to what type of assets this person has, what’s their net worth look like. And now they look like a pretty juicy target for a personal injury attorney coming at them for a premises liability lawsuit.

So, this is really important. Your goal is to not be an easy target. Truly, your goal is to own nothing but control everything, which is really the entire clarion call for all asset protection. That’s really what you’re trying to go after anytime you’re trying to set up asset protection. Now, you can structure your assets in a manner where the attorney will have a very difficult time finding it or it’ll be completely in total pro, totally private so that you become a much smaller target in the event of a lawsuit.

Okay, now let us talk about this. The first thing I want to talk about is base layer LLCs. And what do I mean by that? Well, LLCs as a general rule, when you are putting property, particularly real estate in them, they are much better to use than setting up a corporation as an entity.

Corporations create a higher tax burden as a general rule. If you move around assets in a corporation, that is often labeled a taxable event by the IRS. You end up having to pay way more taxes than is necessary. So, LLCs provide much more flexibility. Many times, you can move those assets around, you can take distributions, and really you don’t end up talking about multiple taxable events.

Now, LLCs provide, generally speaking, what is the purpose? It is a limited liability company. They help you provide a separation from a business asset and a personal asset. You want to keep business assets separate from personal assets so that in the event of a lawsuit, you do not want a business lawsuit coming up taking your personal assets.
    `
},

{
    TITLE: "What Grant Cardone Gets Wrong About Airbnb",
    LINK: "https://www.strlawguys.com/what-grant-cardone-gets-wrong-about-airbnb/",

    CONTENT: `
    What?! No, man? Come on, Grant? Grant Cardone has made untold millions investing in multifamily real estate investing, but when it comes to Airbnb investing, he has it dead wrong. Grant believes it’s more profitable to be in long-term multifamily investing, not so fast. Short term rentals take up too much time, according to Grant. He’s afraid of regulations shutting him down. My clients and I make massive cash flow investing in short term rentals without doing it full time. Here are four of Grants beliefs that you need to ignore to get our kind of results.

    #1: Multifamily is more profitable. 
    
    Potential Investor (to Grant):  What do you think about Airbnb?
    
    Grant:  Airbnb? I like it. I mean, I like Airbnb. I just don’t like it as a long-term plan. I want a longer renter?
    
    Although Grant is right that there will always be demand for long term rentals, the growth rate for rentals has declined for the first time in years. The margins of long term rentals are already tight and now they’re getting squeezed even more by the increase in apartment supply. I feel like I see a new apartment building going up every week. However, generally speaking, if you have a top 10% airbnb property you have an enormous advantage over a long term rental. If your investment property has the amenities that guests want and you can master the marketing of your short term rental, you can make anywhere from three to four times the cash flow of any long term or multifamily investment.  Notice the caveats that I gave you. You have to buy right, you have to build right, and you have to manage right in order to have a top Airbnb property. Do not just go buy some property in Orlando, FL near Disney World and expect to make a fortune. You need to intimately know your market. What are the top amenities required in order to be a top 10% property? In other words, do you need a pool? Do you need a hot tub? Do you need bunk beds? Do you need pool tables? What specifically do you need?  By the way, how close are you to the traffic drivers in that mark? If people are coming to Orlando, they’re coming there because they want to go to Disney World, and I would much rather pay more to be two miles from Disney World than to be 20 miles away. You don’t have to spend three to four times more in order to achieve the three to four times cash flow, but you do have to be willing to investigate and invest in being a top property.
    
    
    Point #2 You have to take too many calls and deal with too many people.
    
    If you set things up right, you almost never have to deal with phone calls. I own short term rentals and almost all of my communication is done through technology. For example, all the day-to-day messaging that’s needed in order for a guest to check in, check out, be aware of the house rules, and other communication can be done through software like Owner Rez, Hospitable, or Guesty. What if a guest is being rowdy and being too loud in the property? You can use technology like “Noise Aware” so that you’re aware of anything taking place within the property that could cause a concern. How do you know if the guest is bringing the right number of people? What if they are having a party? That’s when you use technology like “Ring” doorbells and other types of technology in order to maintain, and know if the people that are showing up are the same people who rented.
    
    Finally, how do you know if there’s something major that happens? Let’s say that some sort of appliance breaks down, or there’s some issue that needs to be dealt with directly. That’s when you establish a relationship with a local “boots on the ground” person who is available and you pay them a portion of the stay in order for them to be able to go out there and take care of the problem. I found a team of rockstar cleaners that take care of the property before and after every stay.  I have an onsite person who lives nearby and acts as the “boots on the ground” to make sure and takes care of any issues that need one-on-one attention. I know this is starting to sound expensive, but when you buy right and you manage it right, these costs are very manageable. This leads to more five star reviews and being able to raise those rates.  If you don’t want to leave money on the table, use “Price Labs” or “Wheelhouse” this is a type of software that allows you to mimic a hotel. You can literally determine what the supply and demand is for your neighborhood. You can squeeze every bit of the dollar available, for the person looking to come stay, where your property is located. Plus come on man, Grant doesn’t go answer phone calls for his long term rentals. He hires people to take care of that stuff and you can do the same thing with all that extra cash flow with your short term rentals. At the end of the day you can always find a Co-host, or a property management company, that can take it from start to finish if you don’t want to be involved at all.

    Point #3 Cities will shut you down

    [etc...]
    `,
},

// {
//     TITLE: "FMLA Lawyer: Navigating Family and Medical Leave Act with Ease",
//     LINK: "https://www.simonpaschal.com/2024/03/15/fmla-lawyer/",

//     CONTENT: `
//     Are you struggling to make sense of the complexities surrounding the Family and Medical Leave Act (FMLA)? 

//     If so, you are not alone. Navigating the FMLA can be a daunting task for both employees and employers. Depending on the location, size and type of business there are a lot of things to consider. 

//     While at the end of the day it’s always best to get guidance from an employment lawyer to help you navigate this area of law with ease, here are some basic information to help you along the way.  

//     What is the Family and Medical Leave Act?
//     The Family and Medical Leave Act is a federal law designed to provide eligible employees with job-protected unpaid leave for certain family and medical reasons. This law seeks to maintain a balance between the demands of the workplace and the needs of employees and their families.

//     FMLA applies to private employers with 50 or more employees within 75 miles of the worksite, as well as certain public employers. 

//     This means that if you meet the eligibility criteria, you have the right to take unpaid leave for specific qualifying reasons without the fear of losing your job.

//     Eligibility and Coverage
//     To be eligible for FMLA, certain requirements must be met. These include working for a covered employer and meeting specific criteria regarding hours worked and length of employment.

//     FMLA covers various reasons for taking leave, such as the birth or adoption of a child, caring for a family member with a serious health condition, or if you have a serious health condition that prevents you from performing your job duties.

//     It’s important to note that there are unique provisions and exemptions that may apply to different situations. That’s why consulting an FMLA lawyer is crucial to understanding your specific circumstances.

//     FMLA Eligibility: Understanding Employee Benefits and Leave Options
//     Employees who qualify for FMLA are entitled to various benefits and leave options. Here are the eligibility criteria and the types of leave that employees can receive:

//     FMLA Leave Eligibility
//     12 Weeks of Leave: In a 12-month period, eligible employees can take up to 12 weeks of unpaid leave for the following reasons:
//     The birth of a child and caring for the newborn within one year of birth
//     The placement of a child for adoption or foster care
//     Caring for a spouse, child, or parent with a serious health condition
//     Having a serious health condition that prevents them from performing their job
//     Qualifying exigencies arising from the military service of the employee’s spouse, child, or parent
//     OR

//     26 Weeks of Leave: Eligible employees can take up to 26 weeks of unpaid leave during a 12-month period to care for a service member if they are the service member’s spouse, 
//     Employer Obligations
//     Under FMLA, employers have obligations to their employees. They are required to provide notice to employees of their FMLA rights and responsibilities. This includes informing employees of their eligibility for FMLA leave and providing them with the necessary forms and information.

//     Employers also have a responsibility to maintain accurate records of employee absences and other relevant information related to FMLA. This helps ensure compliance with the law and protects the rights of employees.

//     Contact Our Frisco Employment Law Attorneys Today
//     If you have any questions or concerns about FMLA or your company’s obligations under the law, the Frisco employment lawyers at Simon Paschal PLLC are here to help. 

//     To schedule a consultation with our office, call (972) 893-9340 or contact us here!    
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
        NAME: 'Sample Lawyers',
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
