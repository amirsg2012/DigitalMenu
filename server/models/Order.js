// server/models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    name: String,
    quantity: Number,
    price: Number,
  }],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
