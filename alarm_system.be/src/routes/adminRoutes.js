const express = require("express");
const router = express.Router();
const householdController = require("../controllers/userController");
const adminAuthMiddleware = require("../middlewares/admin");
const {
  register,
  login,
  refreshToken,
  logout,
} = require("../controllers/adminController");

// Admin auth routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get(
  "/wholeAdmin/:id",
  adminAuthMiddleware,
  householdController.getWholeHouseholdByIdAdmin
);

module.exports = router;
