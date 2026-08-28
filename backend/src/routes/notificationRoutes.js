const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controllers/notificationController');
router.use(auth);
router.get('/', controller.list);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', controller.markRead);
module.exports = router;