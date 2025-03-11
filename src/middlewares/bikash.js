const axios = require('axios');
const globals = require('node-global-storage');

// Middleware function for bKash authentication
const bkashAuth = async (req, res, next) => {
  // Clear any existing token
  globals.unsetValue('id_token');

  try {
    // Request a new token from bKash
    const { data } = await axios.post(
      process.env.bkash_grant_token_url,
      {
        app_key: process.env.bkash_api_key,
        app_secret: process.env.bkash_secret_key,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          username: process.env.bkash_username,
          password: process.env.bkash_password,
        },
      }
    );

    // Store the new token securely
    globals.setValue('id_token', data.id_token, { protected: true });

    next();
  } catch (error) {
    // Handle errors
    return res.status(401).json({ error: error.message });
  }
};

// Export the middleware function
module.exports = bkashAuth ;