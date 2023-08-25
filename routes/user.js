const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');
const checkUser = require('../middleware/checkUser');

router.get('/:id', auth, userController.profile);
router.get('/saved/:id',[auth, checkUser], userController.savedTweet);
router.get('/liked/:id', auth,userController.likedTweet);
router.post('/signup',userController.signUp);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout)
router.delete('/:id', [auth, checkUser], userController.deleteUser)

module.exports = router;