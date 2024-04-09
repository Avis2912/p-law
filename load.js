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
newUser(docName = 'Patel Law Group',

firmInfo = {
    CONTACT_US: "https://patellegal.com/contact/",
    NAME: "Patel Law Group",
    LOCATION: "Dallas, TX",
    DESCRIPTION: "Patel Law Group is a boutique law firm providing efficient, results‑driven legal advice to local, regional, and international clients. From our location in Dallas, we leverage broad experience and extensive relationships to deliver results for clients nationwide. With a rolled‑up‑sleeves attitude, we partner with clients of all sizes — individuals, start-ups and established companies — to achieve their objectives in Immigration, Real Estate, and Corporate law",  
    IMAGE: 'https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(25).png?alt=media&token=5e7a96c7-ae8a-47c8-a3e9-2ceb3bc7fc6f',
    MODEL: 2,
    PLAN: "Full Suite",
},

smallBlog = [

    // BLOG 1

    `
    FANNIE MAE’S GREEN REWARDS PROGRAM PUTS GREEN BACK IN PROPERTY OWNER’S POCKETS
    Posted on Oct 18, 2023 by Scott MacPherson
        
    Fannie Mae’s Green Rewards program incentivizes borrowers to undertake energy and water efficiency improvements at multifamily properties. The program is available nationwide to both conventional and affordable multifamily property loans, with a term between 5 to 30 years, and helps to lower property utility costs while increasing loan proceeds made available to borrowers.
    
    Additionally, owners will benefit from a reduced interest rate on the loan. The Green Rewards interest rate may be up to 10 basis points lower than a typical, non-Green Rewards loan. The interest rate reduction may also be applied to newly purchased buildings with an existing Green Building Certification.
    
    During the underwriting process, Fannie Mae will have an engineering inspection done at the property, and will provide a free Energy and Water Audit Report to the borrower.
    
    Through this inspection and report, engineers will identify items that may be switched out for more energy efficient options. These items usually include shower heads and toilets with reduced water flow; Energy Star certified HVAC systems; solar panels; and LED lighting in building common areas.
    
    The underwriting team will factor in the property owner’s and tenant’s potential energy and water savings(75% of the owner-projected and 25% of the tenant-projected) into the Underwritten Net Cash Flow, and will lower the interest rate for the loan.
    
    Underwriting will also recommend more funds, up to 5%, in additional loan proceeds be made available to the borrower at closing.  For a first lien or supplemental mortgage, a portion of those proceeds must be used to undertake the green upgrades. For a second supplemental mortgage, all of the additional loan proceeds must be used toward efficiency improvements.
    
    At closing, the borrower will be provided a loan agreement with a schedule of all green repairs and their associated deadlines, which must be followed to maintain the lowered interest rate in the Green Rewards program. Around the time the green repairs deadlines come due, Fannie Mae or the associated servicer will send out an inspector to verify that the green repairs are in place. Typically, a borrower has up to 12 months to complete the green upgrades.
    
    In the event the repairs have not been completed within the allotted timeframes, your portfolio manager will work with you to set updated repair deadlines, and will request documentation in the meantime demonstrating to Fannie Mae that you’ve ordered/purchased the green items and taken at least some steps toward finishing the green repairs.
    
    Once all green repairs are completed and verified by inspection, the property owner must report their Energy Star score annually throughout the term of the loan, allowing the lender to track the progress of their program and its effects on multifamily properties.
    
    The energy savings; reduced interest rates; and additional loan proceeds, the Green Rewards Program is highly beneficial to property owners and their tenants, and can significantly increase cash flows for property owners. If you have any questions about the Green Rewards Program or a new loan you are considering, please feel free to reach out to me at smacpherson@patellegal.com or (972) 435-4339.
    
    `,

    // BLOG 2

    `
    DACA RECIPIENTS: GREEN CARD THROUGH MARRIAGE OR EMPLOYMENT
    Posted on Apr 4, 2024 by Carmel Celocia

    CAN SOMEONE ON DACA APPLY FOR A GREEN CARD?
    DACA is not a lawful status. But that doesn’t mean that someone with DACA cannot get a green card. DACA applicants’ pathway to a green card depends on their application basis.

    There is a big difference between someone on DACA applying for a green card through marriage versus through employment. This article will look at the two different paths:

    OBTAINING A MARRIAGE-BASED GREEN CARD
    The method by which the Deferred Action for Childhood Arrivals recipient entered the US is relevant in determining whether someone can apply for a green card in the US (known as adjustment of status) or outside of the US (Consular processing). 

    DACA recipients who entered the country lawfully can apply for adjustment of status by filing Form I-485. They must have been inspected and admitted by a CBP officer and be married to a USC.  Those married to an LPR cannot file for adjustment, irrespective of whether they have a lawful entry. 

    DACA recipients that entered the U.S. unlawfully are not allowed to adjust in the U.S. and must go for Consular processing.  This is because a lawful entry is required to file for adjustment of status. This means leaving the U.S. after the I-130 is approved and going to the U.S. Consulate in their home country to obtain an Immigrant Visa.  Once the Immigrant Visa is used to return to the U.S. the applicant will receive his/her green card. 

    However, this is where it gets more complicated. Applicants with over 180 days but less than one year of unlawful presence face a 3-year bar upon leaving the U.S. Those with a year or more of unlawful presence face a 10-year bar. 

    DACA recipients who received DACA prior to their 18th birthday do not accrue any lawful presence. People who get DACA after turning 18 will have an unlawful presence. Calculate days from the 18th birthday to receiving DACA as DACA prevents the accrual of unlawful presence. 

    Exploring the pathway to a green card is crucial for DACA recipients seeking to adjust their immigration status.

    THE BOARD OF IMMIGRATION APPEALS
    A Board of Immigration Appeals (BIA) decision, Matter of Arabally and Yerrabelly states that someone who travels using advance parole (travel document) does not make a departure from the U.S. and therefore does not trigger the 3- or 10-year bar.   

    Someone on DACA with accrued unlawful presence can leave on advance parole. They can return to the US legally and file for adjustment of status if married to a USC. 

    If you entered unlawfully and stayed over 180 days without a way to get advance parole, leaving the US will activate the 3- or 10-year bar. However, you may be eligible for a waiver to overcome the bar if you can show extreme hardship to a USC/LPR spouse or parent.   

    OBTAINING AN EMPLOYMENT-BASED GREEN CARD
    While DACA recipients can be sponsored by their employer for a green card they cannot apply to adjust their status in the US because DACA is not a lawful status. Employment-based adjustment needs lawful nonimmigrant status to file. An applicant with advance parole cannot adjust status for an employment-based green card upon legal re-entry to the US. because DACA is not a valid status. 

    DACA recipients who got DACA before 18 and have no unlawful presence can get a green card by attending a US Consulate appointment.  The 3- or 10-year bar is not triggered. 

    If you obtained DACA after turning 18 and therefore you have an unlawful presence, then leaving the U.S. will trigger the bar. In Matter of Arabally and Yerrabelly, using advance parole does not trigger the 3- or 10-year bar. Someone traveling with advance parole does not leave the U.S.  The problem here is that although USCIS recognizes this as a matter of law, DOS does not.  This question has been raised with DOS, and they have failed to answer this. A DACA recipient with unlawful presence will still struggle to get an employment-based green card.

    Exploring the pathway to a green card is essential for DACA recipients aiming for employment-based immigration opportunities.

    Conclusion 

    To transition from DACA to a Green Card, consult an Immigration Attorney.  If you have questions regarding any of the above, please contact PLG Partner cprescott@patellegal.com. 


    `
    
],

bigBlog = [
    {
        TITLE: "DACA RECIPIENTS: GREEN CARD THROUGH MARRIAGE OR EMPLOYMENT",
        LINK: `https://patellegal.com/blog/daca-recipients-green-card-through-marriage-or-employment/`,
        CONTENT: `

Blog DACA Recipients: Green Card through Marriage or Employment

CAN SOMEONE ON DACA APPLY FOR A GREEN CARD?
DACA is not a lawful status. But that doesn’t mean that someone with DACA cannot get a green card. DACA applicants’ pathway to a green card depends on their application basis.

There is a big difference between someone on DACA applying for a green card through marriage versus through employment. This article will look at the two different paths:

OBTAINING A MARRIAGE-BASED GREEN CARD
The method by which the Deferred Action for Childhood Arrivals recipient entered the US is relevant in determining whether someone can apply for a green card in the US (known as adjustment of status) or outside of the US (Consular processing). 

DACA recipients who entered the country lawfully can apply for adjustment of status by filing Form I-485. They must have been inspected and admitted by a CBP officer and be married to a USC.  Those married to an LPR cannot file for adjustment, irrespective of whether they have a lawful entry. 

DACA recipients that entered the U.S. unlawfully are not allowed to adjust in the U.S. and must go for Consular processing.  This is because a lawful entry is required to file for adjustment of status. This means leaving the U.S. after the I-130 is approved and going to the U.S. Consulate in their home country to obtain an Immigrant Visa.  Once the Immigrant Visa is used to return to the U.S. the applicant will receive his/her green card. 

However, this is where it gets more complicated. Applicants with over 180 days but less than one year of unlawful presence face a 3-year bar upon leaving the U.S. Those with a year or more of unlawful presence face a 10-year bar. 

DACA recipients who received DACA prior to their 18th birthday do not accrue any lawful presence. People who get DACA after turning 18 will have an unlawful presence. Calculate days from the 18th birthday to receiving DACA as DACA prevents the accrual of unlawful presence. 

Exploring the pathway to a green card is crucial for DACA recipients seeking to adjust their immigration status.

THE BOARD OF IMMIGRATION APPEALS
A Board of Immigration Appeals (BIA) decision, Matter of Arabally and Yerrabelly states that someone who travels using advance parole (travel document) does not make a departure from the U.S. and therefore does not trigger the 3- or 10-year bar.   

Someone on DACA with accrued unlawful presence can leave on advance parole. They can return to the US legally and file for adjustment of status if married to a USC. 

If you entered unlawfully and stayed over 180 days without a way to get advance parole, leaving the US will activate the 3- or 10-year bar. However, you may be eligible for a waiver to overcome the bar if you can show extreme hardship to a USC/LPR spouse or parent.   

OBTAINING AN EMPLOYMENT-BASED GREEN CARD
While DACA recipients can be sponsored by their employer for a green card they cannot apply to adjust their status in the US because DACA is not a lawful status. Employment-based adjustment needs lawful nonimmigrant status to file. An applicant with advance parole cannot adjust status for an employment-based green card upon legal re-entry to the US. because DACA is not a valid status. 

DACA recipients who got DACA before 18 and have no unlawful presence can get a green card by attending a US Consulate appointment.  The 3- or 10-year bar is not triggered. 

If you obtained DACA after turning 18 and therefore you have an unlawful presence, then leaving the U.S. will trigger the bar. In Matter of Arabally and Yerrabelly, using advance parole does not trigger the 3- or 10-year bar. Someone traveling with advance parole does not leave the U.S.  The problem here is that although USCIS recognizes this as a matter of law, DOS does not.  This question has been raised with DOS, and they have failed to answer this. A DACA recipient with unlawful presence will still struggle to get an employment-based green card.

Exploring the pathway to a green card is essential for DACA recipients aiming for employment-based immigration opportunities.

Conclusion 

To transition from DACA to a Green Card, consult an Immigration Attorney.  If you have questions regarding any of the above, please contact PLG Partner cprescott@patellegal.com. 


        `,
    },
    {
        TITLE: "THE VISA BULLETIN EXPLAINED: UNDERSTANDING THE EB-5 CATEGORIES PRE AND POST RIA",
        LINK: `https://patellegal.com/blog/the-visa-bulletin-explained-understanding-the-eb-5-categories-pre-and-post-ria/`,
        CONTENT: `
        Posted on Mar 12, 2024 by Rakesh Patel and Jacqueline Trevino
        
        Blog The Visa Bulletin Explained: Understanding the EB-5 Categories Pre and Post RIA
        
        The visa bulletin is a monthly publication issued by the US Department of State that provides information on the availability of immigrant visas. It categorizes applicants based on their priority date and country of birth, determining when they can proceed with applying for a green card. On the visa bulletin, the 5th preference category refers to the EB-5 Immigrant Investor Program. There are two main EB-5 categories on the visa bulletin: the unreserved categories and set aside categories.  
        
        Unreserved Category 
        
        The unreserved category is for investments made before the enactment of the Reform and Integrity Act (RIA) in 2022 or subsequent investments post-RIA that do not meet the criteria for the visa set aside categories. This category relates to investments of $1,050,000 and is not subject to specific allocation percentages.  
        
        In April 2024, the unreserved categories will remain current for all countries with the exception of China and India. For a green card application to move forward, investors from China must have the priority date of December 15, 2015, or earlier, while investors from India must have a priority date of December 01, 2020, or earlier. Furthermore, it is taking approximately two to three years to receive conditional green card status for these types of projects. 
        
        Set Aside Categories   
        
        The set asides are listed in three distinct rows, each indicating the percentage of the EB-5 visas that are set aside for each category each fiscal year. These categories include visas set asides for rural projects (20%), high unemployment projects (10%), and infrastructure projects (2%), all requiring an investment of at least $800,000. 
        
        Any of the set aside visas that go unused are held within the same category for the following fiscal year. If there are remaining unused visas in these categories after the second fiscal year, they are released to the unreserved categories during the third fiscal year. 
        
        In April 2024, the set aside categories will remain current for all countries. No specific priority date is required for an investor currently in the US on a valid status to concurrently file Form I-526 or I-526E along with Form I-485 to initiate their adjustment of status to a conditional green card holder. Furthermore, these post-RIA investments are experiencing notably faster processing times in comparison to the unreserved category, with some investors receiving their conditional green card as fast as 12 to 18 months.  
        
        To learn more about the EB-5 visa set aside categories or concurrent filing, please visit our blog site at https://patellegal.com/blog/category/immigration-blog/. 
        
        If you have any questions regarding the EB-5 process or your place in line for a green card, please email us at rpatel@patellegal.com and jtrevino@patellegal.com.  
        
        `
    },
    {
        TITLE: "CONCURRENT FILING SPARKS INCREASED INTEREST IN THE EB-5 PROGRAM",
        CONTENT: `The EB-5 Reform and Integrity Act (RIA) of 2022 authorizes certain new investors to file a Form I-485 (Application for Adjustment of Status) along with a Form I-526 (Immigrant Petition by Standalone Investor) or Form I-526E (Immigrant Petition by Regional Center Investor). This is called concurrent filing, and to take advantage of it, there must be a visa available for the applicant, and the applicant must reside in the U.S. in a nonimmigrant status that is eligible for adjustment of status. If a visa is available, it indicates there is space within the annual quota set by the U.S. government for EB-5 immigrant investors to proceed with their visa application process. This is evidenced by the visa category being listed as “Current” in the U.S. Department of State visa bulletin, which displays the availability of immigrant visas each month. 

        The provision for concurrent filing is advantageous for eligible individuals. By submitting an I-485 application for adjustment of status, investors can seek work authorization and advance parole documents. These documents allow lawful employment and international travel during the pendency of both the I-526 petition and adjustment of status application. 
        
        As of January 2024, the set-aside EB-5 categories are classified as “Current” for all countries, meaning an EB-5 investor need not have a particular priority date (the date they filed their application) for a visa to be available to them. Thus, if an investor invests the minimum requirement of $800,000.00 USD in a rural, high unemployment, or infrastructure project, they can move forward with their immigration application process. This is particularly notable for China and India, the only countries whose unreserved EB-5 categories remain uncurrent. 
        
        The option to concurrently file is one of the provisions that makes the reformed program more effective and appealing to foreign investors residing in the U.S. on a nonimmigrant visa. It enables applicants to remain in the U.S. and avoid lengthy processing times. For example, it may take USCIS up to 56.5 months to process the I-526 petition and 49 months to process the I-485 petition. However, USCIS often processes the I-485 application shortly after approving the I-526 petition. Nonetheless, it is recommended to maintain nonimmigrant status until a conditional green card is approved. 
        
        We encourage Indian and Chinese nationals to take advantage of this provision while the priority dates remain current. 
        
        If you have any questions regarding the EB-5 process, please email us at rpatel@patellegal.com and jtrevino@patellegal.com.`,
        LINK: "https://patellegal.com/blog/concurrent-filing-sparks-increased-interest-in-the-eb-5-program-2/",
    },

    {TITLE: "LOAN MODIFICATION BASICS",
    LINK: `https://patellegal.com/blog/loan-modification-basics/`,
    CONTENT: `
    The Mortgage Bankers Association estimates that nearly $1 trillion in multifamily CRE debt will mature by 2027.  An historically large number of multifamily debt maturities is on the horizon, leading many borrowers seeking to extend time on their current loans waiting for better interest rates and loan terms,  rather than refinancing their property at a high interest rates or selling it at a loss. Over the last few months I’ve been increasingly asked by lenders and borrowers to write up or review such loan modifications for the purpose of keeping current debt where it is, and thought I’d go over the basics with you.

    A number of loan terms can be altered through a loan modification including, but not limited to, the loan balance, interest rate, date of payments/deferral, reserve and escrow amounts, providing access to reserve/escrow funds to borrower, and extending the maturity date of the loan.

    The adjustment of these terms affects the loan agreement, promissory note, and the deed of trust. However, all changes may be made through one loan modifying document, the loan modification. The modification also doesn’t need to be recorded, although this is up to your lender. Changing the loan terms through one, unrecorded document simplifies the updating process, and avoids costs like origination fees and prepayment penalties or premiums which would likely be required under a refinance. Although there may not be recording or origination fees, a borrower will likely have to pay the lender’s attorneys’ fees for their work on the modification. The lender may tack this amount onto the principal of your loan or may expect it at the time of the modification.

    Despite the whole process sounding fairly simple, the lender will have a number of considerations before approving your loan modification. One issue is whether the modification will in any way affect the structure of the borrower or the control of borrower. The lender will not want the currently controlling entities or individuals of the borrower to change, taking control away from a guarantor who will be on the hook if the borrower defaults. The lender will also want to reevaluate the financial condition of these parties to confirm that they are still in a position to pay back the loan if things go south.

    The lender will also want to ensure that the modification does not negatively impact the performance of the property, reducing the revenue of the property used to pay back the loan or causing any loss in value of the collateral. A loss in revenue or value both create greater risk for the lender in the event of a default, since the lender won’t have adequate collateral to repay the debt. For the same reason, the lender will send out an inspector, prior to the modification’s execution, to review the property for any needed repairs or capital improvements, and to ensure the property is in compliance with the current loan.

    A loan modification can be a useful tool for those seeking updated terms or an alternative to refinance. If you’re interested in modifying a current loan and have any questions, please feel free to reach out to smacpherson@patellegal.com discuss the process; what to expect; and how we can help.
    `
    },

    {
        TITLE: "SELLING OR TRANSFERRING YOUR INTEREST IN REAL ESTATE SYNDICATIONS OR OTHER INVESTMENTS",
        LINK: `https://patellegal.com/blog/selling-or-transferring-your-interest-in-real-estate-syndications-or-other-investments/`,
        CONTENT: `
        YOU INVESTED IN A PRIVATE OFFERING AND WANT TO SELL YOUR INTEREST – WHAT DO YOU DO?

        For all private offerings, restricted and/or controlled securities are issued, thus inhibiting the ability for investors to sell or transfer their interest. For securities purchased in a Regulation D offering, the interest is considered “restricted” and cannot be freely resold to the public. Thus, investors must identify an exemption from the Security and Exchange Commission’s (“SEC”) registration requirements. Rule 144 serves as one such exemption allowing public resale of restricted and control securities if certain conditions are met. This article aims to educate real estate syndication investors on Rule 144, as well as other similarly situated investors, on how they may sell their interest after investing in a restricted offering.
        
        Background on Rule 144
        
        Under the Securities Act of 1933 (“Securities Act”), securities are required to be registered with the SEC prior to being issued to the public. However, some securities such as restricted securities and control securities are not required to be issued. Restricted securities are securities acquired in unregistered, private sales from the issuing company or from an affiliate of the issuer. These include private placements, Regulation D offerings, and equity compensation. Control securities are those held by an affiliate of the issuing company such as the manager of a syndication, an executive, or a major shareholder. Because restricted and control securities are not required to be registered, they generally may not be freely resold. Rule 144 functions as an exemption to the general rule provided that the following five conditions are met:
        
        Holding Period: The holding period condition applies only to restricted securities and begins on the date the securities were bought and paid for. The length of time restricted securities are required to be held prior to sale is dependent on whether the issuer is considered a “reporting company” or a “non-reporting company.” A reporting company is one subject to the reporting requirements under the Securities and Exchange Act of 1934 while a non-reporting company is not subject to such requirements. Investors in an issuer considered a reporting company are required to hold the interest for a minimum of six months while investors in an issuer considered a non-reporting company are required to hold the interest for a minimum of one year prior to a public sale. Real estate syndication issuers are generally non-reporting companies and investors are thus required to hold their interest for a minimum of one year.
         
        
        Current Public Information: Before any sale of unregistered securities may be made, adequate current information about the issuer must be available. Reporting companies must comply with periodic requirements of the Securities and Exchange Act of 1934 while non-reporting companies must provide company information such as the nature of business, the identity of officers and directors or managers, and financial statements.
        Trading Volume Formula: For affiliates wishing to sell their interest, the number of equity securities sold within a three-month period cannot exceed 1% of all outstanding shares being sold within the same class. This is typically the formula for real estate syndications. For a class listed on a stock exchange, the trading formula is the greater of the above or 1% or average reported weekly trading volume during the four weeks preceding a Form 144 notice of sale.
         
        
        Ordinary Brokerage Transactions: Brokers may not receive more than a normal commission and neither sellers nor brokers may solicit the purchase of securities. Instead, if the seller is an affiliate, all securities sales but be within routine trading transactions.
        Filing a Notice of Proposed Sale With the SEC: Affiliates must file a notice with the SEC if the sale involves more than 5,000 shares or the interest is greater than $50,000 in any three month period. The notice filed is on a Form 144 which asks for basic information about the issuer and purchaser, the securities to be sold, and securities sold during the past three months.
        Determining How Rule 144 Applies to You
        
        Affiliate or Non-Affiliate?	Restricted Securities
        Affiliate: An individual such as an executive officer, director, or large shareholder with the ability to influence or control the issuer company.	·         Affiliates must comply with all Rule 144 conditions prior to any proposed sale. This means that even if all of the requirements are met, a Form 144 notice must sill be filed if the sale involves more than 5,000 shares or is greater than $50,000 in any three month period.
        Non-Affiliate: An individual without the ability to influence or control the issuer.	·         For non-affiliates, if the interest is held for over one year, the interest may be sold without regard to Rule 144. If the interest with an issuer considered a “reporting company” is held for over six months but less than a year, the interest may be sold if the current public information condition is satisfied.
         
        
        Meeting Rule 144 Conditions Does Not Mean the Interest may be Freely Traded
        
        Despite the safe-harbor provided by Rule 144, satisfying the five conditions does not mean the interest may be freely traded. Restricted securities still may not be resold until the issuer consents and the issuer’s counsel provides an opinion letter to remove the certificate’s restrictive legend. This opinion letter covers a three month period and serves to protect the issuer against securities law violations by certifying that certain requirements are met and the issuer is in compliance.
        
        Ensuring compliance with Rule 144 and related Securities Act rules is imperative to avoid legal and monetary penalties.
        
        By: Kamden Crawford, Securities Attorney
                
    `
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
