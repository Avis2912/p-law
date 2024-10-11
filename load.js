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
newUser(docName = 'People360',

firmInfo = {
    CONTACT_US: "https://www.people360ai.com/demo",
    NAME: "People360",
    LOCATION: "Dallas, TX",
    DESCRIPTION: 
    `People360, formerly known as Insala, is a leading provider of innovative workplace solutions designed to enhance individual and organizational potential.
     With over 28 years of industry experience, People360 offers a comprehensive suite of services including THRIVE, which empowers employees to excel in their roles; HIVE, which fosters community and professional relationships; and DIVE, which facilitates data-driven decision-making. The platform emphasizes integrated solutions that leverage predictive AI capabilities to support people operations in today's dynamic work environment.
     By moving beyond traditional approaches, People360 aims to transform how organizations manage talent and foster growth, making it a pivotal player in the future of workplace solutions.
    `,  
    IMAGE: `
https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/misc_images%2Fimage_2024-10-11_122444459.png?alt=media&token=f80ebde8-1584-4f1c-ae72-a40647e6a980
`,
    MODEL: 2,
    PLAN: "Full Suite Plan",
},

keywords = {
    KEYWORDS: "Workplace Solutions, Employee Empowerment, Community Building, Professional Relationships, Data-Driven Decision Making, Predictive AI, People Operations, Talent Management, Organizational Growth, Innovative Solutions, THRIVE, HIVE, DIVE, Industry Experience, Integrated Solutions, Dynamic Work Environment, Transformative Approaches, Future of Work, Dallas Consulting, Comprehensive Services, Strategic Guidance, Consulting Support, Professional Services, Measurable Results, Team Building, Employee Development, Learning from Failures, Consulting Firm, Workplace Innovation",
    LAST_DATE: "15/10/24",
},

smallBlog = [0, 1],

bigBlog = [
{
    TITLE: "How Mentoring Is Helping Solve The Labor Shortage",
    LINK: `https://www.people360ai.com/blog/what-is-corporate-mentoring-0-1`,
    CONTENT: `
The labor shortage has become a pressing issue for businesses across industries, with many struggling to find and retain skilled workers. As companies search for innovative solutions to address this challenge, mentoring has emerged as a powerful strategy for attracting, developing, and retaining talent. 

In this article, we'll explore how mentoring programs are playing a crucial role in helping businesses navigate the labor shortage and build a strong, sustainable workforce. 

Bridging the Skills Gap
One of the key drivers of the labor shortage is the growing mismatch between the skills that employers need and the skills that job seekers possess. Mentoring programs offer a solution by providing opportunities for employees to develop new skills, gain valuable experience, and bridge the skills gap. By pairing less experienced employees with more experienced mentors, businesses can facilitate knowledge transfer, skills development, and on-the-job training, helping employees acquire the skills they need to succeed in their roles and contribute to the organization's success. 

Attracting and Retaining Talent
In today's competitive job market, attracting and retaining top talent is more challenging than ever. Mentoring programs can give businesses a competitive edge by offering employees valuable opportunities for professional growth, career advancement, and personal development. Employees are more likely to stay with a company that invests in their development and provides opportunities for mentorship and growth. By implementing mentoring programs, businesses can not only attract top talent but also retain their existing employees, reducing turnover and building a loyal, engaged workforce. 

Accelerating Onboarding and Integration
The labor shortage has exacerbated the challenges of onboarding and integrating new employees into the workforce. Mentoring programs can help businesses overcome these challenges by providing new hires with access to experienced mentors who can guide them through the onboarding process, answer questions, and help them acclimate to their new roles and responsibilities. By accelerating the onboarding and integration process, mentoring programs enable new employees to become productive members of the team more quickly, reducing the time and resources required to get them up to speed. 

Promoting Diversity and Inclusion
Diversity and inclusion are increasingly important priorities for businesses seeking to create a more equitable and inclusive workplace. Mentoring programs can play a critical role in promoting diversity and inclusion by providing opportunities for employees from underrepresented groups to connect, learn, and grow. By pairing employees from diverse backgrounds with mentors who can offer guidance, support, and advocacy, businesses can create a more inclusive and supportive work environment where all employees feel valued, respected, and empowered to succeed. 

Fostering a Culture of Learning and Development
In today's rapidly evolving business landscape, continuous learning and development are essential for staying competitive and adapting to change. Mentoring programs foster a culture of learning and development by providing employees with opportunities to acquire new skills, expand their knowledge, and grow professionally. 

By investing in mentoring programs, businesses demonstrate their commitment to employee development and create a culture where learning is valued and encouraged, helping employees stay engaged, motivated, and fulfilled in their roles. 

In conclusion, the labor shortage presents significant challenges for businesses, but mentoring programs offer a powerful solution for attracting, developing, and retaining talent. By bridging the skills gap, attracting and retaining top talent, accelerating onboarding and integration, promoting diversity and inclusion, and fostering a culture of learning and development, mentoring programs enable businesses to navigate the labor shortage successfully and build a strong, sustainable workforce for the future. 

If you are interested in developing your mentoring program or  receiving a demo of our products along with pricing information please reach out to successteam@insala.com today.
    `,
},
{
    TITLE: "Now Is The Time To Start Your Mentoring Program",
    LINK: `https://www.people360ai.com/blog/what-is-corporate-mentoring-0-0-0-0-0-0-0-0-0-0-0`,
    CONTENT: `
    In today's rapidly changing landscape, organizations face numerous challenges, from attracting and retaining top talent to fostering a culture of continuous learning and development. 

One proven strategy for addressing these challenges and driving organizational success is the implementation of a mentoring program. With the current business climate presenting both opportunities and obstacles, now is the perfect time for businesses to start their mentoring programs and reap the benefits they offer. 

Addressing Remote Work Challenges
The shift to remote work brought about by the COVID-19 pandemic has highlighted the need for new approaches to employee development and support. Remote employees may feel disconnected from their colleagues and lack access to traditional forms of mentorship and guidance. A mentoring program provides a valuable solution by offering remote-friendly mentoring opportunities that allow employees to connect, learn, and grow regardless of their physical location. By starting a mentoring program now, businesses can support their remote workforce and ensure that employees have access to the guidance and support they need to thrive in a remote work environment. 

Nurturing Leadership Talent
As businesses navigate the complexities of today's business landscape, strong leadership is more important than ever. A mentoring program provides a powerful platform for nurturing leadership talent within the organization. By pairing emerging leaders with experienced mentors, businesses can provide valuable guidance, support, and development opportunities that help future leaders unlock their full potential. Starting a mentoring program now allows businesses to identify and develop the next generation of leaders, ensuring that they have the leadership talent they need to drive organizational success both now and in the future. 

Fostering Diversity and Inclusion
Diversity and inclusion have become top priorities for businesses seeking to create a more equitable and inclusive workplace. A mentoring program can play a key role in fostering diversity and inclusion by providing opportunities for employees from diverse backgrounds to connect, learn from each other, and access valuable support and guidance. By starting a mentoring program now, businesses can take proactive steps to promote diversity and inclusion within their organization, creating a workplace where all employees feel valued, supported, and empowered to succeed. 

Supporting Employee Well-Being
Employee well-being has emerged as a critical concern for businesses as they seek to support their employees during challenging times. A mentoring program can contribute to employee well-being by providing opportunities for employees to connect with mentors who can offer guidance, support, and a listening ear. By starting a mentoring program now, businesses can demonstrate their commitment to supporting employee well-being and provide employees with valuable resources and support systems to help them navigate the challenges they may face. 

Driving Organizational Performance
Ultimately, a mentoring program can drive organizational performance by fostering a culture of learning, development, and collaboration. By providing employees with access to mentors who can offer guidance, feedback, and support, businesses can help employees develop new skills, overcome challenges, and achieve their full potential. Starting a mentoring program now allows businesses to lay the groundwork for long-term success by investing in their employees and creating a culture where learning and growth are valued and encouraged. 

In today's dynamic business environment, the benefits of a mentoring program are more relevant and impactful than ever. 

By starting a mentoring program now, businesses can address remote work challenges, nurture leadership talent, foster diversity and inclusion, support employee well-being, and drive organizational performance. With the right strategy and support, a mentoring program can be a powerful tool for driving employee development, engagement, and organizational success.  

Now is the time for businesses to take action and start their mentoring programs to unlock the full potential of their employees and achieve their business goals. 

To learn more about how Insala can help you unlock the full potential of your mentoring program, contact our Sales Team at successteam@insala.com.
    `
},

{
    TITLE: "7 Tips To Improve Your Corporate Mentoring Program",
    LINK: "https://www.people360ai.com/blog/what-is-corporate-mentoring-0-0-0-0-0-0-0-0-0-0",
    CONTENT: `
Corporate mentoring programs have been driving business revenue higher for decades. To achieve effective revenue results, it's essential to ensure that your mentoring program is well-designed, effectively implemented, and continuously evaluated. 

In this comprehensive guide, we'll explore seven actionable tips to help you enhance the effectiveness of your corporate mentoring program and maximize its impact on your organization. 

Define Clear Objectives and Goals
The first step to improving your corporate mentoring program is to define clear objectives and goals. What do you hope to achieve through the program? Are you aiming to develop leadership skills, improve employee retention, or enhance diversity and inclusion? By clearly defining your objectives, you provide a roadmap for the program and ensure that all stakeholders are aligned on its purpose and intended outcomes. 

Focus on Mentor-Mentee Matching
Effective mentor-mentee matching is crucial for the success of a mentoring program. Take the time to thoughtfully pair mentors and mentees based on factors such as career goals, interests, personality, and communication style. Consider leveraging tools such as the Insala Mentoring Readiness program to assess participants' readiness for mentoring and facilitate successful matches. By ensuring compatibility between mentors and mentees, you set the stage for productive and meaningful mentoring relationships. 

Provide Comprehensive Training and Support
Both mentors and mentees require training and support to maximize the value of their mentoring experience. Offer comprehensive training on topics such as communication skills, goal setting, feedback, and conflict resolution. Additionally, provide ongoing support and resources to help participants navigate challenges and make the most of their mentoring relationships. The Insala Mentoring Readiness program can serve as a valuable resource to prepare participants for their mentoring journey and equip them with the skills and knowledge they need to succeed. 

Establish Clear Expectations
Setting clear expectations is essential for guiding the mentoring relationship and ensuring that both mentors and mentees understand their roles and responsibilities. Clearly outline the goals of the mentoring program, the frequency and format of meetings, and the expectations for communication and feedback. Provide participants with a mentoring agreement or handbook that outlines these expectations and serves as a reference throughout the program. 

Foster Open Communication
Open communication is key to building trust and rapport between mentors and mentees. Encourage participants to communicate openly and honestly with each other, sharing their goals, challenges, and successes. Establish regular check-ins or meetings to provide opportunities for dialogue and feedback. By fostering a culture of open communication, you create a supportive environment where participants feel comfortable sharing their thoughts and experiences. 

Measure and Evaluate Program Effectiveness
Regularly measuring and evaluating the effectiveness of your mentoring program is essential for identifying areas for improvement and making data-driven decisions. Collect feedback from participants through surveys, interviews, or focus groups to gain insights into their experiences and satisfaction with the program. Track key metrics such as participant engagement, skill development, and career advancement to gauge program success. Use these insights to make informed adjustments and enhancements to your mentoring program. 

Celebrate Success and Continuously Improve
Finally, don't forget to celebrate the successes of your mentoring program and recognize the achievements of participants. Whether it's highlighting success stories in company newsletters or hosting recognition events, acknowledging the impact of mentoring can help reinforce its value and encourage continued participation. Additionally, embrace a culture of continuous improvement by soliciting feedback from participants and stakeholders and using this feedback to make ongoing enhancements to your mentoring program. 

In conclusion, by implementing these seven tips, you can take your corporate mentoring program to the next level and unlock its full potential to drive employee development and organizational success. 

From defining clear objectives and goals to fostering open communication and continuously evaluating program effectiveness, each tip plays a crucial role in enhancing the effectiveness of your mentoring initiatives. And by leveraging resources such as the Insala Mentoring Readiness program, you can ensure that participants are well-prepared for their mentoring journey and set up for success from the start. 

Ready to take your corporate mentoring program to the next level?

To learn more about how Insala can help you unlock the full potential of your mentoring program, contact our Sales Team at successteam@insala.com.
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
    TITLE: "The Big 3 Questions To Answer Before Creating Your Corporate Mentoring Program",
    LINK: "https://www.people360ai.com/blog/what-is-corporate-mentoring-0-0-0-0-0-0-0-0",

    CONTENT: `
Implementing a corporate mentoring program can be a game-changer for organizations, offering numerous benefits such as enhanced employee development, improved retention rates, and increased productivity. However, before diving into the creation of a mentoring program, it's essential to lay the groundwork by answering some critical questions. 

In this article, we will explore the big three questions that organizations should address before embarking on the journey of creating a corporate mentoring program. 

What Are Your Objectives and Goals?
The first step in creating a successful corporate mentoring program is to clearly define your objectives and goals. What do you hope to achieve through the program? Are you aiming to develop future leaders, enhance diversity and inclusion, or improve employee engagement and retention? By identifying your specific objectives and goals, you can tailor your mentoring program to address the unique needs and priorities of your organization. 

For example, if your goal is to develop future leaders, you may focus on pairing high-potential employees with experienced leaders who can provide guidance and mentorship. On the other hand, if your objective is to enhance diversity and inclusion, you may prioritize matching mentees from underrepresented groups with mentors who can offer support and advocacy. 

Who Will Participate in the Program?
Another crucial question to consider is who will participate in the mentoring program. Will it be open to all employees, or will it target specific groups such as new hires, high-potential employees, or emerging leaders? Understanding your target audience will help you design a mentoring program that meets their unique needs and preferences. 

Additionally, consider the role of mentors in the program. Will mentors be volunteers from within the organization, or will they be assigned by management? What criteria will you use to select mentors? By carefully considering these questions, you can ensure that both mentors and mentees are well-suited to the program and motivated to actively participate. 

How Will You Measure Success?
Finally, it's essential to establish clear metrics for measuring the success of your corporate mentoring program. What key performance indicators (KPIs) will you use to evaluate the effectiveness of the program? Will you track metrics such as participant satisfaction, mentor-mentee match quality, skill development, or career advancement? 

In addition to quantitative metrics, consider incorporating qualitative feedback mechanisms to gather insights from participants about their experiences with the program. Regular surveys, focus groups, or one-on-one interviews can provide valuable feedback that can inform program improvements and enhancements. 

In conclusion, before embarking on the creation of a corporate mentoring program, it's crucial to answer the big three questions: What are your objectives and goals? Who will participate in the program? How will you measure success? 

By carefully considering these questions and laying the groundwork for your mentoring initiative, you can ensure that your program is well-designed, effectively implemented, and poised to deliver meaningful benefits to both participants and the organization as a whole. 

At Insala, we understand the importance of strategic planning in creating successful corporate mentoring programs. Our comprehensive mentoring solutions empower organizations to design, implement, and manage mentoring programs that drive employee development, engagement, and organizational success. 

To learn more about how Insala can help you implement a successful mentoring program, contact our sales team at successteam@insala.com.   
    `
},

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
        NAME: 'Sample Firm',
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
        NAME: 'Sample Firm 2',
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
