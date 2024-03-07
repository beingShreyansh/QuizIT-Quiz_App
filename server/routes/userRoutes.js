const router = require("express").Router();
const User = require('../models/User'); // Adjust the path based on your project structure

const {
  getUserQuizHistory,
  getCategories,
  getUserDetails,
} = require("../controllers/userControllers");

router.post("/getHistory/:id", getUserQuizHistory);
router.get("/getCategories", getCategories);
router.get("/getUserDetails/:id", getUserDetails); 
module.exports = router;
