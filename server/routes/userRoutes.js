const router = require('express').Router();

const { getUserQuizHistory, getCategories} = require('../controllers/userControllers');

router.post('/getHistory/:id', getUserQuizHistory);
router.get('/getCategories', getCategories);


module.exports = router;