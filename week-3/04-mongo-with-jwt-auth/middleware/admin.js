// Middleware for handling auth
const { Admin, Course } = require("../db");
const jwt = require("jsonwebtoken");
const secretKey = require("../secret");
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected

  try {
    const head = req.headers.authorization;
    const splitBearer = head.split(" ");
    const token = splitBearer[1];
    const decode = jwt.verify(token, secretKey);
    if (decode) {
      const admin = await Admin.findOne({
        username: decode.username,
      });
      if (admin) {
        next();
      } else {
        res.json({
          msg: "Admin Didn't Exist",
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

module.exports = adminMiddleware;
