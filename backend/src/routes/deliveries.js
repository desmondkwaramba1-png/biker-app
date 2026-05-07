const router = require('express').Router();
const { protect, requireBiker } = require('../middleware/auth');
const ctrl = require('../controllers/deliveryController');

router.post('/', protect, ctrl.createDelivery);
router.get('/mine', protect, ctrl.getMyDeliveries);
router.get('/pending', protect, requireBiker, ctrl.getPendingDeliveries);
router.get('/:id', protect, ctrl.getDelivery);
router.put('/:id/accept', protect, requireBiker, ctrl.acceptDelivery);
router.put('/:id/status', protect, requireBiker, ctrl.updateStatus);
router.post('/:id/rate', protect, ctrl.rateDelivery);

module.exports = router;
