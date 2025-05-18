const bcrypt = require("bcryptjs");
const {
  generateAdminAccessToken,
  generateAdminRefreshToken,
  verifyAdminRefreshToken,
} = require("../services/adminService");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Admin Register
const register = async (req, res) => {
  const { firstName, lastName, email, password, role = "admin" } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      message: "Jméno, příjmení, email a heslo jsou povinné.",
    });
  }

  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ message: "Administrátor již existuje." });
    }

    admin = new Admin({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await admin.save();

    res.status(201).json({
      message: "Administrátor úspěšně zaregistrován.",
      success: true,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: admin.password,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validační chyba",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Interní chyba serveru." });
  }
};

// Admin Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email a heslo jsou povinné.",
    });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({
        message: "Neplatné přihlašovací údaje.",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Neplatné přihlašovací údaje.",
      });
    }

    const accessToken = generateAdminAccessToken(admin._id);
    const refreshToken = generateAdminRefreshToken(admin._id);
    admin.refreshToken = refreshToken;

    await admin.save();

    res.json({
      message: "Přihlášení admina úspěšné.",
      success: true,
      accessToken,
      refreshToken,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Chyba při přihlašování:", error);
    res.status(500).json({ message: "Interní chyba serveru." });
  }
};

// Admin Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Chybí refresh token." });
  }

  try {
    const decoded = verifyAdminRefreshToken(refreshToken);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Neplatný refresh token." });
    }

    const accessToken = generateAdminAccessToken(admin._id);

    res.json({
      message: "Access token úspěšně obnoven.",
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: "Neplatný refresh token." });
  }
};

// Admin Logout
const logout = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(401).json({ message: "Chybí access token." });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_ADMIN_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (admin) {
      admin.refreshToken = null;
      await admin.save();
    }

    res.status(200).json({
      success: true,
      message: "Odhlášení úspěšné.",
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Neplatný access token." });
    }
    res.status(500).json({ message: "Interní chyba serveru." });
  }
};

module.exports = { register, login, refreshToken, logout };
