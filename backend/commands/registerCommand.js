const mongoose = require('mongoose');
const User = require('../models/User'); // Import the User model (assuming it exists)
const { generateOTP } = require('../commands/otpCommand'); // Import the OTP generation command
const { sendOTP } = require('../commands/emailCommand'); // Import the email sending command

/**
 * Handles the user registration request.
 * Creates a new user document, generates an OTP, and sends it via email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const register = async (req, res) => {
  try {
    const userData = req.body;

    // Create a new user document using the User model
    const user = new User(userData);

    // Save the user document to the database
    await user.save();

    // Generate OTP
    const otp = generateOTP();

    // Send OTP via email
    sendOTP(userData.email, otp);

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { register };
