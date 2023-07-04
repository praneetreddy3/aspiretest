const express = require('express');
const jwt = require('jsonwebtoken');
const http = require('http');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Handles the login request.
 * Validates the provided username, password, and OTP.
 * If the credentials are valid, a token is generated and returned.
 *
 * @param {string} req.body.username - The username provided in the request body.
 * @param {string} req.body.password - The password provided in the request body.
 * @param {string} req.body.otp - The OTP provided in the request body.
 */
app.post('/login', (req, res) => {
  const { username, password, otp } = req.body;

  try {
    // Read the user data from the file
    const fileData = fs.readFileSync('details.json');
    const users = JSON.parse(fileData);

    // Find the user with the provided username
    const user = users.find((user) => user.username === username);

    if (user && user.password === password && otp === '123456') {
      const token = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.log("Error while searching for username");
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Handles the protected route.
 * Only allows access if the request contains a valid token.
 */
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed successfully' });
});

/**
 * Middleware function to authenticate the token in the request headers.
 * If the token is valid, the user information is added to the request object.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
}

/**
 * Handles the registration request.
 * Saves the user data to the 'details.json' file.
 * Generates an OTP and sends it to the registered email.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
app.post('/register', async (req, res) => {
  try {
    const userData = req.body; // Assuming req.body contains the user data

    // Read the existing data from the file
    let existingData = [];
    try {
      const fileData = fs.readFileSync('details.json');
      existingData = JSON.parse(fileData);
    } catch (error) {
      // If the file does not exist or is empty, no need to throw an error
      console.log('No existing data found');
    }

    // Add the new user data to the existing data
    existingData.push(userData);

    // Write the updated data back to the file
    fs.writeFileSync('details.json', JSON.stringify(existingData, null, 2));

    const otp = generateOTP(); // Generate a random alphanumeric OTP

    // Send OTP via email
    sendOTP(userData.email, otp); // Pass the registered email and OTP to the sendOTP function

    res.json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Generates a random alphanumeric OTP with a length of 25 characters.
 *
 * @returns {string} The generated OTP.
 */
function generateOTP() {
  const otpLength = 25;
  const regex = /\w/g;
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    otp += String.fromCharCode(Math.floor(Math.random() * 26) + 97); 
    // Generate a random lowercase alphanumeric character
  }

  return otp;
}

/**
 * Sends the OTP to the registered email.
 * Uses nodemailer to send the email.
 * Replace the email credentials and settings with your own.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The OTP to send.
 */
function sendOTP(email, otp) {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587, // Replace with your email service provider (e.g., Gmail, Outlook)
    auth: {
      user: 'praneetreddy33.email',
      pass: 'password'
    }
  });

  // Configure the email options
  const mailOptions = {
    from: 'praneetreddy33.email', // Replace with your email address
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
}

// Start the server
server.listen(5005, () => {
  console.log("Server started on port 5005");
});
