const Earning = require('../models/Earning');

exports.getMyEarnings = async (req, res) => {
  try {
    const earnings = await Earning.find({ bikerId: req.user.id })
      .populate('deliveryId', 'pickup dropoff deliveredAt')
      .sort({ createdAt: -1 });
    const total = earnings.reduce((sum, e) => sum + e.amount, 0);
    res.json({ earnings, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
