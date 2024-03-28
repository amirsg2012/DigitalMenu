// middleware/cors.js

const cors = require('cors');

// Enable CORS for all origins
const corsOptions = {
  origin: 'http://localhost:8080', // Allow requests from frontend running on port 8080
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow sending cookies
  optionsSuccessStatus: 200, // Optional status code for successful preflight requests
};

module.exports = cors(corsOptions);
