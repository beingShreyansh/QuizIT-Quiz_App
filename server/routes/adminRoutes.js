const router = require('express').Router();
const multer = require('multer');

const { addQuiz ,getUserQuizHistory,getSheetUrl} = require('../controllers/adminControllers');
const upload = multer();

router.post('/addQuiz', upload.single('file'), addQuiz);
router.get('/getSheetFormatUrl', getSheetUrl);
router.post('/getUserHistory', getUserQuizHistory);

module.exports = router;