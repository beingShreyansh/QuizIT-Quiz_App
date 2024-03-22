const {
  getQuizData,
  submitQuizData,
} = require("../controllers/quizControllers");

const router = require("express").Router();

router.get("/getQuiz/:quizId/:totalQuestions/:beginnerRatio/:intermediateRatio/:advancedRatio", getQuizData);

router.post("/get-results", submitQuizData);


module.exports = router;
