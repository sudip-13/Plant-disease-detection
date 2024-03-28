const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const secret = process.env.JWT_secret
const signToken = (username, email, avatar) => {
    return jwt.sign(
      {
        username: username,
        email: email,
        avatar: avatar,
      },
      secret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
  };
  const createAndSendToken = (user, statusCode, res) => {
    const token = signToken({
      email: user.email,
      avatar: user.avatarUrl,
      FullName: user.FullName
    });
    if (user.password) user.password = undefined;
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    cookieOptions.secure = true;
    res.cookie("cookie-1", token, cookieOptions);
    res.status(statusCode).json({
      status: "success",
      token: token,
    });
  };

  async function verifyToken(req, res, next) {
    const {token} = req.body;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized user" });
    }
  
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      } else {
        res.status(200);
      }
      req.user = user;
      next();
    });
  }
  module.exports ={createAndSendToken,verifyToken}