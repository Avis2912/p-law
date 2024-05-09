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
newUser(docName = 'FutureSolve',

firmInfo = {
    CONTACT_US: "https://www.futuresolve.com/contact-us/",
    NAME: "FutureSolve",
    LOCATION: "Dallas, TX",
    DESCRIPTION: 
    `FutureSolve.com is an HR advisory and consulting firm that provides strategic CHRO advisory services, HR Tech & AI solutions for talent management, workforce development programs, and an HR technology marketplace. 
    Led by an team of experienced CHROs and industry experts, FutureSolve aims to be a trusted partner for mid-sized companies, supporting their organizational performance and talent strategies.
    FutureSolve offers a range of services including interim CHRO assistance, people analytics, AI-powered talent sourcing, and training and upskilling initiatives.
    `,  
    IMAGE: `
    https://firebasestorage.googleapis.com/v0/b/pentra-hub.appspot.com/o/user_imgs%2Fdecentral%20(35).png?alt=media&token=6b7d86d3-6b63-422c-809a-5725344f3c80
    `,
    MODEL: 2,
    PLAN: "Trial Plan",
},

keywords = {
    KEYWORDS: "HR Consulting Texas, HR Management, Employee Engagement, Talent Acquisition in Texas, HR Compliance, Texas Employee Benefits, HR Strategy, Workforce Planning, HR Transformation Texas, Performance Management, HR Analytics, HR Outsourcing in Texas, HR Technology, Diversity and Inclusion, Employee Retention, HR Policies Texas, Organizational Development, HR Training, HR Audit, HR Software",
    LAST_DATE: "05/10/24",
},

smallBlog = [0, 1, 2],

bigBlog = [
{
    TITLE: "Unlocking Growth: Top HR Grants for Texas Companies",
    LINK: `https://www.futuresolve.com/unlocking-growth-top-hr-grants-for-texas-companies/`,
    CONTENT: `
    Are you a company in Texas looking to invest in your workforce and fuel growth? One of the most valuable resources available to you might be HR grants. These grants can provide essential funding to support training, development, and apprenticeship programs, ultimately leading to a more skilled and engaged workforce. Let’s explore two top HR grants available for companies in Texas and how they can benefit your organization.

    Upskill Grants: These grants are designed to assist companies in training and developing their employees using unemployment tax funds. The goal is to help companies grow while reducing the likelihood of unemployment among their workforce in the future. Upskill grants typically offer around $1000 in training dollars per employee, making it a substantial investment in your team’s capabilities. By taking advantage of these grants, companies can enhance their employees’ skills, boost productivity, and create a more resilient workforce.
    Apprenticeship Grants: Another valuable resource is apprenticeship grants, which support either internal apprenticeship programs or partnerships with external training providers. These grants can provide significant financial support, with some programs offering up to $10,000 per employee. Apprenticeship programs are often 12 months long and require companies to cover their employees’ salaries during the training period. However, the long-term benefits of having highly skilled and loyal employees far outweigh the initial investment.
    It’s important to note that companies applying for these grants must demonstrate a commitment to workforce development and meet specific criteria outlined by grant providers. This includes having a clear training plan, a designated training coordinator, and a willingness to invest in employee growth.
    
    If you’re interested in accessing these HR grants and maximizing their benefits for your company, FutureSolve can be your trusted partner. Our grant advisors specialize in helping companies navigate the grant application process, identify the grants that best align with their needs, and secure the funding necessary to support their workforce development initiatives.
    
    In Texas alone, there is upwards of $50 million allocated each year for HR grants, highlighting the state’s commitment to supporting businesses in building a skilled and competitive workforce. Don’t miss out on this opportunity to invest in your company’s future success through HR grants. Contact FutureSolve today to learn more and take the first step towards unlocking growth for your organization.
    `,
},
{
    TITLE: "Understanding Interim HR Executives: A Guide to Finding the Right One",
    LINK: `https://www.futuresolve.com/understanding-interim-hr-executives-a-guide-to-finding-the-right-one/`,
    CONTENT: `
    In today’s dynamic business landscape, organizations often encounter situations where they require immediate and effective leadership in their Human Resources (HR) department. This need typically arises during periods of transition, such as sudden departures, organizational restructuring, or when a specialized skill set is required for a specific project. This is where Interim HR Executives come into play, offering their expertise and guidance to navigate through such challenging times.

    What is an Interim HR Executive?
    An Interim HR Executive is a seasoned professional with extensive experience in HR leadership roles. They step in on a temporary basis to fulfill the responsibilities of a Chief People Officer (CPO) or Chief Human Resources Officer (CHRO) within an organization. Their primary objective is to provide strategic direction, operational support, and continuity during times of transition or crisis.
    
    Why Choose an Interim HR Executive?
    Immediate Availability: Interim HR Executives are readily available to start working, allowing organizations to fill crucial leadership gaps without delays.
    
    Expertise: These executives bring a wealth of knowledge and experience, having dealt with a wide range of HR challenges and strategies throughout their careers.
    
    Objective Perspective: As external consultants, Interim HR Executives offer an unbiased and fresh perspective on organizational issues, helping to identify areas for improvement and implement effective solutions.
    
    Cost-Effective: Hiring an interim executive can be more cost-effective than recruiting a full-time executive, especially for short-term projects or transitions.
    
    How to Find the Right Interim HR Executive:
    Define Your Needs: Clearly outline your organization’s requirements, including the scope of work, duration of engagement, and specific skills or experience needed.
    
    Experience and Track Record: Look for candidates with a proven track record of success in similar interim roles or HR leadership positions. Consider their industry expertise and the complexity of projects they have handled.
    
    References and Recommendations: Seek references and recommendations from trusted sources, such as industry peers, professional networks, or reputable interim executive agencies like FutureSolve.
    
    Cultural Fit: Ensure that the interim executive aligns with your organization’s values, culture, and leadership style. A smooth integration into the team is essential for effective collaboration.
    
    Communication and Collaboration: Evaluate the candidate’s communication skills, ability to collaborate with stakeholders at all levels, and their approach to change management and problem-solving.
    
    Explore FutureSolve’s Interim CPOs and CHROs:
    At FutureSolve, we specialize in providing top-tier Interim CPOs and CHROs who excel in driving HR excellence, organizational transformation, and strategic alignment. Our pool of experienced executives brings a diverse range of skills and industry knowledge, ensuring a tailored solution that meets your organization’s unique needs. Partnering with FutureSolve guarantees access to exceptional interim HR talent that delivers results and accelerates your business success.
    
    In conclusion, leveraging the expertise of an Interim HR Executive can be instrumental in overcoming HR challenges, driving organizational growth, and ensuring smooth transitions. By following the outlined steps and considering reputable providers like FutureSolve, organizations can find the right interim executive to lead their HR function with confidence and effectiveness.
    `
},

{
    TITLE: "Designing a Successful Succession Planning Strategy: A Comprehensive Guide",
    LINK: "https://www.taxpayerdeceptionact.com/news?id=12d81640-4aa7-49be-ad87-2fe316a4b03b",

    CONTENT: `
    Succession planning is a critical component of organizational strategy, ensuring the seamless transition of leadership and key roles within an organization. By proactively identifying and developing internal talent to fill critical positions, businesses can mitigate risks associated with leadership gaps and maintain continuity in operations. In this blog, we’ll explore the essential elements of designing a successful succession planning strategy to help organizations effectively groom future leaders and sustain long-term success.

    Establish Clear Objectives: Begin by defining the objectives and goals of your succession planning strategy. Identify key leadership positions and critical roles within the organization that require succession planning. Determine the desired outcomes, such as reducing leadership vacancies, developing a pipeline of internal talent, and promoting diversity and inclusion in leadership roles.
    Identify Key Positions and Talent Pool: Conduct a thorough assessment of current and future talent needs to identify key positions and critical roles that require succession planning. Evaluate the skills, competencies, and potential of existing employees to determine their suitability for future leadership roles. Create a talent pool comprising high-potential individuals who possess the qualities and capabilities necessary for succession.
    Develop a Talent Development Plan: Once you’ve identified potential successors, develop a comprehensive talent development plan to groom them for future leadership roles. Provide targeted training, mentoring, coaching, and experiential learning opportunities to enhance their skills and competencies. Encourage cross-functional exposure and rotations to broaden their knowledge and perspectives.
    Foster a Culture of Continuous Learning: Cultivate a culture of continuous learning and development within the organization to support succession planning efforts. Encourage employees to pursue ongoing education, certifications, and professional development opportunities relevant to their career aspirations. Provide access to resources, such as online courses, workshops, and conferences, to facilitate skill enhancement and knowledge acquisition.
    Implement Performance Management Systems: Implement robust performance management systems to assess and evaluate the performance of potential successors objectively. Establish clear performance criteria, goals, and metrics aligned with organizational objectives. Conduct regular performance reviews and provide constructive feedback to help individuals identify areas for improvement and development.
    Promote Diversity and Inclusion: Promote diversity and inclusion in succession planning efforts to ensure a broad representation of perspectives and experiences among future leaders. Create opportunities for underrepresented groups to participate in leadership development programs and initiatives. Foster an inclusive work environment where all employees feel valued, respected, and empowered to contribute their unique talents and perspectives.
    Encourage Succession Conversations: Encourage open and transparent discussions about succession planning at all levels of the organization. Encourage managers to have ongoing conversations with employees about their career aspirations, development goals, and potential pathways for advancement. Provide guidance and support to employees as they navigate their career paths and explore opportunities for growth within the organization.
    Monitor and Evaluate Progress: Continuously monitor and evaluate the effectiveness of your succession planning strategy to ensure alignment with organizational goals and objectives. Track key metrics such as internal promotion rates, time-to-fill critical positions, and employee engagement scores. Solicit feedback from stakeholders and adjust your strategy as needed to address evolving needs and challenges.
    In conclusion, designing a successful succession planning strategy requires careful consideration of key elements such as talent identification, development, performance management, diversity, and inclusion. By establishing clear objectives, cultivating a culture of continuous learning, and fostering open communication and transparency, organizations can effectively groom future leaders and ensure long-term sustainability and success. By investing in succession planning, businesses can proactively prepare for leadership transitions and maintain a competitive edge in today’s rapidly evolving business landscape.
    `,
},

{
    TITLE: "Addressing High Turnover: Low-Cost Strategies for Improving Employee Experience and Retention",
    LINK: "https://www.futuresolve.com/addressing-high-turnover-low-cost-strategies-for-improving-employee-experience-and-retention/",

    CONTENT: `
    High turnover rates can be detrimental to any organization, leading to decreased productivity, increased recruitment costs, and a negative impact on employee morale. However, addressing turnover doesn’t always require a substantial financial investment. By focusing on strategic adjustments to key areas such as employee experience, hiring, onboarding, training, management leadership, and more, businesses can effectively reduce turnover rates without breaking the bank. In this blog, we’ll explore low-cost strategies to tackle high turnover and foster a more engaged and loyal workforce.

    1. Conduct an Employee Experience Review:
    Start by understanding the factors contributing to high turnover through an in-depth review of the employee experience. Utilize surveys, focus groups, and one-on-one interviews to gather feedback from current and former employees. Identify pain points, such as lack of career development opportunities, poor work-life balance, or ineffective communication channels.
    
    2. Streamline the Hiring Process:
    Simplify and streamline the hiring process to attract and retain top talent. Optimize job descriptions to accurately reflect the role and expectations. Utilize cost-effective recruitment channels such as social media, employee referrals, and job boards. Implement efficient screening and interviewing techniques to identify candidates who align with your organization’s culture and values.
    
    3. Enhance Onboarding Programs:
    Invest in robust onboarding programs to set new hires up for success from day one. Provide comprehensive orientation sessions to familiarize employees with company policies, procedures, and culture. Assign mentors or buddies to support new hires during their transition period. Encourage open communication and feedback to address any concerns or challenges early on.
    
    4. Prioritize Ongoing Training and Development:
    Offer continuous learning and development opportunities to help employees grow and advance within the organization. Implement cost-effective training initiatives such as online courses, webinars, cross-functional projects, and peer-to-peer learning. Empower employees to acquire new skills and competencies that align with their career aspirations and organizational goals.
    
    5. Foster Effective Management Leadership:
    Effective leadership plays a crucial role in employee engagement and retention. Provide leadership training and coaching to managers to enhance their communication, coaching, and conflict resolution skills. Encourage managers to build strong relationships with their team members, provide regular feedback, and recognize and reward achievements.
    
    6. Promote Work-Life Balance:
    Promote a healthy work-life balance to prevent burnout and improve employee satisfaction. Encourage flexible work arrangements, such as remote work options, flexible hours, and compressed workweeks. Provide access to wellness programs, employee assistance resources, and stress management workshops. Demonstrate a commitment to employee well-being by fostering a supportive and inclusive work environment.
    
    7. Implement Employee Recognition Programs:
    Recognize and appreciate employees for their contributions and achievements through cost-effective recognition programs. Celebrate milestones, such as work anniversaries, project completions, and exceptional performance. Implement peer-to-peer recognition platforms or suggestion boxes to empower employees to acknowledge their colleagues’ efforts.
    
    8. Solicit and Act on Feedback:
    Create avenues for employees to voice their opinions, concerns, and suggestions for improvement. Conduct regular pulse surveys to gauge employee sentiment and identify areas for enhancement. Actively listen to feedback and take tangible steps to address issues and implement solutions. Communicate transparently with employees about the actions being taken based on their input.
    
    In conclusion, reducing high turnover rates doesn’t always require significant financial investments. By strategically addressing key areas such as employee experience, hiring, onboarding, training, management leadership, and work-life balance, organizations can improve employee retention and create a more engaged and committed workforce. By prioritizing employee satisfaction and investing in their growth and development, businesses can cultivate a positive organizational culture that fosters loyalty and longevity.
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
    THEME: "#a34040",
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
