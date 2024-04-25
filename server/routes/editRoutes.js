const express = require('express');
const router = express.Router();
const { fetchCategories, fetchQuestionsAndOptions, updateQuestion, deleteQuiz ,deleteQuestion,putImageToOption,getSignedObjectUrlToPutQues} = require('../controllers/quizController');


// Define routes
router.get('/categories', fetchCategories);
router.get('/questions-and-options/:quizId', fetchQuestionsAndOptions);
//router.put('/update/:questionId', updateQuestionAndOptions); // New route for updating the question
 // New route for deleting a quiz
router.delete('/delete-quiz/:quizId',deleteQuiz);

router.put('/putImageIdToOption/:imageId',putImageToOption);

router.get("/get-signed-url", getSignedObjectUrlToPutQues);
// Define route for updating question data
router.put('/update/:questionId', updateQuestion);

router.delete('/questions/:questionId', deleteQuestion);


module.exports = router;