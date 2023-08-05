const express = require('express');
const router = express.Router();
const User = require('../model/User');
const Tweet = require('../model/Tweet');
const auth = require('../middleware/auth');
const tweetController = require('../controllers/tweetController');

router.get('/:id', auth, tweetController.ActionTweet);

router.post('/create',  auth, tweetController.CreateTweet);

router.put('/edit/:id', auth, tweetController.EditTweet);

router.delete('/edit/:id', auth, tweetController.DeleteTweet);

module.exports = router;