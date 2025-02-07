
const getUrlAnalyticsService=require('../services/getUrlAnalytics');

const getOverAllAnalyticsService=require('../services/getOverAllAnalyticsService');

const getTopicAnalyticsService=require('../services/getTopicAnalyticsService');


const redisClient=require('../config/redisConnection')




exports.getUrlAnalytics= async (req, res) => {
    try {
      const analytics = await getUrlAnalyticsService.getUrlAnalytics(req.params.alias,req.user._id);
      res.json(analytics);
    } catch (error) {
      res.status(404).json({ error: error.message,msg:error });
    }
  }



  exports.getTopicAnalytics=async (req, res) => {
    try {
      const analytics = await getTopicAnalyticsService.getTopicAnalytics(req.user._id,req.params.topic);
      res.json(analytics);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }




  exports.getOverAllAnalytics2= async (req, res) => {
    try {
      const analytics = await getOverAllAnalyticsService.getOverallAnalytics(req.user._id);
      res.json(analytics);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }