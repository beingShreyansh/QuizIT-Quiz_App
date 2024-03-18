const express = require('express');
const router = express.Router();
const { fetchCategories, fetchQuestionsAndOptions, updateQuestion, deleteQuiz ,deleteQuestion} = require('../controllers/quizController');

// Define routes
router.get('/categories', fetchCategories);
router.get('/questions-and-options/:quizId', fetchQuestionsAndOptions);
//router.put('/update/:questionId', updateQuestionAndOptions); // New route for updating the question
 // New route for deleting a quiz
router.delete('/delete-quiz/:quizId',deleteQuiz);

// Define route for updating question data
router.put('/update/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);


module.exports = router;