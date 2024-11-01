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

    const getNews = async () => {


    }
    
    if (type === 'New') {

        longTermData = await getLongTermData();

    }

    // rankedSearchData = await getRankedSearches();


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

async function test() {
    try {
        const result = await openAIJSON('Generate a simple JSON with a greeting message');
        console.log('Result:', result);
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

test();