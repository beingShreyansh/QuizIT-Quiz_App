const router = require('express').Router();

const { getUserQuizHistory} = require('../controllers/userControllers');

router.post('/getHistory/:id', getUserQuizHistory);


module.exports = router;