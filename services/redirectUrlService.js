
const Url=require('../models/UrlSchema');
const geoip = require('geoip-lite');
const os = require('os');
const redisClient=require('../config/redisConnection');


exports.resolveAndTrackRedirect = async (alias, req) => {
    let longUrl = await redisClient.get(`url:${alias}`);
  
    let url= await Url.findOne({ alias });

    if (!longUrl) {
        

      if (!url) throw new Error('URL not found');
  
      longUrl = url.longUrl;
      await redisClient.set(`url:${alias}`, longUrl, 'EX', 86400); // Cache for 1 day
    }




    if(url)
    {
        await redisClient.del(`overallAnalytics:${url.userId}`);
        await redisClient.del(`topicAnalytics:${url.userId}:${url.topic}`);
    }

        
    
  
 

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


      await Url.updateOne(
      { alias},
      { $push: { redirects: trackingData } }
    );
  
    return longUrl;
  };