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
                LINK_LIST: {
                    "How to get the compensation you deserve": "https://www.1800lionlaw.com/blog/how-to-get-the-compensation-you-deserve",
                    "What to do after a car accident": "https://www.1800lionlaw.com/blog/what-to-do-after-a-car-accident",
                    "How to protect your assets": "https://www.1800lionlaw.com/blog/how-to-protect-your-assets",
                },
                SMALL_BLOG: smallBlog,
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
newUser(docName = 'Resolute Tax',

firmInfo = {
    CONTACT_US: "https://resolutepts.com/#contact-us",
    NAME: "Resolute",
    LOCATION: "Dallas, TX",
    DESCRIPTION: "We help our customers save time and money by obtainin the lowest assessed value for your property. Your Appraisal District has to put a value to every property in its appraisal area. In order to do so, they use a method known as Mass Appraisal. The truth is that Appraisal districts do not have the personnel to comb through all of their valuations every year and check for over-appraisals so they gave that job to you. You are given the opportunity to hire a representative to look into your valuation and present your case to the Appraisal Review Board once a year. This is where we come in.",
    IMAGE: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(23).png?alt=media&token=f5415e43-561b-4fb0-be3c-8f33418d9d89',
    MODEL: 2,
    PLAN: "Full Suite",
},

smallBlog = [

    // BLOG 1

    `Property Taxes in Texas can often be between 2% and 3% of your property value every year - frustrating right? Here's a bit of information to help you weigh the pros and cons of the property tax system as well as some of the nuance. Hopefully with a little more information you will be able to understand how this system works, and maybe how to make it work a little better for you.

    Property taxes have been a big part of Texas’ state revenue for a very long time. They’re one of the things that makes Texas so great, because they encourage residents to do something with their land, not just sit on it. Do you ever look around in Houston, Dallas, or Austin and think, “Man, they are always building here” or “Man, these people are attractive”? While the latter is a mystery, the former is all thanks to a tax structure that keeps money in the pockets of Doers and out of the pockets of... Land-Sitters?
    
    The Property Tax system (to paraphrase Winston Churchill a bit) is the worst system in the world... except for all the others that have been tried. You should be proud of that system though, because it discourages Sitters from simply waiting years for land to appreciate. By learning a bit more about the intricacies of the tax system, you can better take advantage of its benefits and avoid some of its pitfalls.
    
    Defining Our Terms
    The first thing we need to define is taxing entities, sometimes called taxing jurisdictions. These public entities propose their tax levies on property owners, which the local government votes into place. The most typical entities are:
    
    ISD (Independent School District) tax
    hospital tax
    community college tax
    city tax
    county tax
    Usually in Texas you have five or six of these, or if you live in Harris County as many as 13. Each entity’s taxes make up a couple of percentage points that, when added up, equal your total property tax rate, typically around 2.5%. This is why you could have a $100,000 house that gets taxed around $2,500 a year.
    
    The next thing you need to know is the difference between market value and assessed value. Some of you may see “appraised value” on your value notice instead of “assessed value.” That’s simply a useless distinction the appraisal district makes on words that are essentially synonymous. You’ll notice that I use “assessed value,” not appraised value. It’s a better term, so I'm going to use it.
    
    “Appraised value” vs “assessed value” is a useless distinction the appraisal district makes on words that are essentially synonymous.
    
    Basically we have three words that could mean the same thing: market, appraised, assessed. Before I define these terms, let me explain their relationship. All three terms are used to define two things: (1) What your appraisal district thinks your property is worth and (2) the value they are allowed to tax you on. If you have a commercial property, you don’t have to worry about what the difference is as they are the same. Now that you know the relationship, here’s the breakdown of the terms I promised.
    
    Market Value – This always means what the appraisal district thinks you could sell your property for.
    Appraised Value – This sometimes means the above and sometimes means the below.
    Assessed Value – Finally a clear term! This is the amount you have to pay taxes on.
    One easy way to remember it: whichever number is higher than the other is the value the appraisal district thinks you can sell your property for (market value). Whichever number is lower is the amount you’re paying taxes on (assessed value). If they are the same, then you are not capped by an exemption and don’t even have to worry about it.
    
    Exemptions
    When it comes to exemptions, if the appraisal district will allow you to claim it, you should take advantage of it. For our purposes, we’ll just focus on two of the most popular types: homestead exemptions and over-65 exemptions .
    
    Homestead
    
    So you want to be a homesteader – it used to be so much cooler. Roll into Wyoming, build a fence, die of cholera – those were the days! Now it just means you’ve filed for a homestead exemption because you live in a house. But unlike commercial or rental properties, living in a home brings some great tax savings, like up to 20% off your ISD taxes or even a flat tax deduction. The rules around this change regularly in each district, and there is almost no normalization, so it’s not worth getting into too much detail. The key takeaway is that a homestead exemption will definitely reduce your tax burden.
    
    An additional benefit of a homestead exemption is that the appraisal district isn’t allowed to raise your taxable value more than 10% per year. So, in a given year, if your market value increases more than 10%, your assessed value gets capped at 10% higher than your assessed value was last year. Don't you wish you could cap all of your property tax increases? Me too, but unfortunately only one homestead exemption is allowed per person and it is supposed to be placed on your primary residence.
    
    Over 65
    If you can file an over-65 exemption, congratulations! First of all, you have more years of wisdom than the rest of us, and your ability to freeze your taxes means you’re probably making a killing in the bank. I envy you. By filing this exemption, your tax burdens will stay frozen in whichever taxing entities honor the over-65 exemption. Usually half of taxing entities will honor the freeze, the most important being your ISD tax. When you add up ISD taxes and your other freeze-honoring taxing entities, you’re looking at freezing about 2/3 of your taxes, which is great because taxes usually go one direction: up.
    
    There is so much more to learn about property tax, but hopefully you have a better grasp of the basics. The Texas tax system is a little wonky, I get it. Though sometimes it seems unfair, it does help drive our state’s economy and offers a statistically much lower tax burden than other states. Texas actually offers the 6th lowest tax burden in the nation according to the Tax Foundation. Before complaining about your property tax, call your cousin in California.`,

    // BLOG 2
    
    `The day has arrived! You look forward to it every year; ok, dread could be a better description for most. In your mailbox is your property’s new Notice of Appraised Value, lovingly constructed, sealed, and sent to you by your local appraisal district. Do you rip it up and throw it away in disgust, or stick it on your refrigerator as a reminder for later like a ‘20% Off Your Entire Purchase’ coupon at your favorite store? Hopefully what you read below will help you decide that. This article takes a deeper look at what the tax code says about the Notice of Appraised Value, how to get the most from them, and why receiving one shouldn’t ruin your whole summer.

    Texas Property Tax Code
    The rule book when it comes to anything property tax related in Texas is the Texas Property Tax Code. It outlines everything from appraisal methods used, record keeping requirements by appraisal districts, and tax liens for delinquent payers. It’s the Bible of Texas property taxes, and what it says must be followed.
    
    What does the Texas Property Tax Code say about a Notice of Appraised Value? I’m glad I asked. It mentions many things, but some things are WAY more important than others. First, it’s important to know under what circumstances you will receive a Notice of Appraised Value (Notice) from your local appraisal district. Tax code specifically says that an appraisal district is not required to send you an annual appraisal Notice unless: 1) Your new market value for the year is more than $1,000 higher than it was the preceding year -OR- 2) The property in question wasn’t on the appraisal roll, which is the county’s record system, in the previous year -OR- 3) There was a change in the exemption status from the previous year that results in more taxes (PTC 25.19a,e).
    
    You’d be surprised how many people don’t know the ‘$1,000 or greater’ rule and when they don’t receive a Notice they call us up in July and say “can I still file a protest?” The short answer 99.9% of the time is “no, it’s too late to file a protest”. I’ve seen this argument shut-down more times than I can count in a hearing to determine if a late protest should be allowed. Just because you weren’t made aware of your current year value and didn’t receive a Notice, due to one of the three previously listed reasons, doesn’t mean you have valid cause to file a late protest after the protest deadline (which is May 15th for most). In fact, I tell almost anyone who asks me about Notices to ignore the snail mail system and just check their value on the appraisal district’s website starting in early April. Often the county website will tell you everything you need to know including the deadline to file a protest. It may even offer you a digital copy of your Notice.
    
    So, what else does tax code say about Notices? Great question. Tax code says that there must be very specific pieces of information on all official Notices. I have to say official Notices because some counties will send unofficial postcards to property owners who are not required to receive an official Notice based on the criteria I mentioned previously. But unlike postcards, true Notices are required to show the following: your property identification, your taxing entities, the current and previous year’s appraised value and taxable value accounting for exemptions, an estimate of taxes based on that value and the latest know tax rates, and a glance of your value from 5 years ago along with the percentage change your property value has made since then. If you have an exemption that freezes taxes for a certain entity, that frozen amount should be indicated as well. The district is also required to break down land value versus improvement value, meaning any structure that has been built on the land itself.
    
    On top of all of that information that is super specific to your property, a Notice will include statements about local appraisal, tax rate creation, and rate adoption. They are required to let you know that property taxes are a local issue so that you don’t call the State to complain about your value or taxes. And they’re right, you won’t get anywhere calling the State about that stuff.
    
    This is all well and good information they are providing, but why shouldn’t I just rip up and throw away this statement? Hang with me, I haven’t mentioned the most important piece of information provided on Notices. All Notices are required to provide detailed instructions on how, by what means, and by when you may file a protest to dispute the current value which includes a Notice of Protest form with instructions on how to complete it and send it back to the appraisal district (PTC 25.19g, j).
    
    What does that mean for me? It means you can protest that value if you aren’t happy with it... regardless of previous years’ value or prior results. Collect sales data, property damage photos, repair bids, and other evidence to make your case (see also How to Protest Your Property Taxes). Property owners are sometimes treated more favorably than property tax agents at the appraisal district; use that to your advantage. Be polite but compelling. You may be surprised with the results of your protest.
    
    Hire The Pros
    Or don’t protest yourself and hire a pro to do it for you. You mean like Resolute Property Tax Solutions? EXACTLY! But at least exercise your right to dispute your property value. It’s just like voting. You can’t complain later about your property taxes if you didn’t do anything about them when you had the chance. Well you can, but it’d be insincere and annoying.
    
    At least 20 times a year I hear a prospective client say, “I don’t think I have a good case, why bother protesting?” The simple answer is doing nothing results in nothing 100% of the time when it comes to property taxes. You’ll really never know unless you try. And the beauty of our service, aside from time saved and professional service, is that we don’t charge you a dime if we’re unsuccessful in saving you money. That’s what you would call a No-Lose scenario.
    
    If you would like to have us protest your property taxes on your behalf, then Sign Up.`
],

bigBlog = [
    {
        TITLE: "Property Tax Myths",
        CONTENT: `Property taxes can be fun! Maybe “fun” isn’t the right word, but an understanding of them can certainly save you lots of money – and that’s fun. Most people really don’t know too much about property taxes until it’s too late. I get countless calls from people who are shocked by their tax bill. There are lots of myths and misunderstandings about property taxes that can hinder your decision-making as a homeowner or real estate investor.

        MYTH
        Property taxes can't increase more than 10%
        This is one of the biggest misunderstandings out there. People call me all the time concerned about their taxes doubling or tripling when they buy a new house. This is all too common, mostly because of what I’d consider a poor practice in the real estate industry, splitting up property taxes between the buyer and the seller based on the previous year’s taxes. I hear it time and time again: “Last year, when I bought the property, the realtor said the taxes were going to be 5k a year, now they’re 12k!”
        
        This could have been avoided if you had the right information to begin with. Those taxes were always going be 12k. The reason they were previously 5k is usually because you bought the property from someone with a massive exemption (like over-65, disability, etc.), but that exemption doesn’t transfer to you when the property changes hands. So, you’re stuck with the original 12k property tax.
        
        MYTH
        Property taxes can't increase more than 10%(continued!)
        Property taxes do in fact sometimes raise more than 10% in a year. Yes, there is a 10% cap on homesteaded properties and, yes, that will protect your taxable valuation from increasing more than 10% on your homesteaded property, but what if you just purchased the home? To meet the requirements for the homestead application, you have to have been in the property as of January 1st of that year (Texas Tax Code 11.42) and the exemption on file for the property must be in your name, not the previous owner's. That means that you’re not going to keep the valuation the owner before you had. Technically, the homestead cap will disappear before the new homestead exemption in your name is in effect.
        
        Yes, there is a 10% cap on homesteaded properties and, yes, that will protect your taxable valuation from increasing more than 10% on your homesteaded property, but what if you just purchased the home?
        
        For example, say the previous owner’s property was valued at 100k. You buy from him for 150k. Well, the county can’t raise the taxable value more than 10%, right? So you should be valued at 110k, right? Wrong. That cap is going bye-bye, and your value will most likely be raised to something more inline with your purchase price based on the appraisal district’s model and the other sales in your neighborhood. You might get lucky if the district’s not revaluing that area of the county that year. But if they are revaluing it, and the sales are in the 150k’s in that neighborhood, that’s most likely where your value is going to end up.
        
        MYTH
        I'm capped, so I can remodel and it won't affect my taxes
        This is an unusual scenario, but it comes up more than you’d think. Say you have a homesteaded property, and the taxable value gets raised 20%. What happened? “This can’t be right,” you say! Well, there really is only one situation that it would be right: your property was remodeled. (If this isn’t your situation, you should fight the district tooth and nail). The appraisal district will increase the contributory value (the market value of all new improvements to the property) of your property if it’s remodeled. The Texas Tax Code's calculation for this is stated in Section 23.23. It can be summarized as 10% of the preceding year's taxable value + the total taxable value from the preceding year + the market value of all new improvements to the property.
        
        Let’s say your property is valued at 250k, which is fair, but then you spend 50k on a remodel. You get your valuation notice the next year and your market value and assessed value are 300k. You think, “What the heck? It shouldn’t have gone up more than 10%. My assessed value should be 275k!” Not if you’ve remodeled. If the appraisal district finds out about your remodel, they’re going to guess how much it increased the value of your home. After adding that amount to your original value, then the 10% kicks in. If your value was 250k, they might increase it to 300k, and your new capped amount would be 325k, if your market value was raised to the point that it would necessitate a cap.
        
        MYTH
        The appraisal district isn’t supposed to appraise at full market value
        This is a popular misconception. I’m not sure how it got around, maybe because properties have been so frequently under-appraised in the past. It may also stem from the fact that other states often tax based on a 'mill rate' (sometimes called a millage rate) which means that an amount per $1000 is used to calculate taxes on property. Regardless, the district definitely can and is supposed to appraise at full market value. The reason under-appraisal is so common is because the appraisal district usually has to have enough sales in order to represent the market adequately in the neighborhood. In order to do this, the appraisal district needs to go outside of the typical 3-month standard that most fee appraisers and real estate agents use. Since fee appraisers and real estate agents want the most accurate and current calculation of value for transaction purposes, using sales that occurred within the past 3 months of said date makes sense. Most appraisal districts will use the past 12-24 months of sales in order to value your property. And let’s remember, that the valuation date is as of January 1st, and you get your notice of value from the district in May(Texas Tax Code 23.01). So the sales they’re using could be from 18-30 months before the time you get your appraisal. A lot can happen to your valuation in 18-30 months.
        
        MYTH
        Protesting my value hurts my resale
        Boy, do I hear this one a lot, and I can see why people think that. The county appraisal value is the only thing that many homeowners see to know what their property might be worth, so they think, “Why would I want to decrease how much my home is worth?” People wrongly think that when a potential buyer looks at your property, the first thing they do is check the tax rolls. I don’t think this is the case, and even if they did, the most they will see is a fluctuation of data, just like what’s all over the market. Properties valued at 300k can sell for 350k. Properties valued at 500k can sell for 425k. Properties rarely sell for exactly what their tax value is. This can also be easily explained away to a buyer by telling them the value is so low because you protest. It will make them want to protest too.
        
        People wrongly think that when a potential buyer looks at your property, the first thing they do is check the tax rolls.
        
        Also, when your realtor prices out and lists your property, if they’re worth the money, they won’t even consider the tax value. The tax value is good for one thing and one thing only: figuring out how much you have to pay the government. At the end of the day, property is worth what a willing seller and a willing buyer agree upon. An arbitrary number for taxation shouldn’t influence that.
        
        MYTH
        Protesting my value puts a target on me with the district
        Honestly, they don’t have time to worry about you. Sorry ‘bout it!
        
        MYTH
        I can only protest if my value increases from the previous year
        This is simply not true. You can only protest your valuation once a year, but you can definitely do it every year, regardless of what happened the previous year. And a lot of time, there really is reason to protest even if the valuation doesn’t go up.
        
        Think back to 2009. The market crumbled and a lot of people instantly lost 20 to 30% of the value of their property. In many counties they elected to roll over the values instead of reappraise. So while the county values didn't go up, there was definitely reason to protest because so many properties were way over-appraised after the crash.
        
        Also, let’s not forget that a market protest is not the only type of protest there is. There’s also an “unequal” protest, meaning you’re not being fairly valued compared to your neighbors. Imagine that you didn’t protest one year and your neighbor did. If your valuation stays the same next year, odds are that their value is still low and yours is still high. Again, the value didn't change but there is still a perfectly valid reason to protest.
        
        Okay, here comes the pitch, the reason we suggest property owners hire us in perpetuity: Imagine there’s a well in your backyard, and once a year there’s between $0 and $1,000 in it. Can you really tell me you wouldn’t check that well every year?
        
        In practice, it’s a bit more complicated... The "well" isn’t in your backyard, it’s way across town and it takes a lot of time and effort to get the money out. But there's a company you can hire and they’ll do all the work and then send you 60% of what they pull out of the well. If they don't find anything then they did all that work for nothing, but you aren't out a dime!
        
        If you haven’t caught on, the well is the pile of money you can save through protesting your taxes. You might as well protest every year – there’s no reason not to. You can either do it yourself or hire us.
        
        Hopefully you have a better understanding of what’s true and what’s a myth about property taxes. Our goal at Resolute is to strive to bring this industry to the forefront, to help you gain knowledge of how to make property ownership a bit easier.
        
        Knowledge is power, and in this case, the power to save a bunch of money. Fill out our Sign Up Form to have us protest your property taxes on your behalf.`,
        LINK: "https://resolutepts.com/property-tax-myths",
    },
    {
        TITLE: "The Basics of Property Tax",
        CONTENT: `Property Taxes in Texas can often be between 2% and 3% of your property value every year - frustrating right? Here's a bit of information to help you weigh the pros and cons of the property tax system as well as some of the nuance. Hopefully with a little more information you will be able to understand how this system works, and maybe how to make it work a little better for you.

        Property taxes have been a big part of Texas’ state revenue for a very long time. They’re one of the things that makes Texas so great, because they encourage residents to do something with their land, not just sit on it. Do you ever look around in Houston, Dallas, or Austin and think, “Man, they are always building here” or “Man, these people are attractive”? While the latter is a mystery, the former is all thanks to a tax structure that keeps money in the pockets of Doers and out of the pockets of... Land-Sitters?
        
        The Property Tax system (to paraphrase Winston Churchill a bit) is the worst system in the world... except for all the others that have been tried. You should be proud of that system though, because it discourages Sitters from simply waiting years for land to appreciate. By learning a bit more about the intricacies of the tax system, you can better take advantage of its benefits and avoid some of its pitfalls.
        
        Defining Our Terms
        The first thing we need to define is taxing entities, sometimes called taxing jurisdictions. These public entities propose their tax levies on property owners, which the local government votes into place. The most typical entities are:
        
        ISD (Independent School District) tax
        hospital tax
        community college tax
        city tax
        county tax
        Usually in Texas you have five or six of these, or if you live in Harris County as many as 13. Each entity’s taxes make up a couple of percentage points that, when added up, equal your total property tax rate, typically around 2.5%. This is why you could have a $100,000 house that gets taxed around $2,500 a year.
        
        The next thing you need to know is the difference between market value and assessed value. Some of you may see “appraised value” on your value notice instead of “assessed value.” That’s simply a useless distinction the appraisal district makes on words that are essentially synonymous. You’ll notice that I use “assessed value,” not appraised value. It’s a better term, so I'm going to use it.
        
        “Appraised value” vs “assessed value” is a useless distinction the appraisal district makes on words that are essentially synonymous.
        
        Basically we have three words that could mean the same thing: market, appraised, assessed. Before I define these terms, let me explain their relationship. All three terms are used to define two things: (1) What your appraisal district thinks your property is worth and (2) the value they are allowed to tax you on. If you have a commercial property, you don’t have to worry about what the difference is as they are the same. Now that you know the relationship, here’s the breakdown of the terms I promised.
        
        Market Value – This always means what the appraisal district thinks you could sell your property for.
        Appraised Value – This sometimes means the above and sometimes means the below.
        Assessed Value – Finally a clear term! This is the amount you have to pay taxes on.
        One easy way to remember it: whichever number is higher than the other is the value the appraisal district thinks you can sell your property for (market value). Whichever number is lower is the amount you’re paying taxes on (assessed value). If they are the same, then you are not capped by an exemption and don’t even have to worry about it.
        
        Exemptions
        When it comes to exemptions, if the appraisal district will allow you to claim it, you should take advantage of it. For our purposes, we’ll just focus on two of the most popular types: homestead exemptions and over-65 exemptions .
        
        Homestead
        
        So you want to be a homesteader – it used to be so much cooler. Roll into Wyoming, build a fence, die of cholera – those were the days! Now it just means you’ve filed for a homestead exemption because you live in a house. But unlike commercial or rental properties, living in a home brings some great tax savings, like up to 20% off your ISD taxes or even a flat tax deduction. The rules around this change regularly in each district, and there is almost no normalization, so it’s not worth getting into too much detail. The key takeaway is that a homestead exemption will definitely reduce your tax burden.
        
        An additional benefit of a homestead exemption is that the appraisal district isn’t allowed to raise your taxable value more than 10% per year. So, in a given year, if your market value increases more than 10%, your assessed value gets capped at 10% higher than your assessed value was last year. Don't you wish you could cap all of your property tax increases? Me too, but unfortunately only one homestead exemption is allowed per person and it is supposed to be placed on your primary residence.
        
        Over 65
        If you can file an over-65 exemption, congratulations! First of all, you have more years of wisdom than the rest of us, and your ability to freeze your taxes means you’re probably making a killing in the bank. I envy you. By filing this exemption, your tax burdens will stay frozen in whichever taxing entities honor the over-65 exemption. Usually half of taxing entities will honor the freeze, the most important being your ISD tax. When you add up ISD taxes and your other freeze-honoring taxing entities, you’re looking at freezing about 2/3 of your taxes, which is great because taxes usually go one direction: up.
        
        There is so much more to learn about property tax, but hopefully you have a better grasp of the basics. The Texas tax system is a little wonky, I get it. Though sometimes it seems unfair, it does help drive our state’s economy and offers a statistically much lower tax burden than other states. Texas actually offers the 6th lowest tax burden in the nation according to the Tax Foundation. Before complaining about your property tax, call your cousin in California.`,
        LINK: "https://resolutepts.com/the-basics-of-property-tax",
    },
    {
        TITLE: "Notice of Appraised Value",
        CONTENT: `The day has arrived! You look forward to it every year; ok, dread could be a better description for most. In your mailbox is your property’s new Notice of Appraised Value, lovingly constructed, sealed, and sent to you by your local appraisal district. Do you rip it up and throw it away in disgust, or stick it on your refrigerator as a reminder for later like a ‘20% Off Your Entire Purchase’ coupon at your favorite store? Hopefully what you read below will help you decide that. This article takes a deeper look at what the tax code says about the Notice of Appraised Value, how to get the most from them, and why receiving one shouldn’t ruin your whole summer.

        Texas Property Tax Code
        The rule book when it comes to anything property tax related in Texas is the Texas Property Tax Code. It outlines everything from appraisal methods used, record keeping requirements by appraisal districts, and tax liens for delinquent payers. It’s the Bible of Texas property taxes, and what it says must be followed.
        
        What does the Texas Property Tax Code say about a Notice of Appraised Value? I’m glad I asked. It mentions many things, but some things are WAY more important than others. First, it’s important to know under what circumstances you will receive a Notice of Appraised Value (Notice) from your local appraisal district. Tax code specifically says that an appraisal district is not required to send you an annual appraisal Notice unless: 1) Your new market value for the year is more than $1,000 higher than it was the preceding year -OR- 2) The property in question wasn’t on the appraisal roll, which is the county’s record system, in the previous year -OR- 3) There was a change in the exemption status from the previous year that results in more taxes (PTC 25.19a,e).
        
        You’d be surprised how many people don’t know the ‘$1,000 or greater’ rule and when they don’t receive a Notice they call us up in July and say “can I still file a protest?” The short answer 99.9% of the time is “no, it’s too late to file a protest”. I’ve seen this argument shut-down more times than I can count in a hearing to determine if a late protest should be allowed. Just because you weren’t made aware of your current year value and didn’t receive a Notice, due to one of the three previously listed reasons, doesn’t mean you have valid cause to file a late protest after the protest deadline (which is May 15th for most). In fact, I tell almost anyone who asks me about Notices to ignore the snail mail system and just check their value on the appraisal district’s website starting in early April. Often the county website will tell you everything you need to know including the deadline to file a protest. It may even offer you a digital copy of your Notice.
        
        So, what else does tax code say about Notices? Great question. Tax code says that there must be very specific pieces of information on all official Notices. I have to say official Notices because some counties will send unofficial postcards to property owners who are not required to receive an official Notice based on the criteria I mentioned previously. But unlike postcards, true Notices are required to show the following: your property identification, your taxing entities, the current and previous year’s appraised value and taxable value accounting for exemptions, an estimate of taxes based on that value and the latest know tax rates, and a glance of your value from 5 years ago along with the percentage change your property value has made since then. If you have an exemption that freezes taxes for a certain entity, that frozen amount should be indicated as well. The district is also required to break down land value versus improvement value, meaning any structure that has been built on the land itself.
        
        
        
        On top of all of that information that is super specific to your property, a Notice will include statements about local appraisal, tax rate creation, and rate adoption. They are required to let you know that property taxes are a local issue so that you don’t call the State to complain about your value or taxes. And they’re right, you won’t get anywhere calling the State about that stuff.
        
        
        
        This is all well and good information they are providing, but why shouldn’t I just rip up and throw away this statement? Hang with me, I haven’t mentioned the most important piece of information provided on Notices. All Notices are required to provide detailed instructions on how, by what means, and by when you may file a protest to dispute the current value which includes a Notice of Protest form with instructions on how to complete it and send it back to the appraisal district (PTC 25.19g, j).
        
        
        
        What does that mean for me? It means you can protest that value if you aren’t happy with it... regardless of previous years’ value or prior results. Collect sales data, property damage photos, repair bids, and other evidence to make your case (see also How to Protest Your Property Taxes). Property owners are sometimes treated more favorably than property tax agents at the appraisal district; use that to your advantage. Be polite but compelling. You may be surprised with the results of your protest.
        
        Hire The Pros
        Or don’t protest yourself and hire a pro to do it for you. You mean like Resolute Property Tax Solutions? EXACTLY! But at least exercise your right to dispute your property value. It’s just like voting. You can’t complain later about your property taxes if you didn’t do anything about them when you had the chance. Well you can, but it’d be insincere and annoying.
        
        At least 20 times a year I hear a prospective client say, “I don’t think I have a good case, why bother protesting?” The simple answer is doing nothing results in nothing 100% of the time when it comes to property taxes. You’ll really never know unless you try. And the beauty of our service, aside from time saved and professional service, is that we don’t charge you a dime if we’re unsuccessful in saving you money. That’s what you would call a No-Lose scenario.
        
        If you would like to have us protest your property taxes on your behalf, then Sign Up.`,
        LINK: "https://resolutepts.com/notice-of-appraised-value",
    },

    {TITLE: "How to Protest Your Property Taxes",
    CONTENT: `Every year presents an opportunity to fight back against The Man, who taxes you on what he thinks your property is worth. However, many who try to protest the property tax themselves experience a lot of frustration, as it can be quite complicated. With a better understanding of the process, hopefully it can be more tolerable and you’ll feel more confident jumping in.

    At its simplest, to protest your taxes means to challenge what the appraisal district says your property is worth, based on a number of factors. The more the district says your property is worth, the higher your property tax will be at the end of the year.
    
    Key Dates
    First let’s lay out the timeline for you, so you don’t miss any of the deadlines.
    
    April 15
    This is about the time that you’ll receive your appraisal notice, the valuation that your appraisal district believes your property is worth. This is what they intend to tax you on. The valuation is not set in stone, so it’s possible to protest and get the valuation changed. If you leave it alone, 99.99% of the time, this is the value that you’ll be taxed on.
    
    May 15
    This is the date by which you need to file your protest with the county – usually. Every county has its own appraisal district, and every appraisal district has its own way of doing things. Texas Tax Code simply states that the protest deadline is no later than May 15th or the 30th day after the date of notice (appraisal notice) to the property owner was delivered (Texas Tax Code 41.44). Though it varies a little bit from county to county, every appraisal district is required to accept protests through May 15. You might not actually meet with your appraisal district in a hearing until as late as June or July, but you have to file your intent to protest with the county by May 15. This can be done with a simple letter to your local appraisal review board stating that you wish to appeal your notified value for the current year because you think it is too high or unequally calculated compared to your neighbors' value.
    
    Heads up! This date used to be May 31st, but was changed in 2018 to May 15th, giving you 15 fewer days to file your protest.
    
    Between April 1 – July
    Your informal and formal hearings will likely be scheduled within this time frame, and at these hearings is where you’ll actually contest your valuation.
    
    January 1
    Confused yet? Good, it’s working. That's exactly what the Tax Man wants! January 1st is the date that your property’s valuation is based on. If you’ve ever used a realtor, you know that your property’s comparative market analysis (CMA) is based on one specific day. That’s because the value of a property can change from one day to the next. January 1st of the current year is the day that appraisal districts use to value your property. That means the question you and everyone at the appraisal district should be asking is, “What was the property worth on January 1st?”
    
    24 months, or the future!
    I know that isn’t a date and it sounds more like a novel by H.G. Wells, but I swear it’s relevant. You’re allowed to look back 24 months from January 1st to choose comps to support the value of your property. Now here’s the confusing part. Even though they say you can look back 24 months (Texas Tax Code 23.013), no one will really take that seriously unless you are valuing a commercial property. Why? Because in most residential markets there are more recent sales to choose from, so using a 2 year old sale isn't necessary. The appraisal district may consider your 24 month old sale, but there was a 15% increase in sales prices in your neighborhood between 24 and twelve months ago, don't count on high consideration. The district will most likely go back 12 months and (get ready for this) even look three months into the future in order to find comps — March of that very year.
    
    Here’s a breakdown to make it clearer. The time is June 5, 2022. Your valuation date is January 1, 2022. The furthest you can go back to find comps is January 1. 2021, and the furthest into the future you can go to find comps is March 31, 2022. Clear as mud? Good, grab a paddle and let's keep floating.
    
    Minor Dates
    October 15ish, January 31. You should receive your tax bill around October 15th, and January 31st of the following year is when your taxes are due. These dates are not going to matter in regard to your protest, but they are good to know for your understanding of the process.
    
    Another breakdown of the big picture: It’s January 15, 2023. Time to pay the tax bill that you received on October 15, 2022, the tax bill that’s based on the value that you achieved at your hearing on June 5, 2022. You had this hearing because you protested your value on May 15, 2022. You protested on May 15 because you were ticked off at the appraisal notice you received on April 15. Make sense?
    
    Timeline Over, Time for Action
    We’ve got another contender for an H.G. Wells novel title. Now that you have a grip on deadlines, it’s time to discuss getting the valuation you want (or as close as you can get to it).
    
    You've sent your protest letter saying you were displeased with your property valuation, now what? The district is required to send you back a confirmation of receipt, usually in the form of a hearing notice. A hearing notice simply states the dates and times of your next opportunity for action.
    
    Let’s get the boring stuff out of the way and define some more terms: informal hearing, formal hearing, arbitration/litigation.
    
    Informal Hearing
    This is your first opportunity to actually protest your property valuation, and to make nice with the appraisal district. While it’s not required for the appraisal district to give you an informal hearing, they usually do. Usually it's a specific date and time, but sometimes it's simply a date range to meet with a district representative. After arriving at your scheduled time, you meet with an appraiser at their desk. One of three things will happen: they will agree with your value, you will come to a compromise, or no agreement is reached and you have to go to a formal hearing.
    
    Formal Hearing
    Most of the time this will be scheduled a few days or weeks after your informal hearing. The formal hearing takes place in a room with you and (usually) four other people: three ARB (Appraisal Review Board) members, and one appraisal district appraiser. The ARB members are the ones who eventually decide your property’s valuation, and the appraiser is typically there to defend the district’s original valuation. During the hearing, an ARB member will ask you to provide evidence to back up your proposed valuation. Once you’ve finished, the appraiser will then be asked to provide his or her evidence. The ARB member will ask both you and the appraiser for your rebuttal, going back and forth until all parties are satisfied or ARB member cuts it off. It's good to remember that the taxpayer is always allowed the final word during the presentation and rebuttal period, at least according to tax code (Texas Tax Code 41.66b). Finally, the ARB members as a whole will deliberate and decide whose presentation of evidence they preferred and rule on a final valuation for your property.
    
    Arbitration/Litigation
    These are the avenues you can take if you’re not happy with the results at your formal hearing and are willing to spend lots of money to achieve the valuation you want. The vast majority of the time, protesting doesn’t result in arbitration/litigation. When it does however, it will likely require hiring either a lawyer or a property tax consultant.
    
    Valuing Your Property
    Finally, the moment you’ve been waiting for! It’s mid-June, you’re sitting across from your appraiser in your informal hearing. When he or she asks you what your opinion of value is, “Uhh, I dunno, lower” is not going to cut it. Not unless your appraiser is really cool and helps you look at your property and come up with a reasonable value. Believe it or not, this has happened before. But considering how uncommon it is, it’s better to be prepared to defend your desired valuation.
    
    The way most properties are valued by the appraisal district is pretty complex: you take into account building class, quality, year built, location, land value, and dozens of other factors. You can take this route to determine your valuation too. All you need is a data miner, a software designer, someone to reverse engineer the appraisal district’s valuation equation, and a neurologist to fix your brain damage after you bang your head against your desk. If you want a perfectly calculated valuation, that’s about what it requires.
    
    Because you’re probably not going to go that route, I recommend using the property’s PSF (price per square foot) to calculate valuation. The first step is to find comparable properties that sold in your neighborhood from the range mentioned earlier (from 12 months before January 1st of the current year, to three months after January 1st of the current year). Below is some information to find out about your sales comps to make sure you get an accurate valuation of your property.
    
    Neighborhood
    Look for comps within your neighborhood. When I say "neighborhood," what I really mean is "neighborhood code." Every house in the state is assigned a "neighborhood code" by its county, so while you may feel like a particular house is in your neighborhood, make sure the county has assigned it the same code as your house. Look for similar subdivisions that are within about two miles of your property and have similar properties in them. In other words, if you live in a nice house, don’t bring in a bunch of comps from the nearby trailer park.
    
    Year Built
    Try to choose comps that are built within seven years of your property. While there’s no set limit to seven years, the older the comp is than your property, the higher the appraisal district will adjust their valuation. So, the closer in time the properties were built, the more predictable the adjustment will be.
    
    Size
    It’s best to select comps that are within 15% of the size of your property – between 15% above and 15% below. This can be expanded based on what’s in your neighborhood, but you don’t want there to be too many comps that have significantly different square footage than your property.
    
    15% Smaller
    1,700 sq ft
    Square Footage of Your House
    2000
    15% Larger
    2,300 sq ft
    Condition
    Basically, when picking comps, don’t use a house that’s about to fall over to compare to your newly remodeled home.
    
    Once you have your comps selected, you calculate the average PSF. You may see a decrease in your property’s valuation, but probably only enough to save you one or two hundred bucks in taxes. Let’s see if we can shave a bit more off that valuation.
    
    Re-Condition
    That sounds like a tip for silky, voluminous hair, but I'll instead give you tips on how your property’s condition can actually help lower your valuation. Maybe your house isn’t about to fall over, but maybe it is outdated and hasn’t been remodeled in a long time. Maybe you have linoleum floors and your kitchen counters are Formica. Look at the comps in your neighborhood. How do they compare to your house? Are they updated? If they are, this can help bring your property’s valuation down. Bring pictures of your property in to your hearing to support your proposed valuation to. This could save you a lot of money this year.
    
    That’s it! Now you know how to protest your property taxes. Easy as pie, right? It certainly can be, though it is daunting. I think everyone should try to protest on their own at least once – you might find you have a knack for it. Almost 90% of commercial properties valued over a million dollars protest their property taxes. If business owners who are trying to efficiently run their companies can do it, why shouldn’t you? It’s a great opportunity to save some money so you can buy yourself the best new Joola pickleball paddle.
    
    If you would like to have us protest your property taxes on your behalf, then Sign Up.`,
    LINK: "https://resolutepts.com/how-to-protest-your-property-taxes"
    }
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
