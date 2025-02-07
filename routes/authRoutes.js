const express=require('express');

const router=express.Router();
const authControllers=require('../controllers/authControllers')
const passport = require('passport');
require('../auth/googleAuth'); 




router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);


router.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
    authControllers.googleAuthCallback
  );


  
router.get("/login-failed", authControllers.loginFailed);


module.exports=router;
  