require('dotenv').config();

// Simple env config without Firebase validation (handled in firebase.js)
module.exports = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'production',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
};
