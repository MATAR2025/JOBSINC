const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/adminController');

router.use(auth);

router.get('/overview', controller.overview);
router.patch('/account', controller.updateAccount);
router.patch('/notifications/read', controller.markNotificationsRead);
router.get('/users/:id', controller.getUser);
router.get('/users', controller.listUsers);
router.post('/users/:id/block', controller.setBlocked);
router.patch('/companies/:id/approval', controller.setCompanyApproved);
router.delete('/users/:id', controller.deleteUser);
router.patch('/applications/:id/status', controller.setApplicationStatus);
router.delete('/applications/:id', controller.deleteApplication);
router.get('/:section', controller.section);

module.exports = router;