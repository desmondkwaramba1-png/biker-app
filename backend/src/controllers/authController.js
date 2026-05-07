const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign(
    { id: user._id, isBiker: user.isBiker, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

exports.verifyPhone = async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ message: 'idToken required' });

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number: phone } = decoded;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({ firebaseUid: uid, phone });
    }

    res.json({ token: signToken(user), user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid Firebase token', error: err.message });
  }
};
