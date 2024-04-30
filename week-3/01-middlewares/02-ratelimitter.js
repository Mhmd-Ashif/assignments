const request = require("supertest");
const assert = require("assert");
const express = require("express");
const app = express();
// You have been given an express server which has a few endpoints.
// Your task is to create a global middleware (app.use) which will
// rate limit the requests from a user to only 5 request per second
// If a user sends more than 5 requests in a single second, the server
// should block them with a 404.
// User will be sending in their user id in the header as 'user-id'
// You have been given a numberOfRequestsForUser object to start off with which
// clears every one second

let validity = 5;

let numberOfRequestsForUser = {};
setInterval(() => {
  numberOfRequestsForUser = {};
  validity = 5;
}, 1000);

app.use(function (req, res, next) {
  let userId = req.header.userid;
  numberOfRequestsForUser.userId = userId;
  numberOfRequestsForUser.validity = validity;
  if (numberOfRequestsForUser.validity <= 0) {
    throw new Error("maximum request hitted");
  } else {
    validity--;
  }
  next();
});

app.get("/user", function (req, res) {
  res.status(200).json({ name: "john" });
});

app.post("/user", function (req, res) {
  res.status(200).json({ msg: "created dummy user" });
});

app.use(function (err, req, res, next) {
  res.status(404).json({
    msg: "404",
  });
});

module.exports = app;
