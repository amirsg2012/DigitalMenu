const cors = require('cors');

// Define the list of allowed origins
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5000',
  'https://localhost:5000',
  'http://localhost',
  'https://localhost',
  'http://monjay.ir',
  'http://www.monjay.ir',
  'https://monjay.ir',
  'https://www.monjay.ir',
  // Add other domains or subdomains if necessary
];

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    // Check if the origin is in the list of allowed origins
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // Allow sending cookies
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

module.exports = cors(corsOptions);

