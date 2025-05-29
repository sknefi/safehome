const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middlewares/auth");

router.post("/create", authMiddleware, householdController.createHousehold);

router.delete(
  "/delete/:id",
  authMiddleware,
  householdController.deleteHousehold
);

router.put(
  "/add-user/:id",
  authMiddleware,
  householdController.addUserToHousehold
);

router.put(
  "/remove-user/:id",
  authMiddleware,
  householdController.removeUserFromHousehold
);

router.put(
  "/update-name/:id",
  authMiddleware,
  householdController.updateHouseholdName
);

router.get(
  "/get-household-state/:hwId",
  authMiddleware,
  householdController.getHouseholdStateBasedOnHwId
);

module.exports = router;
