const redis=require('redis');
const geoip = require('geoip-lite');
const os = require('os');
const { getClicksByDate, getOSAnalytics, getDeviceAnalytics, getUniqueUsersCount } = require('../helpers/Analytichelpers');

// const redisClient = redis.createClient();
const redisClient=require('../config/redisConnection');
const Url=require('../models/UrlSchema');


exports.getOverallAnalytics = async (userId) => {
  const urls = await Url.find({ userId });

  if (!urls.length) {
      throw new Error('No URLs found for the user.');
  }

  const totalRedirects = [];
  const uniqueUsersSet = new Set();
  const clicksByDateMap = new Map();
  const osAnalyticsMap = new Map();
  const deviceAnalyticsMap = new Map();

  const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  for (const url of urls) {
      for (const redirect of url.redirects) {
          totalRedirects.push(redirect);
          uniqueUsersSet.add(redirect.ipAddress);

          // Clicks by Date (Recent 7 Days)
          if (redirect.timestamp > last7Days) {
              const date = redirect.timestamp.toISOString().split('T')[0];
              clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + 1);
          }

          // OS Analytics
          const os = redirect.osType || 'Unknown';
          if (!osAnalyticsMap.has(os)) {
              osAnalyticsMap.set(os, { uniqueClicks: 0, uniqueUsers: new Set() });
          }
          const osData = osAnalyticsMap.get(os);
          osData.uniqueClicks++;
          osData.uniqueUsers.add(redirect.ipAddress);

          // Device Analytics
          const device = redirect.deviceType || 'Unknown';
          if (!deviceAnalyticsMap.has(device)) {
              deviceAnalyticsMap.set(device, { uniqueClicks: 0, uniqueUsers: new Set() });
          }
          const deviceData = deviceAnalyticsMap.get(device);
          deviceData.uniqueClicks++;
          deviceData.uniqueUsers.add(redirect.ipAddress);
      }
  }

  return {
      totalUrls: urls.length,
      totalClicks: totalRedirects.length,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate: Array.from(clicksByDateMap, ([date, count]) => ({ date, count })),

      osType: Array.from(osAnalyticsMap, ([osName, data]) => ({
          osName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size
      })),

      deviceType: Array.from(deviceAnalyticsMap, ([deviceName, data]) => ({
          deviceName,
          uniqueClicks: data.uniqueClicks,
          uniqueUsers: data.uniqueUsers.size
      }))
  };
};




  // exports.getUrlAnalyticsasync=async (alias)=> {
  //   const url = await Url.findOne({ alias });
  //   if (!url) throw new Error('URL not found');

  //   const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  //   const recentRedirects = url.redirects.filter(r => r.timestamp > last7Days);

  //   const clicksByDate = recentRedirects.reduce((acc, redirect) => {
  //     const date = redirect.timestamp.toISOString().split('T')[0];
  //     acc[date] = (acc[date] || 0) + 1;
  //     return acc;
  //   }, {});

  //   const osAnalytics = recentRedirects.reduce((acc, redirect) => {
  //     const os = redirect.osType;
  //     if (!acc[os]) acc[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
  //     acc[os].uniqueClicks++;
  //     acc[os].uniqueUsers.add(redirect.ipAddress);
  //     return acc;
  //   }, {});
  //   const deviceAnalytics = recentRedirects.reduce((acc, redirect) => {
  //     const device = redirect.deviceType;
  //     if (!acc[device]) acc[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
  //     acc[device].uniqueClicks++;
  //     acc[device].uniqueUsers.add(redirect.ipAddress);
  //     return acc;
  //   }, {});

  //   return {
  //     totalClicks: url.redirects.length,
  //     uniqueUsers: new Set(url.redirects.map(r => r.ipAddress)).size,
  //     clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),
  //     osType: Object.entries(osAnalytics).map(([osName, data]) => ({
  //       osName,
  //       uniqueClicks: data.uniqueClicks,
  //       uniqueUsers: data.uniqueUsers.size
  //     })),
  //     deviceType: Object.entries(deviceAnalytics).map(([deviceName, data]) => ({
  //       deviceName,
  //       uniqueClicks: data.uniqueClicks,
  //       uniqueUsers: data.uniqueUsers.size
  //     }))
  //   };
  // }



  exports.getUrlAnalytics = async (alias) => {
    const url = await Url.findOne({ alias });
    if (!url) throw new Error('URL not found');
  
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentRedirects = url.redirects.filter(r => r.timestamp > last7Days);
  
    // Pre-fill clicksByDate with the last 7 days
    const clicksByDate = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      clicksByDate[date] = 0;
    }
  
    const osAnalytics = {};
    const deviceAnalytics = {};
    const uniqueUsers = new Set();
    const totalUniqueUsers = new Set(url.redirects.map(r => r.ipAddress));
  
    // Single loop for all analytics
    recentRedirects.forEach(redirect => {
      const date = redirect.timestamp.toISOString().split('T')[0];
      const os = redirect.osType || 'Unknown OS';
      const device = redirect.deviceType || 'Unknown Device';
      const ip = redirect.ipAddress;
  
      // Date-based clicks
      if (clicksByDate[date] !== undefined) {
        clicksByDate[date]++;
      }
  
      // OS Analytics
      if (!osAnalytics[os]) {
        osAnalytics[os] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      osAnalytics[os].uniqueClicks++;
      osAnalytics[os].uniqueUsers.add(ip);
  
      // Device Analytics
      if (!deviceAnalytics[device]) {
        deviceAnalytics[device] = { uniqueClicks: 0, uniqueUsers: new Set() };
      }
      deviceAnalytics[device].uniqueClicks++;
      deviceAnalytics[device].uniqueUsers.add(ip);
  
      // Global Unique Users
      uniqueUsers.add(ip);
    });
  
    return {
      totalClicks: url.redirects.length,
      uniqueUsers: totalUniqueUsers.size,
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
  };
  



  exports.getTopicAnalytics = async (topic) => {
    const urls = await Url.find({topic });

    if (!urls.length) {
        throw new Error('No URLs found for the given topic.');
    }

    const totalRedirects = [];
    const uniqueUsersSet = new Set();
    const clicksByDateMap = new Map();
    
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const url of urls) {
        for (const redirect of url.redirects) {
            totalRedirects.push(redirect);
            uniqueUsersSet.add(redirect.ipAddress);

            // Filter recent redirects (last 7 days)
            if (redirect.timestamp > last7Days) {
                const date = redirect.timestamp.toISOString().split('T')[0];
                clicksByDateMap.set(date, (clicksByDateMap.get(date) || 0) + 1);
            }
        }
    }

    return {
        totalClicks: totalRedirects.length,
        uniqueUsers: uniqueUsersSet.size,
        clicksByDate: Array.from(clicksByDateMap, ([date, count]) => ({ date, count })),
        urls: urls.map(url => ({
            shortUrl: `${process.env.BASE_URL}/${url.alias}`,
            totalClicks: url.redirects.length,
            uniqueUsers: new Set(url.redirects.map(r => r.ipAddress)).size
        }))
    };
};


  exports.resolveAndTrackRedirect = async (alias, req) => {
    let longUrl = await redisClient.get(`url:${alias}`);
  
    // Fetch from DB if not cached
    if (!longUrl) {
      const url = await Url.findOne({ alias });
      if (!url) throw new Error('URL not found');
  
      longUrl = url.longUrl;
      await redisClient.set(`url:${alias}`, longUrl, 'EX', 86400); // Cache for 1 day
    }
  
    // Tracking analytics regardless of cache
    const geo = geoip.lookup(req.ip);
    const userAgent = req.headers['user-agent'];
  
    const trackingData = {
      timestamp: new Date(),
      ipAddress: req.ip,
      userAgent: userAgent,
      osType: os.type(),
      deviceType: req.useragent?.isMobile ? 'mobile' : 'desktop',
      location: geo ? {
        country: geo.country,
        city: geo.city
      } : {}
    };
  
    // Update analytics only in the database
    await Url.updateOne(
      { alias },
      { $push: { redirects: trackingData } }
    );
  
    return longUrl;
  };

exports.generateUniqueAlias= async (customAlias)=> {
    if (customAlias) {

      const existingUrl = await Url.findOne({ alias: customAlias });

      if (existingUrl) throw new Error('Custom alias already exists');

      return customAlias;
    }
    
    const generateRandomAlias = () => Math.random().toString(36).substring(2, 8);

    let alias = generateRandomAlias();

    while (await Url.findOne({ alias })) {
      alias = generateRandomAlias();
    }

    return alias;
  }

exports.createShortUrl=  async (longUrl, customAlias, topic) =>{
    const alias = await this.generateUniqueAlias(customAlias);

    const newUrl = new Url({
        longUrl,
        alias,
        // userId,
        topic
    });

    await newUrl.save();
    await redisClient.set(`url:${alias}`, longUrl, 'EX', 86400); // 24-hour cache

    return {
        shortUrl: `${process.env.BASE_URL}/shorten/${alias}`,
        alias,
        createdAt: newUrl.createdAt
    };
}