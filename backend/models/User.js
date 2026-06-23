const mongoose = require('mongoose');

// Create a connection to the MongoDB database
mongoose.connect('mongodb://localhost:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  otp: String,
  email: String,
  // Add any other fields you need for the User model
});

// Create the UserModel using the userSchema
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
