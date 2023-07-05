const mongoose = require('mongoose');
const { generateotp } = require('../commands/otp');
const { sendotp } = require('../commands/email');

// Create a connection to your MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  otp: String,
  email: String,
  // Add any other fields you need for the User model
});

// Create the UserModel using the userSchema
const UserModel = mongoose.model('User', userSchema);

/**
 * Handle the forgot password request.
 * Generates and sends an OTP to the user's registered email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const forgotPasswordCommand = async (req, res) => {
  try {
    const { username } = req.body;

    // Check if the username exists in the database
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = generateotp();

    // Save the OTP to the user document
    user.otp = otp;
    await user.save();

    // Send OTP to user's email
    sendotp(user.email, otp);

    res.json({ message: 'OTP sent to registered email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Handle the reset password request.
 * Resets the user's password if the provided OTP matches.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const resetPasswordCommand = async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;

    // Find the user by username
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP matches
    if (otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Update the password
    user.password = newPassword;
    user.otp = undefined; // Clear the OTP field
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { forgotPasswordCommand, resetPasswordCommand };