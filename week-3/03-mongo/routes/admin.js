const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes

router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  const username = req.body.username;
  const password = req.body.password;
  const ifExist = await Admin.find({
    username: username,
  });
  if (ifExist.length >= 1) {
    res.json({
      msg: "Admin Already Exist",
    });
  } else {
    Admin.create({
      username: username,
      password: password,
    });
    res.json({
      message: "Admin created successfully",
    });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  //taking inputs
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const imageLink = req.body.imageLink;
  const published = req.body.published;

  const createCourse = await Course.create({
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  });

  res.json({
    message: "Course created successfully",
    courseId: createCourse._id,
  });
});

router.get("/courses", adminMiddleware, async (req, res) => {
  // Implement fetching all courses logic
  const allCourses = await Course.find({});
  res.json({
    courses: allCourses,
  });
});

module.exports = router;
