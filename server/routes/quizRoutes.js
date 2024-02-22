const { getQuizData } = require("../controllers/quizControllers");

const router = require("express").Router();

router.get("/getQuiz/:id", getQuizData);

module.exports = router;
