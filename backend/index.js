import { post } from 'axios';

// Registration data
const registerData = {
  username: 'poorank123',
  password: 'password789',
  email: 'pooran.k@aspireinfolabs.com',
  confirmPassword: 'password789',
  collegename: 'XYZ University',
  firstname: 'Pooran',
  lastname: 'K',
};

// Register a new user
post('http://localhost:5000/register', registerData)
  .then((response) => {
    console.log(response.data);
  })
  .catch((error) => {
    console.error(error);
  });

// Login data
const loginData = {
  username: 'poorank123',
  password: 'password789',
  otp: '123456',
};

// Login with the provided credentials
post('http://localhost:5000/login', loginData)
  .then((response) => {
    const token = response.data.token;
    console.log('Login successful');
    console.log('Token:', token);

    // Store the token securely and include it in subsequent requests
    // to protected routes as an "Authorization" header with the value "Bearer <token>"
  })
  .catch((error) => {
    console.log('Login failed:', error);
  });
