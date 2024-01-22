const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;

  const ifExist = await User.find({
    username,
  });
  if (ifExist.length >= 1) {
    res.json({
      msg: "User already Exist",
    });
  } else {
    User.create({
      username,
      password,
    });
    res.json({
      msg: "User Created Succesfully",
    });
  }
});

router.get("/courses", userMiddleware, async (req, res) => {
  // Implement listing all courses logic
  const allCourses = await Course.find({});
  res.json({
    courses: allCourses,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;
  const ifCourseExist = await Course.findOne({
    _id: courseId,
  });
  if (ifCourseExist) {
    await User.updateOne(
      { username },
      {
        $push: { purchasedCourses: courseId },
      }
    );
    res.json({
      msg: "Course Purchased",
    });
  } else {
    res.json({
      msg: "Invalid Course Id",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.headers.username;
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
