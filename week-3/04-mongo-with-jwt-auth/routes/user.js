const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Jwt, Course } = require("../db");
const jwt = require("jsonwebtoken");
const secretKey = require("../secret");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  await User.create({
    username,
    password,
  });
  res.json({
    msg: "user created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  let token = jwt.sign({ username }, secretKey);
  token = "Bearer " + token;
  await Jwt.create({
    username,
    password,
    token,
  });
  res.json({
    token: token,
  });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const allCourses = await Course.find({});
  res.json({
    courses: allCourses,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const purchaseCourse = await Course.findOne({
    _id: courseId,
  });
  if (purchaseCourse) {
    await User.updateOne(
      {
        username: req.name,
      },
      {
        $push: { purchasedCourses: courseId },
      }
    );
    res.json({
      msg: "Course Purchased Successfully",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.name;
  const user = await User.findOne({
    username,
  });
  const purchased = await Course.find({
    _id: { $in: user.purchasedCourses },
  });
  res.json({
    purchasedCourses: purchased,
  });
});

module.exports = router;
