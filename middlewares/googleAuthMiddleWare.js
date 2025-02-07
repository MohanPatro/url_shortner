
const User=require('../models/UserSchema');
const {OAuth2Client}=require('google-auth-library')
const jwt=require('jsonwebtoken');

// const googleClient = new OAuth2Client(process.env.client_id);

exports.ensureAuthenticated=(req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed
  }
  req.session.returnTo = req.originalUrl; // Store the original URL
  res.redirect('/auth/google'); // Redirect to the login page if not authenticated
}


exports.authenticateJWT = (req, res, next) => {
  console.log("hi i am jwt")

  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];  // Bearer <token>
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
        // throw new Error("please login with your email")

      }
      req.user = user;
      next();
    });
  } else {
    // res.sendStatus(401); // No token provided
    throw new Error("please login with your email")
  }
};






