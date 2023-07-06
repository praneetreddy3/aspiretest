const fetch = require('node-fetch');

// Prepare the login data
const loginData = {
  username: 'poorank123',
  password: 'Password123',
  otp: generateotp(), // Assuming the generateotp() function is defined
};

// Send a POST request to the login endpoint
fetch('http://localhost:5055/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData),
})
  .then((response) => {
    return response.json(); // Parse the response as JSON
  })
  .then((data) => {
    console.log('Login successful');
    console.log('Token:', data.token); // Assuming the response contains a token field
  })
  .catch((error) => {
    console.log('Login failed:', error.message);
  });

// This code sends a POST request to the /login endpoint of your server
// It includes the login data in the request payload
// The server should validate the username, password, and OTP
// Upon successful login, the server should respond with a JSON object containing a token field
// The code parses the response and logs the message "Login successful" along with the received token
// If there is an error during the login process, it logs the error message
// Make sure the server is running and listening on http://localhost:5055/login
// Also, ensure that the server handles the login request properly and responds with a token upon successful authentication
