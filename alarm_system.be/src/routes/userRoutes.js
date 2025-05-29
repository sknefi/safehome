const express = require("express");
const router = express.Router();
const householdController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.get("/users", householdController.getAllUsers);
router.get(
  "/users-admin",
  adminMiddleware,
  householdController.getAllUsersAdmin
);

router.get(
  "/whole/:id",
  authMiddleware,
  householdController.getWholeHouseholdById
);
router.get("/", authMiddleware, householdController.getHousehold);
router.get("/:id", authMiddleware, householdController.getHouseholdById);

module.exports = router;
