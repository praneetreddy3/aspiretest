const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');
const jwt = require('jsonwebtoken');

const authCommand = require('./commands/authCommand');
const secureCommand = require('./commands/secureCommand');
const registerCommand = require('./commands/registerCommand');
// Import the forgotpassword and resetpassword commands
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
 * It invokes the authorizeCommand's login function to handle the login request.
 */
app.post('/login', authCommand.login);

/**
 * Protected endpoint that requires authentication.
 * It invokes the secureCommand's secure function to handle the request.
 */
app.get('/secure', authtoken, secureCommand.secure);

/**
 * Endpoint for user registration.
 * It invokes the registerCommand's register function to handle the registration request.
 */
app.post('/register', registerCommand.register);

/**
 * Endpoint for initiating the forgot password process.
 * It invokes the forgotpasswordCommand's forgotpassword function to handle the request.
 */
app.post('/forgotpassword', forgotpasswordCommand.forgotpassword);

/**
 * Endpoint for resetting the password.
 * It invokes the forgotpasswordCommand's resetpassword function to handle the request.
 */
app.post('/resetpassword', forgotpasswordCommand.resetpassword);

// Middleware and server setup code...

// Start the server
server.listen(5000, () => {
  console.log('Server started on port 5000');
});
