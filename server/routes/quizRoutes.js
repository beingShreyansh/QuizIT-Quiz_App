const { getQuizData } = require("../controllers/quizControllers");

const router = require("express").Router();

router.get("/getQuiz", getQuizData);

module.exports = router;
