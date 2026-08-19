const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const candidateUpload = require('../middlewares/candidateUpload');

const companyUpload = require('../middlewares/companyUpload');

// Routes publiques
router.post('/register/candidate', candidateUpload, authController.registerCandidate);
router.post('/login/candidate', authController.loginCandidate);

router.post('/register/company', companyUpload, authController.registerCompany);
router.post('/login/company', authController.loginCompany);

// Route protégée par token pour la session Next.js
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
