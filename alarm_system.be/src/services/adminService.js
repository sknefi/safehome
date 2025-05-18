const jwt = require("jsonwebtoken");

const generateAdminAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: "1h",
  });
};

const generateAdminRefreshToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.REFRESH_TOKEN_ADMIN_SECRET, {
    expiresIn: "1d",
  });
};

const verifyAdminRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_ADMIN_SECRET);
};

module.exports = {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminRefreshToken,
};
