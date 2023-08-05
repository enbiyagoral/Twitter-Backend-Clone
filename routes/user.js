const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

router.get('/:id', userController.Profile);
router.get('/saved/:id', userController.SavedTweet);
router.get('/liked/:id',  userController.LikedTweet);
router.post('/signup',userController.SignUp);
router.post('/login', userController.Login);
router.post('/logout', auth, userController.Logout)
router.delete('/:id', auth, userController.DeleteUser)

module.exports = router;