const router = require('express').Router();
const { verifyPhone } = require('../controllers/authController');

router.post('/verify', verifyPhone);

module.exports = router;
