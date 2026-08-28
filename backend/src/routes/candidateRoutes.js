const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const cvUpload = require('../middlewares/cvUpload');
const candidateUpload = require('../middlewares/candidateUpload');
const coverLetterUpload = require('../middlewares/coverLetterUpload');
const candidateController = require('../controllers/candidateController');

router.use(auth);

router.get('/profile', candidateController.getProfile);
router.put('/profile', candidateController.updateProfile);
router.post('/cv', cvUpload, candidateController.uploadCv);
router.post('/cover-letter', coverLetterUpload, candidateController.uploadCoverLetter);
router.post('/avatar', candidateUpload, candidateController.uploadAvatar);

module.exports = router;
