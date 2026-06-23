/**
 * Generates a random alphanumeric OTP with a length of 25 characters.
 *
 * @returns {string} The generated OTP.
 */
const generateotp = () => {
  const otpLength = 25;
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let otp = '';

  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    otp += characters[randomIndex];
  }

  return otp;
};

module.exports = { generateotp };
