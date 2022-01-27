const router = require('express-promise-router')();
const authController = require('../controllers/authentication/auth.controllers');

// LOCAL AUTHENTICATION WITH JWT
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

module.exports = router;