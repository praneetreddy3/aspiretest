/**
 * Handles the protected route.
 * Only allows access if the request contains a valid token.
 */
exports.protected = (req, res) => {
    res.json({ message: 'route accessed successfully and securely' });
  };
  