const express = require('express');
const router = express.Router();
const authenticationController = require('../controllers/authentication-controller');
const {validateToken} = require('../middlewares/authentication-middleware');

router.post('/register', authenticationController.registerUser);
router.post('/login', authenticationController.loginUser);
router.get('/me', validateToken, authenticationController.getMe);
router.post('/github', authenticationController.gitHubCallback);

module.exports = router;
