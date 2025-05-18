const Household = require("../models/HouseHold");
const mongoose = require("mongoose");
const logService = require("../services/logService");

exports.createLog = async (req, res) => {
  try {
    const { userId, deviceId, householdId, type, message } = req.body;

    if (!userId || !deviceId || !householdId || !message || !type) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID" });
    }

    const newLog = await logService.createLog({
      userId,
      deviceId,
      householdId,
      type,
      message,
    });

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteLogById = async (req, res) => {
  try {
    const { logId } = req.params;

    if (!logId) {
      return res.status(400).json({ success: false, error: "Missing log ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(logId)) {
      return res.status(400).json({ success: false, error: "Invalid log ID" });
    }

    const deletedLog = await logService.deleteLogById(logId);

    if (!deletedLog) {
      return res.status(404).json({ success: false, error: "Log not found" });
    }

    res.status(200).json({ success: true, data: deletedLog });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const { householdId } = req.body;

    if (!householdId) {
      return res
        .status(400)
        .json({ success: false, error: "Missing household ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(householdId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid household ID" });
    }

    const logs = await logService.getLogs(householdId);

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getLogById = async (req, res) => {
  try {
    const userId = req.user.id;
    const logId = req.params.logId;
    const { householdId } = req.body;

    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: "Household ID is required",
      });
    }

    const log = await logService.getLogById(logId, userId, householdId);

    res.status(200).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.log("Error fetching log by ID", error);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
