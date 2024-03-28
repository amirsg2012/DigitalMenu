// server/seedCategories.js

const mongoose = require('mongoose');
const Category = require('./models/Category');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err.message));

// Define categories
const categories = [
  { name: 'Breakfast' },
  { name: 'Espresso Coffee' },
  { name: 'Brew Coffee' },
  { name: 'Cold Drink' },
  { name: 'Hot Drink' },
  { name: 'Fruit Yogurt' },
  { name: 'Brunch' },
  { name: 'Topping' }
];

// Insert categories into the database
Category.insertMany(categories)
  .then((result) => {
    console.log('Categories added successfully:', result);
  })
  .catch((error) => {
    console.error('Error adding categories:', error);
  })
  .finally(() => {
    // Disconnect from MongoDB after adding categories
    mongoose.disconnect();
  });
