const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://mohamedashif18se:ashif123@cluster0.6bj0hal.mongodb.net/mongo_with_auth"
);

// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const JwtSchema = new mongoose.Schema({
  username: String,
  password: String,
  token: String,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);
const Jwt = mongoose.model("Jwt", JwtSchema); //just for Testing Convinience

module.exports = {
  Admin,
  User,
  Course,
  Jwt,
};
