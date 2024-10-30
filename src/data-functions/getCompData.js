import getBlogs from 'src/data-functions/getBlogs/getBlogs';
import getJobs from 'src/data-functions/getJobs/getJobs';
import getReviews from 'src/data-functions/getReviews/getReviews';
import getTraffic from 'src/data-functions/getTraffic/getTraffic';
import getAds from 'src/data-functions/getAds/getAds';

export default async function getCompData(keyword, isAll = false, keywordList = []) {
    try {
        if (isAll) {
            // Wait for all keyword-based requests to complete
            const results = await Promise.all(keywordList.map(async (kw) => {
                try {
                    const [blogs, jobs, reviews, ads] = await Promise.all([
                        getBlogs(kw),
                        getJobs(kw),
                        getReviews(kw),
                        getAds(kw)
                    ]);
                    return { BLOGS: blogs, JOBS: jobs, REVIEWS: reviews, ADS: ads };
                } catch (error) {
                    console.error(`Error fetching data for keyword ${kw}:`, error);
                    return { BLOGS: [], JOBS: [], REVIEWS: [], ADS: [] };
                }
            }));

            // Wait for traffic data
            const traffic = await getTraffic(keywordList);

            // Combine results after all promises are resolved
            const combinedResults = results.reduce((acc, result) => {
                acc.BLOGS.push(...(result.BLOGS || []));
                acc.JOBS.push(...(result.JOBS || []));
                acc.REVIEWS.push(...(result.REVIEWS || []));
                acc.ADS.push(...(result.ADS || []));
                return acc;
            }, { BLOGS: [], JOBS: [], REVIEWS: [], ADS: [] });

            combinedResults.TRAFFIC = traffic;

            console.log('Combined Results:', combinedResults);
            return combinedResults;

        } else {
            // Wait for all single keyword requests to complete
            const [blogs, jobs, reviews, traffic, ads] = await Promise.all([
                // getBlogs(keyword),
                // getJobs(keyword),
                // getReviews(keyword),
                // getTraffic([keyword]),
                getAds(keyword),
                [], [], [], [],
            ]);

            const results = { 
                BLOGS: blogs || [], 
                JOBS: jobs || [], 
                REVIEWS: reviews || [], 
                TRAFFIC: traffic, 
                ADS: ads || [] 
            };

            console.log('Results:', results);
            return results;
        }
    } catch (error) {
        console.error('Error in getCompData:', error);
        throw error;
    }
}