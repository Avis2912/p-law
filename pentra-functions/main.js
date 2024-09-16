const weeklyPostsFunction = require('./weeklyPostsFunction');
const weeklyBlogsFunction = require('./weeklyBlogFunction');

exports.generateWeeklyPosts = weeklyPostsFunction.generateWeeklyPosts;
exports.manuallyTriggerWeeklyPosts = weeklyPostsFunction.manuallyTriggerWeeklyPosts;

exports.generateWeeklyBlogs = weeklyBlogsFunction.generateWeeklyBlogs;
exports.manuallyTriggerWeeklyBlogs = weeklyBlogsFunction.manuallyTriggerWeeklyBlogs;