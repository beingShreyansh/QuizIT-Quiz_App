const { getQuizData } = require("../controllers/quizControllers");

const router = require("express").Router();

router.get("/getQuiz/:quizId", getQuizData);

module.exports = router;
