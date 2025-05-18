const jwt = require("jsonwebtoken");

const admin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. Admin token is missing." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid admin token." });
  }
};

module.exports = admin;
