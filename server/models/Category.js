// server/models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  order: { type: Number, required: true, default: 0 }, // Default value for order field
  name: { type: String, required: true },
  iconUrl: { type: String },
  description: { type: String }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;