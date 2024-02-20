const express = require("express");
const router = express.Router();
const { redirectToDashboard } = require("../controllers/authControllers");

const {
  createUser,
  loginUser,
  logoutUser,
} = require("../controllers/authControllers");

const { verifyAccessToken } = require("../controllers/jwtController");

// Define your authentication routes here
router.post("/login", loginUser);
router.post("/register", createUser);
router.get("/logout", logoutUser);
router.get("/", verifyAccessToken, redirectToDashboard);
module.exports = router;
