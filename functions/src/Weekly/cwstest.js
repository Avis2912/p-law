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
// const { db, auth } = require('src/firebase-config/firebase');

const createWeeklyStrat = async (firmName, type='New') => {

    let strategyData = {};
    let firmDescription = ''; let compSite = '';
    let longTermData, rankedSearchData, topicData, trendingData = [];
    let newsData = [];


    const getStrategyData = async () => {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.email));
        if (userDoc.exists()) {
            const firmDoc = await getDoc(doc(db, 'firms', userDoc.data().FIRM));
            if (firmDoc.exists()) {
                firmDescription = firmDoc.data().FIRM_INFO.DESCRIPTION;
                compSite = firmDoc.data().FIRM_INFO.COMP_SITE;
                return firmDoc.data().STRATEGY || {};
            }
        }
    }

    // strategyData = await getStrategyData();

    const getRankedSearches = async () => {

        const postData = (target) => [{
            "target": target,
            "location_code": 2840,
            "language_code": "en",
            "date_from": "2024-03-01",
            "date_to": "2024-09-01"
        }];

        const rankedTrafficUrl = 'https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live';

        const rankedKeywordResponse =
            await axios({
            method: 'post',
            url: rankedTrafficUrl,
            data: postData(firmName),
            headers: {
                'Authorization': 'Basic YXZpcm94NEBnbWFpbC5jb206NTEwNjUzYzA0ODkyNjBmYg==',
                'Content-Type': 'application/json'
            }
            });

        let rankedSearches = rankedKeywordResponse.data.tasks[0].result[0].items
            .map(item => ({
            KEYWORD: item.keyword_data.keyword,
            EST_VOLUME: item.keyword_data.keyword_info.search_volume,
            MONTHLY_SEARCHES: item.keyword_data.keyword_info.monthly_searches,
            COMPETITION: item.keyword_data.keyword_info.competition_level,
            }))

        console.log('Ranked Searches:', rankedSearches);
        return rankedSearches;
    }


    const getLongTermData = async () => {

        const longTermJson =
        await openAIJSON(`
            Based on ${firmDescription}, write 4 long term topics it likely wants to rank on google for. 
            OUTPUT FORMAT: longTerm: [
                { showup_for: 'Campaign Manager in Houston TX' },
                { showup_for: 'Political Consultant in San Francisco CA' },
                { showup_for: 'Fundraising Coordinator in New York NY' },
                { showup_for: 'Public Relations Specialist in Chicago IL' },
            ]
        `).longTerm;

        return longTermJson;

    }

    const getNews = async (prompt) => {

        const apiKey = `${process.env.VITE_PERPLEXITY_API_KEY}`;
        const apiUrl = 'https://api.perplexity.ai';
    
        const requestOptions = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
            model: 'sonar-medium-online',
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
    
    if (type === 'New') {

        // longTermData = await getLongTermData();
        console.log('Long Term Data:', longTermData);

    }

    rankedSearchData = await getRankedSearches();


    strategyData = {
        STRATEGY: {
            TOPICS: [],
            RANKING_FOR: rankedSearchData,
            LONG_TERM: longTermData,
            TRENDING: []
        },
        LAST_DATE: '10/31/24',
    }

    return strategyData;
}

module.exports = createWeeklyStrat;

createWeeklyStrat('FutureSolve.com', 'New');
