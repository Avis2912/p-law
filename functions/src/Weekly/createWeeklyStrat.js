// GET CURRENTLY RANKING FOR
// CREATE LONG TERM STRATEGY IF DOESN'T EXIST
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

import { getDoc, doc, updateDoc } from '@firebase/firestore';
import { useState, useCallback } from 'react';
import { db, auth } from 'src/firebase-config/firebase';

export const createWeeklyStrat = async (firmName) => {

}

export default createWeeklyStrat;
