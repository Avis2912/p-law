import { getDoc, doc, updateDoc } from '@firebase/firestore';
import axios from 'axios';
import { create } from 'lodash';
// import fetch from 'node-fetch';
import openAIJSON from './openAIJSON';

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

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
  'High search volume trend (>30% increase in 3mo)',
  'Low difficulty (<30) with good search volume',
  'High search volume, relatively low competition',
  'Very high-intent topic, low competition',
  'Competitors not ranking, high-intent topic',
  'Aligns with firm\'s current ranking momentum',
  'Growing search trend in target geographic area',
  'Content gap in competitor coverage',
  'High conversion potential based on search intent',
  'Seasonal peak approaching for this topic',
  'Recent regulatory changes affecting this area',
  'Building topical authority in this subject',
  'Related to existing high-performing content',
  'Strategic entry point for broader topic coverage',
  'Matches client demographic search patterns',
  'Underserved local market opportunity',
  'Builds on existing keyword rankings'
];

const askPerplexity = async (prompt) => {

    const apiKey = `${import.meta.env.VITE_PERPLEXITY_API_KEY}`;
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
            const competitionData = firmDoc.data().COMPETITION;
            if (competitionData && competitionData.COMPETITION) {
                competitionData.COMPETITION = competitionData.COMPETITION.map(comp => {
                    if (comp.RANKING_FOR && Array.isArray(comp.RANKING_FOR)) {
                        comp.RANKING_FOR = comp.RANKING_FOR.slice(0, 7);
                    }
                    return comp;
                });
            }
            return JSON.stringify(competitionData) || {};
        }
    } catch (error) {
        console.error(error);
    }
    return {};
};

const getReasons = async (topic, topicKeywords, longTermData, compData, possibleReasonsList, currentlyRankingFor) => {
  try {
    const prompt = `
      Given this specific data:
      - Topic: "${topic.title}"
      - Keywords for the topic: ${JSON.stringify(topicKeywords)}
      - Firm's long-term strategy: ${JSON.stringify(longTermData)}
      - Firm currently ranks for: ${JSON.stringify(currentlyRankingFor)}
      - Competitor rankings & content: ${JSON.stringify(compData)}
      - Available reasoning options: ${JSON.stringify(possibleReasonsList)}

      Select 4 highly specific, data-backed reasons that BEST explain why this topic should be targeted.
      Focus on search metrics, competition gaps, and strategic fit. 

      ONLY WRITE DOWN THE EXACT REASON STRINGS YOU PICK FROM THE REASONING OPTIONS. NO MORE TEXT NEEDED NEEDED.
      
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
      Provide 2 extremely relevant news articles about "${space}" published between ${startDateStr} to ${endDateStr}. Add a very title of 4-5 words.
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

const isValidLongTermStrategy = (strategyData) => {
  if (!strategyData?.STRATEGY?.LONG_TERM) return false;
  return strategyData.STRATEGY.LONG_TERM.length > 0 && 
         strategyData.STRATEGY.LONG_TERM.every(item => 
           item.showup_for && item.showup_for.trim() !== ''
         );
};

const getCurrentWeekNumber = () => {
  const today = new Date();
  const day = today.getDate();
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  if (day <= 21) return 2;
  return 3;
};

const getTopicList = async (longTermData, firmDescription, previousTopics = []) => {
  try {
    const prompt = `
      Based on the long-term strategy, ranking keywords, firm description, and location, 
      create a very specific list of 4 topics to write for this month to rank on Google.
      Don't make these too broad and generic, and make sure they're 4-6 words long.

      longTermData: ${JSON.stringify(longTermData)},
      firmDescription: "${firmDescription}",
      
      ${previousTopics.length > 0 ? `IMPORTANT: Avoid these previously used topics: ${JSON.stringify(previousTopics)}` : ''}

      Distinguish topics from keywords and provide examples.
      OUTPUT FORMAT: topics: [
        { title: 'Dallas Campaign Management Strategies', keywords: [] },
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

const createWeeklyStrat = async (firmName, type = 'New', givenLongTermData = []) => {

  console.log('Creating Weekly Strategy: ', type);

  let strategyData = {};
  let firmDescription = ''; let firmSite = ''; let location = '';
  let longTermData = givenLongTermData; let rankedSearchData = []; let topicData = []; let trendingData = [];
  let newsData = []; let reasons = []; let currentlyRankingFor = [];

  const getStrategyData = async (firmNameInt) => {
    try {
        const firmDoc = await getDoc(doc(db, 'firms', firmNameInt));
        if (firmDoc.exists()) {
          const firmInfo = firmDoc.data().FIRM_INFO;
          firmDescription = firmInfo.DESCRIPTION;
          firmSite = firmInfo.CONTACT_US;
          location = firmInfo.LOCATION;
          currentlyRankingFor = firmDoc.data().STRATEGY?.STRATEGY?.RANKING_FOR || [];
          return {
            currentStrategy: firmDoc.data().STRATEGY || {},
            previousStrategies: firmDoc.data().STRATEGY_EX || []
          };
      }
    } catch (error) {
      console.error(error);
    }
    return { currentStrategy: {}, previousStrategies: [] };
  }

  const { currentStrategy, previousStrategies } = await getStrategyData(firmName);
  strategyData = currentStrategy;

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

  if (type === 'Monthly' || type === 'Weekly') {
    // Remove givenLongTermData check since it's not needed for these types
    longTermData = strategyData.STRATEGY?.LONG_TERM || await createLongTermData();
  } else if (type === 'New') {
    // Only use givenLongTermData for new strategy creation
    longTermData = givenLongTermData.length ? givenLongTermData : await createLongTermData();
  }

  if (type === 'Monthly') {
    // Archive current strategy if it exists
    if (strategyData?.STRATEGY) {
      try {
        const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        const archiveEntry = {
          STRATEGY: strategyData,
          MONTH: currentMonth
        };

        const firmRef = doc(db, 'firms', firmName);
        await updateDoc(firmRef, {
          STRATEGY_EX: [...previousStrategies, archiveEntry]
        });
        console.log('Previous strategy archived');

        // Extract previous topic titles
        const previousTopicTitles = previousStrategies
          .flatMap(entry => entry.STRATEGY?.STRATEGY?.TOPICS?.map(topic => topic.title) || []);

        // Create new strategy with awareness of previous topics
        rankedSearchData = await getRankedSearches();
        topicData = await getTopicList(longTermData, firmDescription, previousTopicTitles);

        // ...rest of strategy creation code...
        let allKeywords = [];
        
        for (let i = 0; i < topicData.length; i++) {
          const topic = topicData[i];
          topic.keywords = await getKeywordsForTopic(topic);
          console.log(`Keywords for Topic ${topic.title}:`, topic.keywords);
        
          allKeywords = allKeywords.concat(topic.keywords);
        
          topic.reasons = await getReasons(topic, topic.keywords, longTermData, compData, possibleReasons, currentlyRankingFor);
          console.log(`Reasons for Topic ${topic.title}:`, topic.reasons);
        
          topic.news = await getNewsArticles(topic, firmDescription, location, i % 4);
          console.log(`News for Topic ${topic.title}:`, topic.news);
        }

        // Create and update new strategy
        strategyData = {
          STRATEGY: {
            TOPICS: topicData,
            RANKING_FOR: rankedSearchData,
            LONG_TERM: longTermData,
          },
          TRENDING: trendingData,
          LAST_DATE: new Date().toLocaleDateString(),
        };

        await updateDoc(firmRef, {
          'STRATEGY': strategyData,
        });
        console.log('New monthly strategy created and updated');
      } catch (error) {
        console.error('Error in monthly strategy update:', error);
      }
    }
  } else if (type === 'New') {

    console.log('In Func')

    console.log('Long Term Data:', longTermData);
    
    rankedSearchData = await getRankedSearches();
    console.log('Ranked Search Data:', rankedSearchData);
    
    topicData = await getTopicList(longTermData, firmDescription);
    console.log('Topic Data:', topicData);
    
    let allKeywords = [];
    
    for (let i = 0; i < topicData.length; i++) {
      const topic = topicData[i];
      topic.keywords = await getKeywordsForTopic(topic);
      console.log(`Keywords for Topic ${topic.title}:`, topic.keywords);
    
      allKeywords = allKeywords.concat(topic.keywords);
    
      topic.reasons = await getReasons(topic, topic.keywords, longTermData, compData, possibleReasons, currentlyRankingFor);
      console.log(`Reasons for Topic ${topic.title}:`, topic.reasons);
    
      topic.news = await getNewsArticles(topic, firmDescription, location, i % 4);
      console.log(`News for Topic ${topic.title}:`, topic.news);
    }
    
    const combinedKeywordsString = JSON.stringify(allKeywords);
    trendingData = await getTrendingKeywords(combinedKeywordsString);
    console.log('Trending Data:', trendingData);
    
      strategyData = {
        STRATEGY: {
          TOPICS: topicData,
          RANKING_FOR: rankedSearchData,
          LONG_TERM: longTermData,
        },
        TRENDING: trendingData,
        LAST_DATE: new Date().toLocaleDateString(),
      };

      // Update the firm's strategy document
      try {
          const firmRef = doc(db, 'firms', firmName);
          await updateDoc(firmRef, {
            'STRATEGY': strategyData,
          });
          console.log('Strategy updated in Firestore');
      } catch (error) {
        console.error('Error updating strategy:', error);
      }

  } else if (type === 'Weekly') {
    // Get existing strategy data
    strategyData = await getStrategyData();
    if (!strategyData?.STRATEGY?.TOPICS) {
      console.log('No existing strategy found, creating new one');
      return createWeeklyStrat(firmName, 'New');
    }

    const currentWeek = getCurrentWeekNumber();
    const topicsToUpdate = strategyData.STRATEGY.TOPICS.filter((_, index) => index % 4 === currentWeek);

    for (const topic of topicsToUpdate) {
      topic.news = await getNewsArticles(
        topic,
        firmDescription,
        location,
        currentWeek
      );
      console.log(`Updated news for Topic ${topic.title}:`, topic.news);
    }

    // Update the firm's strategy document
    try {
      const firmRef = doc(db, 'firms', firmName);
      await updateDoc(firmRef, {
        'STRATEGY': strategyData,
      });
      console.log('Strategy updated in Firestore');
    } catch (error) {
      console.error('Error updating strategy:', error);
    }
  }

  return strategyData;
}

export default createWeeklyStrat;
