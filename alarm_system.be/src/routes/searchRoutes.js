const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const adminAuth = require("../middlewares/admin");

router.get("/", adminAuth, searchController.searchHouseholds);

module.exports = router;
