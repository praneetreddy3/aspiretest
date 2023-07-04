const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP } = require('../commands/otpCommand'); // Assuming you have an otpCommand.js file with the OTP generation function

/**
 * Handles the authentication request.
 * Validates the provided username, password, and OTP.
 * If the credentials are valid, a token is generated and returned.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.authenticate = async (req, res) => {
  const { username, password } = req.body;
  const enteredOTP = generateOTP(); // Call the generateOTP function from the otpCommand file

  try {
    // Find the user with the provided username
    const user = await User.findOne({ username });

    if (user && user.password === password && enteredOTP === generateOTP()) {
      const token = jwt.sign({ username }, 'secret-key');
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.log("Error while searching for username:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
