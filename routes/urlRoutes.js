const express=require('express');

const router=express.Router();

const rateLimit=require('express-rate-limit');

const middlewares=require('../middlewares/googleAuthMiddleWare');

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });

  
const urlControllers=require('../controllers/urlControllers');


router.post('/shorten',middlewares.authenticateJWT, rateLimiter,urlControllers.shortenUrl );

router.get('/shorten/:alias',urlControllers.redirectUrl);


module.exports=router
