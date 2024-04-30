const { User } = require("../db");
const jwt = require("jsonwebtoken");
const secretKey = require("../secret");
async function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
  const head = req.headers.authorization;
  const splitBearer = head.split(" ");
  const token = splitBearer[1];

  try {
    const decode = jwt.verify(token, secretKey);
    if (decode) {
      const user = await User.findOne({
        username: decode.username,
      });
      if (user) {
        req.name = decode.username;
        next();
      } else {
        res.json({
          msg: "user Didn't Exist",
        });
      }
    } else {
      res.json({
        msg: "Invalid Token",
      });
    }
  } catch (error) {
    res.json({
      msg: error,
    });
  }
}
module.exports = userMiddleware;
