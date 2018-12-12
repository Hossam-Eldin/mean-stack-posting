const jwt = require("jsonwebtoken");



module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, "secret_this_should_be_longer");
      //return the encoded data for user from the token
      req.userData ={email: decodedToken.email, userId: decodedToken.userId}
      next();
    } catch (error) {
      res.status(401).json({ message: "You are not Authenticated!" });
    }
  };