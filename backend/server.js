const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const jwt = require('jsonwebtoken');

const authCommand = require('./commands/authCommand');
const secureCommand = require('./commands/secureCommand');
const registerCommand = require('./commands/registerCommand');
const forgotpasswordCommand = require('./commands/forgotpasswordCommand');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error:', error);
  });

/**
 * Middleware function to authenticate the token in the request headers.
 * If the token is valid, the user information is added to the request object.
 * If the token is invalid or not present, it returns a 401 Unauthorized response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next function to call.
 */
const authtoken = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, 'secret-key', (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Not authorized' });
      } else {
        req.user = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};

/**
 * Endpoint for user login.
 * It invokes the login function from authCommand to handle the login request.
 */
app.post('/login', (req, res) => {
  authCommand.login(req, res);
});

/**
 * Protected endpoint that requires authentication.
 * It invokes the secure function from secureCommand to handle the request.
 */
app.get('/secure', authtoken, (req, res) => {
  secureCommand.secure(req, res);
});

/**
 * Endpoint for user registration.
 * It invokes the register function from registerCommand to handle the registration request.
 */
app.post('/register', (req, res) => {
  registerCommand.register(req, res);
});

/**
 * Endpoint for initiating the forgot password process.
 * It invokes the forgotpassword function from forgotpasswordCommand to handle the request.
 */
app.post('/forgotpassword', (req, res) => {
  forgotpasswordCommand.forgotPasswordCommand(req, res);
});

/**
 * Endpoint for resetting the password.
 * It invokes the resetpassword function from forgotpasswordCommand to handle the request.
 */
app.post('/resetpassword', (req, res) => {
  forgotpasswordCommand.resetPasswordCommand(req, res);
});

// Start the server
const PORT = process.env.PORT || 5055;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
