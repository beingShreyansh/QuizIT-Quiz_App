const express = require("express");
const cors = require("cors"); // Import the CORS middleware
const router = express.Router();
const { redirectToDashboard } = require("../controllers/authControllers");

const {
  createUser,
  loginUser,
  logoutUser,
  handleSendOTP,
  handleVerifyOTP,
  getSignedObjectUrlToPut
} = require("../controllers/authControllers");

const { verifyAccessToken } = require("../controllers/jwtController");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Define your authentication routes here
router.post("/login", loginUser);
router.post("/register", createUser);
router.post("/send-otp", handleSendOTP);
router.post("/verify-otp", handleVerifyOTP);
router.get("/logout", logoutUser);
router.get("/get-signed-url",getSignedObjectUrlToPut)
router.get("/", verifyAccessToken, redirectToDashboard);

module.exports = router;
