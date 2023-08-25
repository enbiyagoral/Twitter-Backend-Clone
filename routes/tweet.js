const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tweetController = require('../controllers/tweetController');
const checkUser = require('../middleware/checkUser');

router.get('/:id', auth, tweetController.actionTweet);

router.post('/create',tweetController.createTweet);

router.put('/edit/:id', checkUser,tweetController.editTweet);

router.delete('/edit/:id', checkUser, tweetController.deleteTweet);

module.exports = router;