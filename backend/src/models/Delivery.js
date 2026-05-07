const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bikerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickup: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropoff: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    packageDescription: { type: String, required: true },
    price: { type: Number, required: true },
    notes: String,
    status: { type: String, default: 'pending' },
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    customerRating: Number,
    bikerRating: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
