import getBlogs from 'src/data-functions/getBlogs/route';
import getJobs from 'src/data-functions/getJobs/route';
import getReviews from 'src/data-functions/getReviews/route';
import getTraffic from 'src/data-functions/getTraffic/route';
import getAds from 'src/data-functions/getAds/route';

export default async function getCompData(keyword, isAll = false, keywordList = []) {
    if (isAll) {
        const results = await Promise.all(keywordList.map(async (kw) => {
            const [blogs, jobs, reviews, ads] = await Promise.all([
                getBlogs(kw),
                getJobs(kw),
                getReviews(kw),
                getAds(kw)
            ]);
            return { BLOGS: blogs, JOBS: jobs, REVIEWS: reviews, ADS: ads };
        }));

        const traffic = await getTraffic(keywordList);

        // Combine results
        const combinedResults = results.reduce((acc, result) => {
            acc.BLOGS.push(...result.BLOGS);
            acc.JOBS.push(...result.JOBS);
            acc.REVIEWS.push(...result.REVIEWS);
            acc.ADS.push(...result.ADS);
            return acc;
        }, { BLOGS: [], JOBS: [], REVIEWS: [], ADS: [] });

        combinedResults.TRAFFIC = traffic;

        console.log('Combined Results:', combinedResults);
        return combinedResults;

    } else {
        const [blogs, jobs, reviews, traffic, ads] = await Promise.all([
            getBlogs(keyword),
            getJobs(keyword),
            getReviews(keyword),
            [], // getTraffic([keyword]), 
            getAds(keyword),
            // [], [], [], [], []
        ]);

        console.log('Blogs:', blogs, 'Jobs:', jobs, 'Reviews:', reviews, 'Traffic:', traffic, 'Ads:', ads);
        return { BLOGS: blogs, JOBS: jobs, REVIEWS: reviews, TRAFFIC: traffic, ADS: ads };
    }
}