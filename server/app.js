const express = require('express');
const connectDB = require('./config/db');
const corsMiddleware = require('./middleware/cors');
const menuItemRoutes = require('./routes/menuItemRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Import admin routes
const categoryRoutes = require('./routes/categoryRoutes'); // Import admin routes

const path = require('path');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware

app.use(express.json());

// Use CORS middleware
app.use(corsMiddleware);

// Serve static files from the ../client/public directory
app.use(express.static(path.resolve(__dirname, '..', 'client', 'public')));



// Always serve index.html for any route except excluded routes
app.get('*', (req, res, next) => {
  const excludedRoutes = ['/api/menu', '/menu_pic','/category_icons','/api/admin','/api/categories']; // Add routes to exclude here
  const requestPath = req.path;

  // Check if the request path is in the excluded routes list
  let isExcluded = false;
  for (let route of excludedRoutes) {
    if (requestPath.startsWith(route)) {
      isExcluded = true;
      break;
    }
  }

  // If the request path is excluded, pass control to the next middleware/router handler
  if (isExcluded) {
    next();
  } else {
    // Serve index.html for all other routes
    res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.html'));
  }
});


// Routes

// Routes for menu items
app.use('/api/menu', menuItemRoutes);
app.use('/api/admin', adminRoutes); // Mount admin routes
app.use('/api/categories', categoryRoutes); // Use category routes

// Serve static files from the /client/public/menu_pic directory
app.use('/menu_pic', express.static(path.resolve(__dirname, 'client', 'public', 'menu_pic')));
app.use('/category_icons', express.static(path.resolve(__dirname, 'client', 'public', 'category_icons')));



// Error handler middleware
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
