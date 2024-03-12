const express = require('express');
const router = express.Router();
const { fetchCategories, fetchQuestionsAndOptions, updateQuestionAndOptions } = require('../controllers/quizController');

// Define routes
router.get('/categories', fetchCategories);
router.get('/questions-and-options/:quizName', fetchQuestionsAndOptions);
router.put('/update/:questionId', updateQuestionAndOptions); // New route for updating the question

module.exports = router;