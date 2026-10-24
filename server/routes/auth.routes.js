const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

// Destructure the 'protect' function from the middleware
const { protect } = require('../middleware/auth.middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// Update this route to use 'protect' instead of 'verifyToken'
router.get('/me', protect, auth.me);

module.exports = router;