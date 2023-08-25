const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/:id', userController.profile);
router.get('/saved/:id', userController.savedTweet);
router.get('/liked/:id',  userController.likedTweet);
router.post('/signup',userController.signUp);
router.post('/login', userController.login);
router.post('/logout', userController.logout)
router.delete('/:id', auth, userController.deleteUser)

module.exports = router;