const express = require('express');
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/companyController');

const router = express.Router();
router.use(auth);
router.get('/dashboard', controller.dashboard);
router.get('/profile', controller.profile);
router.get('/jobs', controller.jobs);
router.post('/jobs', controller.createJob);
router.get('/applications', controller.applications);

module.exports = router;
