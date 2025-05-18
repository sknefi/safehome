const Household = require("../models/HouseHold");
const mongoose = require("mongoose");

exports.createLog = async (logData) => {
  try {
    const newLog = {
      userId: new mongoose.Types.ObjectId(logData.userId),
      deviceId: new mongoose.Types.ObjectId(logData.deviceId),
      type: logData.type,
      message: logData.message,
      createdAt: new Date(),
    };

    const household = await Household.findByIdAndUpdate(
      logData.householdId,
      { $push: { logs: newLog } },
      { new: true }
    );

    if (!household) {
      throw new Error("Household not found");
    }

    return household.logs.id(household.logs[household.logs.length - 1]._id);
  } catch (error) {
    throw error;
  }
};

exports.deleteLogById = async (logId, adminId) => {
  try {
    const household = await Household.findOneAndUpdate(
      { "logs._id": logId },
      { $pull: { logs: { _id: logId } } },
      { new: true }
    );

    if (!household) {
      throw new Error("Log not found in any household");
    }

    return { message: "Log deleted successfully" };
  } catch (error) {
    throw error;
  }
};

exports.getLogs = async (householdId) => {
  try {
    const household = await Household.findById(householdId).select("logs");
    if (!household) {
      throw new Error("Household not found");
    }
    return household.logs;
  } catch (error) {
    throw error;
  }
};

exports.getLogById = async (logId, userId, householdId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: userId }, { members: userId }],
    });

    if (!household) {
      throw new Error("You don't have access to this household");
    }

    const log = household.logs.id(logId);
    if (!log) {
      throw new Error("Log not found in this household");
    }

    return log;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
