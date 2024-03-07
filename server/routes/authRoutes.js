const express = require("express");
const cors = require("cors");
const multer = require("multer");
const router = express.Router();
const {
  redirectToDashboard,
  createUser,
  loginUser,
  logoutUser,
  handleSendOTP,
  handleVerifyOTP,
  handleProfileImageUpload,
} = require("../controllers/authControllers");

const { verifyAccessToken } = require("../controllers/jwtController");

const app = express();

app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/login", loginUser);
router.post("/register", upload.single("profileImage"), createUser);
router.post("/send-otp", handleSendOTP);
router.post("/verify-otp", handleVerifyOTP);
router.post(
  "/upload-profile-image",
  upload.single("profileImage"),
  handleProfileImageUpload
);
router.get("/logout", logoutUser);
router.get("/", verifyAccessToken, redirectToDashboard);

module.exports = router;
