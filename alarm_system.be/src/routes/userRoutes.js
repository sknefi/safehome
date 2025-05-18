const express = require("express");
const router = express.Router();
const householdController = require("../controllers/userController");
const authMiddleware = require("../middlewares/auth");

router.get("/users", householdController.getAllUsers);
router.get(
  "/whole/:id",
  authMiddleware,
  householdController.getWholeHouseholdById
);
router.get("/", authMiddleware, householdController.getHousehold);
router.get("/:id", authMiddleware, householdController.getHouseholdById);

module.exports = router;
