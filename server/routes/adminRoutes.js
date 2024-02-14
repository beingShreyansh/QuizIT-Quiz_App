const router = require('express').Router();
const multer = require('multer');

const { addQuiz } = require('../controllers/adminControllers');
const upload = multer();
router.post('/addQuiz',  upload.single('file'), addQuiz);

module.exports = router;