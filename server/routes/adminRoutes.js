const router = require('express').Router();
const multer = require('multer');
const { getTopStudents,getAverageScore } = require('../controllers/topStudentsController');
const { addQuiz ,getUserQuizHistory,getSheetUrl} = require('../controllers/adminControllers');
const upload = multer();

router.post('/addQuiz', upload.single('file'), addQuiz);
router.get('/getSheetFormatUrl', getSheetUrl);
router.post('/getUserHistory', getUserQuizHistory);
router.get('/top-students', getTopStudents);
router.get('/averageScore', getAverageScore);
module.exports = router;