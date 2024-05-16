const express = require("express");
const router = express.Router();
const allSurvey = require("../controller/survey.js");

router.use("/surveys", allSurvey);

module.exports = router;
