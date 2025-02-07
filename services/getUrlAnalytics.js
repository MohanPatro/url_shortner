const { getClicksByDate, getOSAnalytics, getDeviceAnalytics, getUniqueUsersCount } = require('../helpers/Analytichelpers');
const Url=require('../models/UrlSchema');
const redisClient=require('../config/redisConnection')

exports.getUrlAnalytics = async (alias,userId) => {



   
  const url = await Url.findOne({ alias,userId});


  if (!url) throw new Error('URL not found');

    const cacheKey = `urlAnalytics:${alias}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        console.log('Cache Hit!');
        return JSON.parse(cachedData);
    }

  

  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const clicksByDate = getClicksByDate(url.redirects, last7Days);
  const osAnalytics = getOSAnalytics(url.redirects, last7Days);
  const deviceAnalytics = getDeviceAnalytics(url.redirects, last7Days);

  const data= {
    totalClicks: url.redirects.length,

    uniqueUsers: getUniqueUsersCount(url.redirects),

    clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),


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
