const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

router.get("/logs", authMiddleware, logController.getLogs);
router.post("/create", authMiddleware, logController.createLog);
router.delete("/delete/:logId", adminMiddleware, logController.deleteLogById);
router.get("/:logId", authMiddleware, logController.getLogById);

module.exports = router;
