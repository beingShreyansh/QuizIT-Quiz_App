const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signAccessToken } = require("./jwtController");
const sendMail = require("../helpers/sendMail");
const randomstring = require("randomstring");
const { getObjectUrl, putObject } = require("../awsConfig");
const { v4: uuidv4 } = require("uuid");
const {db}=require('../dbConfig')

// Memory storage for OTPs
const otpMemory = {};

const createUser = async (req, res) => {
  try {
    const { name, email, password, isEmailVerified } = req.body; // Destructure directly from req.body

    // Check if user with the same email already exists
    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    if (!isEmailVerified) {
      return res.status(410).json({ error: "Email not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with default role 'user'
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    const userId = await newUser.save();

    // Generate JWT access token
    const accessToken = await signAccessToken(userId);

    // Respond with user ID, role, and access token
    res.status(201).json({ userId, accessToken });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};


function generateRandomOTP(length) {
  const charset = "0123456789";
  let randomOTP = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomOTP += charset[randomIndex];
  }
  return randomOTP;
}

const handleSendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the email is defined and not empty
    if (!email || typeof email !== "string" || email.trim() === "") {
      console.error("Recipient's email is not defined or invalid:", email);
      throw new Error("Recipient's email is not defined");
    }

    // Log the email before sending

    // Generate a random OTP
    const randomOTP = generateRandomOTP(6);

    // Log the generated OTP

    // Send OTP to the user's email
    let mailSubject = "OTP for Email Verification";
    const content = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body {
        font-family: 'Arial', sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .header {
        background-color: #3498db;
        color: #ffffff;
        padding: 20px;
        text-align: center;
      }

      .header h1 {
        margin: 0;
      }

      .otp {
        font-size: 24px;
        font-weight: bold;
        color: #3498db;
        margin: 20px 0;
      }

      .instructions {
        font-size: 16px;
        margin-bottom: 20px;
      }

      .footer {
        text-align: center;
        color: #95a5a6;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Email Verification OTP</h1>
      </div>
      <div class="otp">
        Your OTP: <span>${randomOTP}</span>
      </div>
      <div class="instructions">
        <p>Please use the above OTP to verify your email address.</p>
        <p>This OTP is valid for 5 minutes.</p>
      </div>
      <div class="footer">
        <p>Thank you for choosing our service!</p>
      </div>
    </div>
  </body>
  </html>
`;

    // Now use this 'content' variable in your sendMail function

    // Log the content before sending

    // Ensure email is defined before sending
    await sendMail(email, mailSubject, content);

    // Save the OTP and its expiry time in memory
    const otpData = {
      email: email,
      otp: randomOTP,
      expiryTime: Date.now() + 5 * 60 * 1000, // 5 minutes expiry time
    };
    otpMemory[email] = otpData;

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

const handleVerifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    // Check if the user exists

    // Check if the OTP and its data exist in memory
    const otpData = otpMemory[email];
    if (!otp) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    // Check if the provided OTP matches the saved OTP
    if (otp === otpData.otp && Date.now() < otpData.expiryTime) {
      // Clear the OTP after successful verification
      delete otpMemory[email];

      res.status(200).json({ message: "Verification email sent successfully" });
    } else {
      res.status(401).json({ error: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ error: "Failed to verify OTP", details: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const existingUser = await User.findOneByEmail(email);

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (passwordMatch) {
      // Generate JWT access token with existingUser.id as userId
      const accessToken = await signAccessToken(existingUser.id);

      // Respond with user ID, role, and access token
      return res.status(201).json({
        userId: existingUser.id,
        role: existingUser.role,
        accessToken,
      });
    } else {
      // Password does not match
      return res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

const logoutUser = (req, res) => {
  // Implement logout logic here
  // For simplicity, responding with a success message
  res.status(200).json({ message: "Logout successful" });
};

const redirectToDashboard = (req, res) => {
  // Assuming you have a role property in req.payload
  const userRole = req.payload.role;

  if (userRole === "admin") {
    res.redirect("/admin");
  } else {
    res.redirect("/");
  }
};

const getSignedObjectUrlToPut = async (req, res) => {
  try {
    const { fileName, contentType } = req.query;
    const key = uuidv4();
    const signedUrl = await putObject(key, contentType);
    res.json({ signedUrl, imageId: key });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    // Fetch the user's hashed password from the database using userId
    const user = await User.findOneById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided current password with the user's stored password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }

    // Update user's password
    await User.updatePassword(userId, newPassword);

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Failed to change password" });
  }
};
const forgetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if email and newPassword are provided
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email and new password are required" });
    }

    // Update password in the database using email
    await User.updatePasswordByEmail(email, newPassword);

    // Respond with success message
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


const uploadImageId =  (req, res) => {
  const { userId } = req.body;
  const { imageId } = req.params;

  try {
    // Update imageId for the user
    const updateQuery = "UPDATE user SET imageId = ? WHERE id = ?";
     db.query(updateQuery, [imageId, userId]);

    res.send("Image ID updated successfully");
  } catch (error) {
    console.error("Error updating image ID:", error);
    res.status(500).send("Internal server error");
  }
};


module.exports = {
  createUser,
  loginUser,
  logoutUser,
  redirectToDashboard,
  handleSendOTP,
  handleVerifyOTP,
  getSignedObjectUrlToPut,
  changePassword,
  uploadImageId,
  forgetPassword,
};
