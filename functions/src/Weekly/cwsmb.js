// GET CURRENTLY RANKING FOR
// CREATE LONG TERM STRATEGY IF DOESN'T EXIST W OPENAI JSON MODE
// CHECK IF ITS UPDATE MODE OR CREATE NEW MODE (IF LAST WEEK ENDED / DOESNT EXIST YET)
// IF UPDATE MODE, JUST RUN PERPLEXITY TO ADD NEWS FOR THE WEEK
// USE LONG TERM STRATEGY + RANKING FOR + DESCRIPTION + LOCATION TO CREATE TOPIC LIST (with examples distinguish topics from keywords)
// CREATE A LIST OF 20 KEYWORDS FOR THE TOPIC AND ADD THE ONES WITH >0 LATEST SEARCH VOLUME TO THE KEYWORDS LIST
// FROM A LIST OF 10 POSSIBLE REASONS, MAKE AI PICK 4
// RUN A PERPLEXITY SCRIPT ON DATE RANGE AND TOPIC AREA TO GET 2 ARTICLES
// OF ALL KEYWORDS FOR ALL TOPICS PICK 6 TRENDING WITH LLM

// const strategyData = {
//     STRATEGY: {
//       TOPICS: [
//          { title: 'Campaign Manager', keywords: [
//           {keyword: 'Campaign Manager in TX', data: [600, 1400, 1600, 1900], competition: 'LOW'},
//           {keyword: 'Campaign Manager in CA', data: [1200, 1700, 1900, 2200], competition: 'MEDIUM'},
//           {keyword: 'NYC Campaign Manager', data: [2000, 2200, 2400, 3500], competition: 'HIGH'},
//           {keyword: 'Campaign Manager in Chicago', data: [500, 2700, 2900, 3200], competition: 'LOW'},
//           {keyword: 'Campaign Manager in Houston', data: [3500, 3200, 3400, 3700], competition: 'HIGH'},
//           {keyword: 'Campaign Manager in San Francisco', data: [200, 1400, 1600, 1900], competition: 'LOW'},
//          ],
//          news: [
//           {title: 'Baylor University Shuts Down', url: 'https://www.baylor.edu/'},
//           {title: 'Texas A&M Wins Big', url: 'https://www.tamu.edu/'},
//          ],
//          reasons: [
//            {reason: 'High demand for PR Specialists in NYC'}, 
//            {reason: 'Low competition for PR Specialists in Texas'},
//            {reason: 'Medium competition for PR Specialists in California'},
//            {reason: 'High competition for PR Specialists in Houston'},
//          ],
//         },
//         ...
//       ],
//       RANKING_FOR:[
//         { keyword: 'Public Relations Specialist', data: [600, 1400, 1600, 1900] },
//         { keyword: 'Policy Analyst', data: [1200, 1700, 1900, 2200] },
//         { keyword: 'Fundraising Coordinator', data: [2000, 2200, 2400, 3500] },
//         { keyword: 'Campaign Manager', data: [500, 2700, 2900, 3200] },
//         { keyword: 'Political Consultant', data: [3500, 3200, 3400, 3700] },
//         { keyword: 'Public Relations Specialist', data: [200, 1400, 1600, 1900] },
//       ],
//       LONG_TERM: [
//         { showup_for: 'Campaign Manager in Houston TX' },
//         { showup_for: 'Political Consultant in San Francisco CA' },
//         { showup_for: 'Fundraising Coordinator in New York NY' },
//         { showup_for: 'Public Relations Specialist in Chicago IL' },
//       ]
//     },
//     TRENDING: [
//         { keyword: 'Public Relations Specialist', data: [600, 1400, 1600, 1900] },
//         { keyword: 'Policy Analyst', data: [1200, 1700, 1900, 2200] },
//         { keyword: 'Fundraising Coordinator', data: [2000, 2200, 2400, 3500] },
//         { keyword: 'Campaign Manager', data: [500, 2700, 2900, 3200] },
//         { keyword: 'Political Consultant', data: [3500, 3200, 3400, 3700] },
//         { keyword: 'Public Relations Specialist', data: [200, 1400, 1600, 1900] },
//     ], 
//     LAST_DATE: '10/25/24',
// };


const { getDoc, doc, updateDoc } = require('@firebase/firestore');
const axios = require('axios');
const { create } = require('lodash');
const fetch = require('node-fetch');
const openAIJSON = require('./openAIJSON');


const { initializeApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDTHCh3zY33u47WqfBQrmUINYuFe68_0HY",
  authDomain: "pentra-hub.firebaseapp.com",
  projectId: "pentra-hub",
  storageBucket: "pentra-hub.appspot.com",
  messagingSenderId: "153834735221",
  appId: "1:153834735221:web:a5cb4ef6822090f44b9a3c",
  measurementId: "G-HLWN09H5X5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

const possibleReasons = [
  'High demand in the market',
  'Low competition in the industry',
  'Recent trends favoring this topic',
  'Alignment with firm\'s long-term goals',
  'Competitor\'s focus on this area',
  'Emerging technologies',
  'Market gap needing fulfillment',
  'Customer interest based on recent feedback',
  'Regulatory changes influencing the topic',
  'Seasonal relevance',
];

const askPerplexity = async (prompt) => {

    const apiKey = `${process.env.VITE_PERPLEXITY_API_KEY}`;
    const apiUrl = 'https://api.perplexity.ai';

    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
            { role: 'system', content: 'Be precise and detailed. Mention sources and dates everywhere you can. Keep the current date in mind when generating.' },
            { role: 'user', content: prompt }
        ]
        })
    };

    return fetch(`${apiUrl}/chat/completions`, requestOptions)
        .then(response => response.json())
        .then(data => data.choices[0].message.content)
        .catch(error => console.error(error));

}


const getCompetitorData = async (firmName) => {
    try {
        const firmDoc = await getDoc(doc(db, 'firms', firmName));
        if (firmDoc.exists()) {
          const firmInfo = firmDoc.data().FIRM_INFO;
          return firmDoc.data().COMPETITION.toString() || {};
      }
    } catch (error) {
      console.error(error);
    }
    return {};
};

const getReasons = async (topic, topicKeywords, longTermData, compData, possibleReasonsList) => {
  try {
    const prompt = `
      Given the topic: "${topic.title}",
      Keywords: ${JSON.stringify(topicKeywords)},
      Long-term strategy: ${JSON.stringify(longTermData)},
      Competitor data: ${JSON.stringify(compData)},
      Possible reasons: ${JSON.stringify(possibleReasonsList)},
      Pick 4 reasons for choosing this topic.
      OUTPUT FORMAT: reasons: [
        { reason: '...' },
        ...
      ]
    `;
    const reasonsJson = await openAIJSON(prompt);
    return reasonsJson.reasons || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getDateRangeForCurrentWeek = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const day = today.getDate();
  let startDay, endDay;

  if (day <= 7) {
    startDay = 1;
    endDay = 7;
  } else if (day <= 14) {
    startDay = 7;
    endDay = 14;
  } else if (day <= 21) {
    startDay = 14;
    endDay = 21;
  } else {
    startDay = 21;
    endDay = new Date(year, month + 1, 0).getDate();
  }

  const startDate = new Date(year, month, startDay);
  const endDate = new Date(year, month, endDay);
  return { startDate, endDate };
};

const getWeekRanges = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const lastDay = new Date(year, month + 1, 0).getDate();

  const ranges = [
    { start: 1, end: 7 },
    { start: 7, end: 14 },
    { start: 14, end: 21 },
    { start: 21, end: lastDay }
  ];

  const currentDay = today.getDate();
  const currentWeekRange = ranges.find(range => 
    currentDay >= range.start && currentDay <= range.end
  );
  
  return {
    ranges,
    currentRange: currentWeekRange,
    currentDay,
    month,
    year
  };
};

const isInPastOrCurrentWeekRange = (topicWeekRange) => {
  const { ranges, currentDay, month, year } = getWeekRanges();
  const today = new Date();
  
  if (today.getMonth() !== month || today.getFullYear() !== year) {
    return false;
  }

  const topicRange = ranges[topicWeekRange];
  return currentDay >= topicRange.start;
};

const getNewsArticles = async (topic, firmDescription, location, weekRangeIndex) => {
  // Return empty array if not in current/past week ranges
  if (!isInPastOrCurrentWeekRange(weekRangeIndex)) {
    return [];
  }

  try {
    const { ranges } = getWeekRanges();
    const weekRange = ranges[weekRangeIndex];
    const { month, year } = getWeekRanges();
    
    const startDate = new Date(year, month, weekRange.start);
    const endDate = new Date(year, month, weekRange.end);

    const promptForSpaces = `
      Based on the firm's description "${firmDescription}" and the topic "${topic.title}",
      identify the main areas of involvement in 2-5 words.
      OUTPUT FORMAT: space: '...'
    `;
    const spaceJson = await openAIJSON(promptForSpaces);
    const space = spaceJson.space || topic.title;

    const startDateStr = startDate.toLocaleDateString('en-US');
    const endDateStr = endDate.toLocaleDateString('en-US');

    const newsPrompt = `
      Provide 2 most relevant news articles about "${space}" from ${startDateStr} to ${endDateStr}.
      OUTPUT FORMAT: news: [
        { title: '...', url: '...' },
        ...
      ]
    `;
    const newsJsonText = await askPerplexity(newsPrompt);
    const newsJson = await openAIJSON(`Just give me back the JSON only for the news: ${newsJsonText}`);

    return newsJson.news || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

const createWeeklyStrat = async (firmName, type = 'New') => {

  let strategyData = {};
  let firmDescription = ''; let firmSite = ''; let location = '';
  let longTermData = []; let rankedSearchData = []; let topicData = []; let trendingData = [];
  let newsData = []; let reasons = [];

  const getStrategyData = async (email='avi@g.com') => {
    try {
        const firmDoc = await getDoc(doc(db, 'firms', firmName));
        if (firmDoc.exists()) {
          const firmInfo = firmDoc.data().FIRM_INFO;
          firmDescription = firmInfo.DESCRIPTION;
          firmSite = firmInfo.CONTACT_US;
          location = firmInfo.LOCATION;
          return firmDoc.data().STRATEGY || {};
      }
    } catch (error) {
      console.error(error);
    }
    return {};
  }

  strategyData = await getStrategyData();

  const getRankedSearches = async () => {

    const postData = (target) => [{
        "target": target,
        "location_code": 2840,
        "language_code": "en",
        "date_from": "2024-03-01",
        "date_to": "2024-09-01"
    }];

    const rankedTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live';
    const formattedCompSite = firmSite.replace(/(^\w+:|^)\/\//, '');

    const rankedKeywordResponse =
        await axios({
        method: 'post',
        url: rankedTrafficUrl,
        data: postData(formattedCompSite),
        headers: {
            'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
            'Content-Type': 'application/json'
        }
        });

    let rankedSearches = rankedKeywordResponse.data.tasks[0]?.result[0]?.items
        .map(item => ({
        KEYWORD: item.keyword_data.keyword,
        EST_VOLUME: item.keyword_data.keyword_info.search_volume,
        MONTHLY_SEARCHES: item.keyword_data.keyword_info.monthly_searches,
        COMPETITION: item.keyword_data.keyword_info.competition_level,
        })) || [];

    return rankedSearches;
}

  const createLongTermData = async () => {
    try {
      const longTermJson = await openAIJSON(`
        Based on ${firmDescription}, write 4 long term topics it likely wants to rank on Google for.
        OUTPUT FORMAT: longTerm: [
          { showup_for: 'Campaign Manager in Houston TX' },
          { showup_for: 'Political Consultant in San Francisco CA' },
          { showup_for: 'Fundraising Coordinator in New York NY' },
          { showup_for: 'Public Relations Specialist in Chicago IL' },
        ]
      `);
      return longTermJson.longTerm || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getTopicList = async (longTermData, firmDescription) => {
    try {
      const prompt = `
        Based on the long-term strategy, ranking keywords, firm description, and location, create a very specific list of 4 topics.
        longTermData: ${JSON.stringify(longTermData)},
        firmDescription: "${firmDescription}",

        Distinguish topics from keywords and provide examples.
        OUTPUT FORMAT: topics: [
          { title: 'Campaign Management Strategies', keywords: [] },
          { title: 'Political Consulting Services', keywords: [] },
          ...
        ]
      `;
      const topicJson = await openAIJSON(prompt);
      return topicJson.topics || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getKeywordsForTopic = async (topic) => {
    try {
      const prompt = `
        Generate a list of 20 keywords for the topic "${topic.title}".
        Only include keywords with >0 latest search volume.
        OUTPUT FORMAT: keywords: [
          { keyword: '...', data: [... (4 US search volume numbers in the hundreds, or low thousands)], competition: '...' },
          ...
        ]
      `;
      const keywordsJson = await openAIJSON(prompt);
      return keywordsJson.keywords || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const getTrendingKeywords = async (keywords) => {
    try {
      const prompt = `
        From all the keywords in all topics, pick 6 that are currently trending.
        KEYWORDS: ${keywords},


        OUTPUT FORMAT: trending: [
          { keyword: '...', data: [...] },
          ...
        ]
      `;
      const trendingJson = await openAIJSON(prompt);
      return trendingJson.trending || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const compData = await getCompetitorData(firmName);

  if (type === 'New') {

    // console.log('In Func')

    // longTermData = await createLongTermData();
    // console.log('Long Term Data:', longTermData);
    
    // rankedSearchData = await getRankedSearches();
    // console.log('Ranked Search Data:', rankedSearchData);
    
    // topicData = await getTopicList(longTermData, firmDescription);
    // console.log('Topic Data:', topicData);
    
    let allKeywords = [];
    
    // for (let i = 0; i < topicData.length; i++) {
    //   const topic = topicData[i];
    //   topic.keywords = await getKeywordsForTopic(topic);
    //   console.log(`Keywords for Topic ${topic.title}:`, topic.keywords);
    
    //   allKeywords = allKeywords.concat(topic.keywords);
    
    //   topic.reasons = await getReasons(topic, topic.keywords, longTermData, compData, possibleReasons);
    //   console.log(`Reasons for Topic ${topic.title}:`, topic.reasons);
    
    //   topic.news = await getNewsArticles(topic, firmDescription, location, i % 4);
    //   console.log(`News for Topic ${topic.title}:`, topic.news);
    // }

    allKeywords = await getKeywordsForTopic({title: 'CHRO Advisory'});
    
    const combinedKeywordsString = JSON.stringify(allKeywords);
    trendingData = await getTrendingKeywords(combinedKeywordsString);
    console.log('Trending Data:', trendingData);
    
      strategyData = {
        STRATEGY: {
          TOPICS: topicData,
          RANKING_FOR: rankedSearchData,
          LONG_TERM: longTermData,
          TRENDING: trendingData,
        },
        LAST_DATE: new Date().toLocaleDateString(),
      };

      // Update the firm's strategy document
      try {
          const firmRef = doc(db, 'firms', firmName);
          await updateDoc(firmRef, {
            'STRATEGY.TRENDING': trendingData,
          });
          console.log('Strategy updated in Firestore');
      } catch (error) {
        console.error('Error updating strategy:', error);
      }

  } else if (type === 'Update') {
    // ...existing code...
  }

  return strategyData;
}

module.exports = createWeeklyStrat;

createWeeklyStrat('FutureSolve', 'New');
