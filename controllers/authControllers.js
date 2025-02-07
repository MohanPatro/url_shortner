const jwt=require('jsonwebtoken');





exports.googleAuthCallback= async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect("/login-failed");
      }

      const payload = { _id: req.user._id };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

      // Redirecting to the docs page with the token
      res.redirect(`/docs?token=${token}&name=${encodeURIComponent(req.user.displayName)}`);
      
    } catch (error) {

      console.error("Error during Google authentication callback:", error);

      res.status(500).json({ message: "Internal Server Error" });
      
    }
  }


  exports.loginFailed=(req, res) => {
    res.status(401).json({ message: "Google Login Failed" });
  }