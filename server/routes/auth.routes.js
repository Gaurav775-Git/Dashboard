const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);
router.get('/me', verifyToken, auth.me);

module.exports = router;