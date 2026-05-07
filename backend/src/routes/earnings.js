const router = require('express').Router();
const { protect, requireBiker } = require('../middleware/auth');
const { getMyEarnings } = require('../controllers/earningsController');

router.get('/', protect, requireBiker, getMyEarnings);

module.exports = router;
