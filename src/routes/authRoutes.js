const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Route protégée par token pour la session Next.js
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;