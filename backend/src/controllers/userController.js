const User = require('../models/User');

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-firebaseUid');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  const allowed = ['name', 'email', 'photo', 'licencePlate'];
  const updates = Object.fromEntries(
    Object.entries(req.body).filter(([k]) => allowed.includes(k))
  );
  try {
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.switchRole = async (req, res) => {
  const { isBiker } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isBiker },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.submitDocs = async (req, res) => {
  const { nationalIdUrl, licenceUrl, licencePlate } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { nationalIdUrl, licenceUrl, licencePlate, verificationStatus: 'submitted' },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateLocation = async (req, res) => {
  const { lat, lng } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { location: { lat, lng } });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllBikers = async (req, res) => {
  try {
    const bikers = await User.find({ isBiker: true }).select('-firebaseUid');
    res.json(bikers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.setVerificationStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { verificationStatus: status },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
