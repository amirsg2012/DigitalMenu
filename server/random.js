const mongoose = require('mongoose');
const Category = require('./models/Category'); // Assuming this is the path to your Admin model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Find all admin documents
    const cate = await Category.find({});
    
    // Output admin credentials
    console.log('Categories');
    cate.forEach(catee => {
      console.log(`shalams: ${catee.name} ${catee.iconUrl} `);
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
