const jwt = require("jsonwebtoken");

const SECRET = process.env.ACCESS_TOKEN_JWT_SECRET;

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId === undefined || userId === null) {
      reject("Invalid userId");
      return;
    }

    const payload = {};

    const options = {
      expiresIn: "1h",
      issuer: "quiz_it",
      audience: userId.toString(),
    };

    jwt.sign(payload, SECRET, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  try {
    if (!req.headers["authorization"]) {
      throw new Error("Not Authorized");
    }

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");

    if (bearerToken.length !== 2 || bearerToken[0] !== "Bearer") {
      throw new Error("Invalid Authorization Header");
    }

    const token = bearerToken[1];

    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        throw new Error("Not Authorized");
      }
      req.payload = payload;
      next();
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware (error handler)
  }
};

module.exports = { signAccessToken, verifyAccessToken };
