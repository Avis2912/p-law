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
newUser(docName = 'BPJ&R LLP',

firmInfo = {
    CONTACT_US: "BPJ&R LLP",
    NAME: "BPJ&R LLP",
    LOCATION: "Dallas, TX",
    DESCRIPTION: `
    Berg Plummer Johnson & Raval, LLP is a Houston based litigation law firm offering sophisticated representation to a range of clients in both insurance litigation and commercial litigation matters. We are skilled advocates who have routinely helped clients secure favorable results through negotiation and compromise.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/decentral%20(27).png?alt=media&token=76585ed5-36aa-499a-b891-e70c41d144f9
    `,
    MODEL: 2,
    PLAN: "Full Suite",
},

smallBlog = [0, 1],

bigBlog = [
{
    TITLE: "Long-Term Disability Insurance vs Short-Term Disability Insurance Explained",
    LINK: `https://bergplummer.com/blog/disability-insurance/long-term-vs-short-term/`,
    CONTENT: `

    Long-Term Disability Insurance vs Short-Term Disability Insurance Explained
    by Amar Raval
    Dec 11, 2023
    Doctor touching shoulders of patient in a wheelchair. long term disability vs short term.
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
    Disability insurance can be a savior to many experiencing a long-term or short-term disability. However, understanding a disability insurance policy and the claims process can be difficult. If you have questions or concerns about your disability coverage, please contact one of our Houston disability insurance lawyers today at Berg Plummer Johnson & Raval, LLP for a consultation.
    `,
},
{
    TITLE: "Types of Life Insurance Exclusions",
    LINK: `https://bergplummer.com/blog/life-insurance/types-of-exclusions/`,
    CONTENT: `
    ypes of Life Insurance Exclusions
    by Amar Raval
    Dec 04, 2023
    Family gathered in a living room. Types of Life Insurance Exclusions
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
    TITLE: "Damages for Breach of Contract – What You May Be Entitled To",
    CONTENT: `
    You entered into your contract agreement carefully. You thought the terms were clear, and you signed on the dotted line feeling confident. You trusted the other party to fulfill their duties and leave you with a “job well done.” That is what contracts are supposed to guarantee. But what if the other party does not hold up their end of the deal and leaves you to face the consequences?

    Though frustrating, unfair, and unfortunate, this scenario is not uncommon. But it is not hopeless. With the help of a Houston business litigation attorney from Berg, Plummer, Johnson & Raval LLP, you can fight to recover your losses and hold the negligent party accountable for breach of contract.
    
    Damages for Breach of Contract
    There are different damages you may be entitled to following a breach of contract. In some cases, contract language establishes the consequences if one party fails to fulfill their part of the deal. Even if your contract does not include that information, an experienced breach of contract attorney in Houston will help direct your case and work toward fair compensation.
    
    Compensatory Damages
    As indicated in the name, “compensatory” damages compensate a party harmed by a breach of contract for their losses. Compensatory damages can be general or specific.
    
    In pursuing general compensatory damages, you seek to recover direct losses sustained from the breach. For example, downhole drillers depend on their mud suppliers to deliver orders on time. If those suppliers fail, the driller has to purchase mud from another source – usually at the last minute. The rushed timing may make the purchase more expensive as the driller cannot negotiate a price and is thus required to pay extra for the rushed order. In seeking general damages, the driller may pursue:
    
    A refund of the money already paid to the mud supplier for the original order
    The difference between the amount of the original order and what the new supplier charged
    Reimbursement for the expense of sending the late, and now not-needed, mud back to the supplier
    Special damages are also called “consequential damages.” They cover losses caused by the breach of contract that are not ordinarily predictable.
    
    For example, if you, as the plaintiff (the non-breaching party), lost earnings, sustained damage to your reputation, or lost business opportunities because of the defendant’s contractual breach, you may be entitled to special damages.
    
    Special damages may also apply when there are “special conditions” related to your contract. A party planner may order tents for a weekend-long outdoor bash. When those tents do not arrive on time, the planner has to rent tents to cover the delay. Those rental fees may be included as special damages as long as the party planner can prove the original tent company knew of the specific circumstances, in this case, the dates for the party, upon entering the agreement.
    
    Liquidated Damages
    Liquidated damages means the amount owed is readily ascertainable. If a company sells a drill bit for $100,000 and the buyer picks up the product but never pays, damages are clearly at least $100,000 – plus pre- and post-judgment interest and attorneys’ fees. Those damages are “liquidated.”
    
    Specific Performance
    When specific performance damages are applied to a breach of contract case, the terms of a contract are legally enforced after the breach has occurred. The remedy for the breach is to force the breaching party to honor that original deal. For example, if a property seller enters a contract agreement with a buyer and then refuses to sell, the buyer may seek specific performance damages to continue with the purchase.
    
    A Houston breach of contract lawyer will help you decide if seeking specific performance damages is in your best interest. It is important to consider why the breaching party failed to uphold the deal, whether this remedy will cause the defendant harm or force them to act against their will, and / or if enforcement is impractical, among other issues.
    
    Injunction
    Injunctions serve the opposite purpose of specific performance where a party is ordered to act in order to fulfill the contract through specific performance. Under an injunction, a court may order a party not to act.
    
    Employees must often sign non-compete agreements. For example, a salesperson who separates from a company may be bound by a non-compete. If the salesperson takes a job in sales with a competitor, a court may enter an order preventing the former employee from engaging in competition in violation of the employment contract signed with the former employer.
    
    Injunctions can be temporary or permanent. Temporary injunctions may be ordered as the case is litigated to protect against further potential damage. Permanent injunctions are part of a final decision.
    
    Rescission
    Rescission allows the non-breaching party to back out of the contract legally. The contract is canceled, and both parties are restored to their pre-contractual situations. Rescission generally does not involve the pursuit or payment of monetary damages, though it may include an award of attorneys’ fees.
    
    For rescission to apply, the breach has to be material to, or go to the heart of the contract. If you are a caterer, you may demand partial payment by a specified date. If the party who booked you does not pay, rescission likely applies. You can be released from providing the catering services agreed upon in the contract.
    
    Considerations When Claiming Damages After a Breach of Contract
    contract - damages for breach of contractSeveral factors come under consideration in breach of contract cases, and each can influence the success of the case, including but not limited to those listed below.
    
    Transparency
    It is essential for the terms and conditions of a contract to be transparent or clear. The contract must clearly establish each party’s roles and responsibilities, as well as timelines, deliverables, benchmarks, standards for quality, performance indicators, methods of communication, and all other relevant factors.
    
    Expectation
    If expectations are not clearly established in a contract, it is hard to enforce them. If you claim a vendor, employee, service provider, or someone else has breached a contract by failing to meet expectations, you must prove that claim. It is not possible to do that if expectations are not defined.
    
    Legality
    You can only claim breach of contract if the contract in question is legal. The contract must comply with relevant laws and regulations for the jurisdiction. In addition, for your case to be heard, you must file a breach of contract lawsuit within the statute of limitations or legal deadline. In Texas, the deadline for filing breach of contract claims is generally four years from the date of the breach.
    
    Defenses To Allegations of Breach of Contract
    There are defenses to claims of breach of contract. For example, claims can be filed too late, contracts can be legally invalid, the breach may have occurred because of circumstances beyond the breaching party’s control, and / or the contract may have been signed under duress. These, and other situations, may lead to a claim’s dismissal.
    
    Contact a Houston Breach of Contract Lawyer
    When involved in a breach of contract case, you need an experienced attorney guiding your claim and fighting for you. Reach out to the Houston breach of contract lawyers at Berg, Plummer, Johnson & Raval LLP to get the help you need. Our skilled attorneys will provide bold representation so you can reach a favorable resolution.
    `,
    LINK: "https://bergplummer.com/blog/breach-of-contract/damages/",
},

{   
    TITLE: "Fiduciary Duty to Shareholders Explained",
    LINK: `https://bergplummer.com/blog/commercial-litigation/fiduciary-duty-shareholders/`,
    CONTENT: `
    The directors of a corporation owe shareholders a fiduciary duty to act in their best interests. This duty allows shareholders to safely and securely finance a corporation and its business goals while ensuring their capital investment is safe. With a prescribed fiduciary duty, shareholders would be more likely to engage in this commercial activity, providing a corporation the ability to raise capital for growth over time.

    Shareholders should be aware of the duties owed to them when purchasing stock in a company.
    
    The following discussion examines the establishment of the fiduciary duty owed to shareholders by the directors of a corporation.
    
    What is a Shareholder?
    shareholderTexas Annotated Code § 1.002(81) provides that a shareholder is a person who is issued shares by a for-profit corporation or is a person who gave shares by a for-profit corporation that are held in a voting trust on the owner of the share’s behalf. A share is a financial security that indicates the holder of the share is a part owner of the issuer of the share. A shareholder is a part owner of the corporation that issued the share.
    
    Because shareholders own a portion of the corporate entity, the shareholder is entitled to certain rights under state and (sometimes) federal law. The directors of the corporation and the appointed officers have a set of responsibilities to act in the shareholder’s best interests.
    
    What is a Fiduciary Duty?
    One example of fiduciary duty is the underlying responsibility of the directors and officers of a corporation to act in the best interests of the shareholders. To become a shareholder, the holder of the share typically exchanges something of value to obtain a share of ownership in the company. Once the exchange has been completed, the directors of a corporation must operate the corporation in a way that meets the financial interests of the shareholder. Any deviation from those duties can result in legal action from the shareholders.
    
    Understanding the Basic Structure of a Corporation
    corporationThe vast majority of corporation types are established using the same basic structure, which includes the creation of a Board of Directors, the appointment of corporate officers, and in some cases, the issuance of stock to shareholders. Each portion of the corporate structure creates a foundation for success that allows companies to flourish. However, the only way a company can lawfully do business in the state of Texas (and all states across the country) is to abide by the responsibilities assigned to each party.
    
    Most importantly, it is the role of the Board of Directors to make proper decisions that are in the best interest of the corporate entity and its shareholders. Under Texas Annotated Code § 21.401(a), the Board of Directors exercises or authorizes the corporation’s powers and directs the management of its business and affairs.
    
    Essentially, the board is tasked with establishing a structure for business operations. This includes, but is not limited to:
    
    Empaneling directors to the board
    Drafting and executing bylaws
    Hiring corporate officers to manage their corporation’s daily affairs
    Addressing the corporation’s outstanding liabilities
    Issuing stock to be purchased by potential shareholders
    Establishing procedures to wind up and dissolve the corporation
    Understanding the Duties Owed to Shareholders
    As discussed above, directors of a corporation owe a fiduciary duty to shareholders to act in their best interests when making decisions that impact the core mission of the corporation, in most cases to maximize shareholder value by engaging in commercial activity. In some instances, decisions made by directors (hiring a Chief Executive Officer, purchasing new equipment, opening up sales in a new market) may harm the corporation.
    
    Although these decisions may harm shareholder value, it does not necessarily mean an incorrect business decision breaches the director’s fiduciary duty. Instead, a breach of this duty means the director or directors deviated from protecting and serving the best interests of the shareholder–often for personal gain. Below is a breakdown of the responsibilities prescribed to directors in their role as a fiduciary to shareholders.
    
    Duty of Loyalty
    Core to all fiduciary duties is the duty to be loyal to shareholders. Directors must act in good faith when making decisions that impact the corporation. This means that directors cannot make decisions that promote their own self-interests or that of third parties over the interests of shareholders – known as “self-dealing.”
    
    A common loyalty issue is that of usurping corporate opportunities. Directors are often the first to be aware of business opportunities available to the corporation. A director may usurp these opportunities by taking advantage of the opportunity themselves or on behalf of another party. This can lead the corporation to miss a business opportunity and be a detriment to shareholder interests.
    
    Duty of Obedience
    The duty of obedience (also known as the duty to follow the law) requires directors to obey all local, state, and federal laws regarding the corporation’s administration and to conduct its operations lawfully.
    
    Although the corporation bears the responsibility for certain civil and criminal acts based on its operations, a director may be found personally liable if that director knowingly committed unlawful acts or had direct knowledge of representatives of the corporation committing such acts. This type of conduct can result in a breach, allowing shareholders to pursue civil damages against the directors and seek their termination from the corporation.
    
    Duty of Care
    Lastly, directors must maintain a duty of care to meet their fiduciary duties to shareholders. All directors are held to a reasonably prudent person standard in performing their duties. This means that a director must act as a reasonably prudent director would act under similar circumstances.
    
    Directors may shield themselves from liability by adhering to the business judgment rule. Under the rule, a director may not be found liable for mistakes when using their business judgment, even if their mistakes harmed the corporation. They may shield incompetent, negligent, or misinformed directors.
    
    However, if the director’s actions were found to be grossly negligent, fraudulent, illegal, self-dealing, lacking in any judgment, or uninformed with reasonable access to proper information, they may have breached their duty of care.
    
    Compliance with Fiduciary Duties
    Directors are required by law to act in the interest of their shareholders. However, even the most lawful, informed, and prudent director is subject to the same scrutiny as any other director. Good shareholders should be mindful of corporations that bear their financial interests. Thus, below is a list of acts or omissions that should raise a red flag for shareholders:
    
    Directors who are unqualified to perform their essential duties
    Directors who fail to communicate with other directors, officers, and shareholders
    Directors who often miss or fail to participate in regularly scheduled board meetings
    Directors who are unaware of changes in corporate policy or governance
    Directors who fail to supervise subordinates, including appointed officers and other executive-level staff
    Directors that do not review essential business items like bylaws, policies, new contracts, mergers or acquisitions, executive compensation, budgets, and legal issues
    Directors that possess a history of deviating from the wishes of shareholders
    Legal Counsel for Fiduciary Duties Issues
    Shareholders have a fundamental right to have their investments protected. Thus, a shareholder that has questions about their investment in a corporation or believes a director or an officer of a company holding their investment is not meeting or upholding their fiduciary duty should seek legal counsel.
    
    Please get in touch with a Houston commercial litigation attorney at Berg Plummer Johnson & Raval, LLP today to learn more about your rights as a shareholder.
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
