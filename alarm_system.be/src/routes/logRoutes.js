const express = require("express");
const router = express.Router();
const logController = require("../controllers/logController");
const authMiddleware = require("../middlewares/auth");

router.get("/logs", authMiddleware, logController.getLogs);
router.post("/create", authMiddleware, logController.createLog);
router.delete("/delete/:logId", authMiddleware, logController.deleteLogById);
router.get("/:logId", authMiddleware, logController.getLogById);

module.exports = router;
