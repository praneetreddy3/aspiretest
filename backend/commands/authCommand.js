const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const { generateotp } = require('../commands/otp.js'); // Assuming you have an otp.js file with the OTP generation function

/**
 * Handles the authentication request.
 * Validates the provided username, password, and OTP.
 * If the credentials are valid, a token is generated and returned.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.authenticate = async (req, res) => {
  const { username, password, otp } = req.body;

  try {
    // Find the user with the provided username
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (otp !== user.otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Clear the OTP field after successful validation
    user.otp = undefined;
    await user.save();

    const token = jwt.sign({ username }, 'secret-key');
    res.json({ token });
  } catch (error) {
    console.log('Error while searching for username:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
