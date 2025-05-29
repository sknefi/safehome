const express = require("express");
const router = express.Router();
const householdController = require("../controllers/householdController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.post("/create", authMiddleware, householdController.createHousehold);

router.delete(
  "/delete/:id",
  authMiddleware,
  householdController.deleteHousehold
);

router.delete(
  "/delete-admin/:id",
  adminMiddleware,
  householdController.deleteHouseholdAdmin
);

router.put(
  "/add-user/:id",
  authMiddleware,
  householdController.addUserToHousehold
);

router.put(
  "/add-user-admin/:id",
  adminMiddleware,
  householdController.addUserToHouseholdAdmin
);

router.put(
  "/remove-user/:id",
  authMiddleware,
  householdController.removeUserFromHousehold
);

router.put(
  "/remove-user-admin/:id",
  adminMiddleware,
  householdController.removeUserFromHouseholdAdmin
);

router.put(
  "/update-name/:id",
  authMiddleware,
  householdController.updateHouseholdName
);

router.put(
  "/update-name-admin/:id",
  adminMiddleware,
  householdController.updateHouseholdNameAdmin
);
  
router.get(
  "/get-household-state/:hwId",
  authMiddleware,
  householdController.getHouseholdStateBasedOnHwId
);

module.exports = router;
