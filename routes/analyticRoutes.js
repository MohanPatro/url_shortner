const express=require('express');

const router=express.Router();

const rateLimit=require('express-rate-limit');

const middlewares=require('../middlewares/googleAuthMiddleWare');

const analyticControllers=require('../controllers/analyticControllers');



router.get('/analytics/:alias',middlewares.authenticateJWT,analyticControllers.getUrlAnalytics);

router.get('/analytics/topic/:topic',middlewares.authenticateJWT,analyticControllers.getTopicAnalytics );

router.get('/analytic/user/overall',middlewares.authenticateJWT,analyticControllers.getOverAllAnalytics2);


module.exports=router
