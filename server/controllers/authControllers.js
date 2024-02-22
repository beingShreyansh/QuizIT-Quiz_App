const bcrypt = require("bcrypt");
const User = require("../models/User");
const { signAccessToken } = require("./jwtController");

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOneByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User instance with role based on request or default to 'user'
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    // Save the user to the database
    const userId = await newUser.save();

    // Generate JWT access token
    const accessToken = await signAccessToken(userId);

    // Respond with user ID, role, and access token
    res.status(201).json({ userId, role: newUser.role, accessToken });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to register user" });
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
      return res
        .status(201)
        .json({
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

module.exports = { createUser, loginUser, logoutUser, redirectToDashboard };
