/**
 * Generates a random alphanumeric OTP with a length of 25 characters.
 *
 * @returns {string} The generated OTP.
 */
module.exports = () => {
  const otpLength = 25;
  const regex = /\w/g;
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    otp += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
    // Generate a random lowercase alphanumeric character
  }

  return otp;
};
