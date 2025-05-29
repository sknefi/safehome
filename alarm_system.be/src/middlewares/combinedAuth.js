const jwt = require("jsonwebtoken");

const combinedAuth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Token is missing." });
  }

  // Try to verify as admin token first
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.user = decoded;
    req.userType = 'admin';
    return next();
  } catch (adminError) {
    // If admin token verification fails, try user token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      req.userType = 'user';
      return next();
    } catch (userError) {
      return res.status(400).json({ message: "Invalid token." });
    }
  }
};

module.exports = combinedAuth; 