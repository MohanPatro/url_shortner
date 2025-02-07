const { getClicksByDate, getOSAnalytics, getDeviceAnalytics, getUniqueUsersCount } = require('../helpers/Analytichelpers');

const Url=require('../models/UrlSchema');

const redisClient=require('../config/redisConnection')

exports.getTopicAnalytics = async (userId, topic) => {

    const cacheKey = `topicAnalytics:${userId}:${topic}`;

    // Check Cache First
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Cache Hit!');
      return JSON.parse(cachedData);
    }
  

  const urls = await Url.find({ userId,topic});
  const totalRedirects = urls.flatMap(url => url.redirects);

  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const clicksByDate = getClicksByDate(totalRedirects, last7Days);
  const osAnalytics = getOSAnalytics(totalRedirects, last7Days);
  const deviceAnalytics = getDeviceAnalytics(totalRedirects, last7Days);


 const data={

    totalClicks: totalRedirects.length,

    uniqueUsers: getUniqueUsersCount(totalRedirects),

    clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),
    urls: urls.map(url => ({
      shortUrl: `${process.env.BASE_URL}/${url.alias}`,
      totalClicks: url.redirects.length,
      uniqueUsers: new Set(url.redirects.map(r => r.ipAddress)).size
    })),


    osType: Object.entries(osAnalytics).map(([osName, data]) => ({
      osName,
      uniqueClicks: data.uniqueClicks,
      uniqueUsers: data.uniqueUsers.size
    })),


    deviceType: Object.entries(deviceAnalytics).map(([deviceName, data]) => ({
      deviceName,
      uniqueClicks: data.uniqueClicks,
      uniqueUsers: data.uniqueUsers.size
      
    }))
  };


  await redisClient.setEx(cacheKey, 600, JSON.stringify(data));


  return data;

};
