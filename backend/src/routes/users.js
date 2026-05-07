const router = require('express').Router();
const { protect, requireAdmin } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.get('/me', protect, ctrl.getMe);
router.put('/me', protect, ctrl.updateProfile);
router.put('/me/role', protect, ctrl.switchRole);
router.put('/me/docs', protect, ctrl.submitDocs);
router.put('/me/location', protect, ctrl.updateLocation);

router.get('/bikers', protect, requireAdmin, ctrl.getAllBikers);
router.put('/:id/verification', protect, requireAdmin, ctrl.setVerificationStatus);

module.exports = router;
