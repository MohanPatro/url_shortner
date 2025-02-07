const createShortenUrlService=require('../services/createShortenUrlService');

const redirectUrlService=require('../services/redirectUrlService');


const redisClient=require('../config/redisConnection')



exports.shortenUrl=async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;
    try {
      const result = await createShortenUrlService.createShortUrl(
        longUrl, 
        req.user._id, 
        customAlias, 
        topic
      ); 
      
      
      await redisClient.del(`overallAnalytics:${req.user._id}`);
      await redisClient.del(`topicAnalytics:${req.user._id}:${topic}`);
  
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
}

  exports.redirectUrl= async (req, res) => {
    try {
      const longUrl = await redirectUrlService.resolveAndTrackRedirect(req.params.alias, req);

      await redisClient.del(`urlAnalytics:${req.params.alias}`);



      res.redirect(longUrl);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
