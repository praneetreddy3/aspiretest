const nodemailer = require('nodemailer');

/**
 * Sends the OTP to the registered email.
 * Uses nodemailer to send the email.
 * Replace the email credentials and settings with your own.
 */
module.exports = (email, otp) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587, // Replace with your email service provider (e.g., Gmail, Outlook)
    auth: {
      user: 'pooran.k@aspireinfolabs.com',
      pass: 'password123',
    },
  });

  // Configure the email options
  const mailOptions = {
    from: 'pooran.k@aspireinfolabs.com', // Replace with your email address
    to: email, // The recipient's email address
    subject: 'OTP for Registration',
    text: `Your OTP is ${otp}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};