const Delivery = require('../models/Delivery');
const Earning = require('../models/Earning');
const User = require('../models/User');

exports.createDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.create({
      ...req.body,
      customerId: req.user.id,
      status: 'pending',
    });
    res.status(201).json(delivery);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getPendingDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ status: 'pending' })
      .populate('customerId', 'name phone rating')
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyDeliveries = async (req, res) => {
  try {
    const filter = req.user.isBiker
      ? { bikerId: req.user.id }
      : { customerId: req.user.id };
    const deliveries = await Delivery.find(filter).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('customerId', 'name phone')
      .populate('bikerId', 'name phone rating licencePlate');
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acceptDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Delivery not found' });
    if (delivery.status !== 'pending')
      return res.status(400).json({ message: 'Delivery no longer available' });

    delivery.bikerId = req.user.id;
    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['picked_up', 'delivered', 'cancelled'];
  if (!allowed.includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Not found' });
    if (delivery.bikerId?.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not your delivery' });

    delivery.status = status;
    if (status === 'picked_up') delivery.pickedUpAt = new Date();
    if (status === 'delivered') {
      delivery.deliveredAt = new Date();
      await Earning.create({
        bikerId: req.user.id,
        deliveryId: delivery._id,
        amount: delivery.price,
      });
      await User.findByIdAndUpdate(req.user.id, {
        $inc: { totalEarnings: delivery.price, totalDeliveries: 1 },
      });
    }
    await delivery.save();
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.rateDelivery = async (req, res) => {
  const { rating } = req.body;
  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Rating must be 1-5' });

  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ message: 'Not found' });

    const isCustomer = delivery.customerId.toString() === req.user.id;
    const isBiker = delivery.bikerId?.toString() === req.user.id;

    if (isCustomer) delivery.customerRating = rating;
    else if (isBiker) delivery.bikerRating = rating;
    else return res.status(403).json({ message: 'Not part of this delivery' });

    await delivery.save();
    res.json({ message: 'Rating saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
