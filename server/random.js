const mongoose = require('mongoose');
const Category = require('./models/Category'); // Assuming this is the path to your Admin model
const MenuItem  = require('./models/MenuItem');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Find all admin documents
    const cate = await MenuItem.find({});
    
    // Output admin credentials
    console.log('Categories');
    cate.forEach(catee => {
      console.log(`shalams: ${catee.name} ${catee.order} `);
    });
  } catch (err) {
    console.error('Error finding admins:', err);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
