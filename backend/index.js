const loginData = {
  username: 'poorank123',
  password: 'Password123',
  otp: generateotp(),
};

fetch('http://localhost:5055/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData),
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log('Login successful');
    console.log('Token:', data.token);
  })
  .catch((error) => {
    console.log('Login failed:', error.message);
  });