const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin'); // Assuming this is the path to your Admin model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Check if admin with the username already exists
    const existingAdmin = await Admin.findOne({ username: 'ADMINJAY' });
    if (existingAdmin) {
        console.log('Admin with username ADMINJAY already exists');
        mongoose.connection.close();
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('monjay#123', 10);

    // Create a new admin document with hashed password
    const newAdmin = new Admin({
        username: 'ADMINJAY',
        password: hashedPassword
    });

    // Save the new admin document to the database
    await newAdmin.save();

    console.log('Admin with username ADMINJAY created successfully');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
