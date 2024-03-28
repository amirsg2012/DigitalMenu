// server/models/MenuItem.js

const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
  imageUrl: { type: String } // Add a field for storing the image URL
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
