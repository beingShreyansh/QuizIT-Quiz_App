const jwt = require("jsonwebtoken");

const SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    if (!userId) {
      reject(new Error("Invalid userId"));
      return;
    }

    const payload = {
      userId: userId,
    };

    const options = {
      expiresIn: "1h",
      issuer: "quiz_it",
      audience: userId.toString(),
    };

    jwt.sign(payload, SECRET, options, (err, token) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Invalid Authorization Header");
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        throw new Error("Invalid Token");
      }
      req.payload = payload;
      next();
    });
  } catch (error) {
    console.error("Authorization Error:", error);
    res.status(401).json({ error: "Not Authorized" });
  }
};

module.exports = { signAccessToken, verifyAccessToken };
