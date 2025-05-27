const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const adminAuth = require("../middlewares/admin");

router.get(
  "/name",
  adminAuth,
  searchController.searchHouseholdsByHouseholdName
);
router.get("/ownerId", adminAuth, searchController.searchHouseholdsByOwnerId);
router.get(
  "/householdId",
  adminAuth,
  searchController.searchHouseholdsByHouseholdId
);

module.exports = router;
