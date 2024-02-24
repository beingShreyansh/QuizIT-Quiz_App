const {
  getQuizData,
  submitQuizData,
} = require("../controllers/quizControllers");

const router = require("express").Router();

router.get("/getQuiz/:quizId", getQuizData);
router.post("/submitQuiz/:quizId", submitQuizData);


module.exports = router;
