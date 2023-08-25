const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tweetController = require('../controllers/tweetController');

router.get('/:id', auth, tweetController.actionTweet);

router.post('/create',  auth, tweetController.createTweet);

router.put('/edit/:id', auth, tweetController.editTweet);

router.delete('/edit/:id', tweetController.deleteTweet);

module.exports = router;