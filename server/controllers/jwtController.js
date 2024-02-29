const jwt = require("jsonwebtoken");

const SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId === undefined || userId === null) {
      reject("Invalid userId");
      return;
    }

    const payload = {}; // Use const to declare payload

    const options = {
      expiresIn: "1h",
      issuer: "quiz_it", // Set issuer directly in options
      audience: userId.toString(), // Convert userId to string
    };

    jwt.sign(payload, SECRET, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next("Not Authorized");
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, SECRET, (err, payload) => {
    if (err) return next("Not authorized1");
    req.payload = payload;
    next();
  });
};


module.exports = { signAccessToken, verifyAccessToken };
