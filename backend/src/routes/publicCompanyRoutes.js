const express = require('express');
const controller = require('../controllers/companyController');

const router = express.Router();
router.get('/', controller.listPublic);

module.exports = router;
