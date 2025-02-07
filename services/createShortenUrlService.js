const Url=require('../models/UrlSchema');
const redisClient=require('../config/redisConnection')

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

exports.createShortUrl=  async (longUrl,userId, customAlias, topic) =>{
    const alias = await this.generateUniqueAlias(customAlias);

    const newUrl = new Url({
        longUrl,
        alias,
        userId,
        topic
    });

    await newUrl.save();
    await redisClient.set(`url:${alias}`, longUrl, 'EX', 86400); // 24-hour cache

    await redisClient.del(`overallAnalytics:${userId}`);
    await redisClient.del(`topicAnalytics:${userId}:${topic}`);

    return {
        shortUrl: `${process.env.BASE_URL}/shorten/${alias}`,
        alias,
        createdAt: newUrl.createdAt
    };
}