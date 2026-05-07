const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: String,
    email: String,
    photo: String,
    isBiker: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    verificationStatus: { type: String, default: 'pending' },
    rating: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    location: {
      lat: Number,
      lng: Number,
    },
    licencePlate: String,
    nationalIdUrl: String,
    licenceUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
