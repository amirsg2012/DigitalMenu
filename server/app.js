const express = require('express');
const connectDB = require('./config/db');
const corsMiddleware = require('./middleware/cors');
const menuItemRoutes = require('./routes/menuItemRoutes');
const adminRoutes = require('./routes/adminRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path');
const https = require('https'); // Require the https module
const fs = require('fs');
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(express.static(path.resolve(__dirname, '..', 'client', 'public')));

// Always serve index.html for any route except excluded routes
app.get('*', (req, res, next) => {
  const excludedRoutes = ['/api/menu', '/menu_pic', '/category_icons', '/api/admin', '/api/categories'];
  const requestPath = req.path;
  let isExcluded = false;

  for (let route of excludedRoutes) {
    if (requestPath.startsWith(route)) {
      isExcluded = true;
      break;
    }
  }

  if (isExcluded) {
    next();
  } else {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'public', 'index.html'));
  }
});

// Routes
app.use('/api/menu', menuItemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/menu_pic', express.static(path.resolve(__dirname, 'client', 'public', 'menu_pic')));
app.use('/category_icons', express.static(path.resolve(__dirname, 'client', 'public', 'category_icons')));

// Error handler middleware
app.use(require('./middleware/errorHandler'));

// HTTPS Server Configuration
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/monjay.ir/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/monjay.ir/fullchain.pem')
};

const PORT = process.env.PORT || 5000; // Use port 443 for HTTPS

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

