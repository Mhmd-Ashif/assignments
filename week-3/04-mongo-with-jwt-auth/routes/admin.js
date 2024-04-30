const { Router } = require("express");
const jwt = require("jsonwebtoken");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course, Jwt } = require("../db");
const router = Router();
const secretKey = require("../secret");
// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  await Admin.create({
    username,
    password,
  });
  res.json({
    msg: "Admin Created Successfully",
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

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published,
  });

  res.json({
    msg: "Course Create Successfully",
    courseId: course._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const allCourses = await Course.find({});
  res.json({
    Courses: allCourses,
  });
});

module.exports = router;
