const router = require('express').Router();
const multer = require('multer');

const { addQuiz ,getUserQuizHistory} = require('../controllers/adminControllers');
const upload = multer();

router.post('/addQuiz', upload.single('file'), addQuiz);

router.post('/getUserHistory', getUserQuizHistory);

module.exports = router;