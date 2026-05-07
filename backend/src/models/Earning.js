const mongoose = require('mongoose');

const earningSchema = new mongoose.Schema(
  {
    bikerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Delivery', required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Earning', earningSchema);
