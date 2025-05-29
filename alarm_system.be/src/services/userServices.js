const User = require("../models/User");
const Household = require("../models/HouseHold");
const Device = require("../models/Device");

exports.user = async (userData) => {
  try {
    const newUser = new User({
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.lastName,
      email: userData.email,
      role: userData.role || "",
      refreshToken: userData.refreshToken,
    });

    await newUser.save();
    return newUser;
  } catch (error) {
    throw error;
  }
};

exports.getHousehold = async (userId) => {
  try {
    const households = await Household.find({
      $or: [{ ownerId: userId }, { members: userId }],
    })
      .populate({
        path: "devices",
        model: Device,
        select: "name type active alarm_triggered createdAt hw_id",
      })
      .populate({
        path: "ownerId",
        model: User,
        select: "_id firstName lastName",
      })
      .lean();

    return households;
  } catch (error) {
    throw error;
  }
};

exports.getHouseholdById = async (householdId, userId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      $or: [{ ownerId: userId }, { members: userId }],
    });

    if (!household) {
      throw new Error("Household not found or you don't have access");
    }

    return household;
  } catch (error) {
    throw error;
  }
};

exports.getWholeHouseholdById = async (householdId, currentUserId) => {
  if (!householdId) {
    throw new Error("Household ID is required");
  }

  try {
    const household = await Household.findOne({
      _id: householdId,
    })
      .populate({
        path: "devices",
        model: Device,
        select: "name type active alarm_triggered createdAt hw_id",
      })
      .populate({
        path: "members",
        model: User,
        select: "firstName lastName email role",
      })
      .populate({
        path: "ownerId",
        model: User,
        select: "_id firstName lastName email",
      })
      .lean();

    if (!household) {
      throw new Error("Household not found or access denied");
    }

    return {
      ...household,
      isOwner: household.ownerId && household.ownerId._id.equals(currentUserId),
    };
  } catch (error) {
    console.error("Error in getWholeHouseholdById service:", error);
    throw error;
  }
};

exports.getWholeHouseholdByIdAdmin = async (householdId) => {
  if (!householdId) {
    throw new Error("Household ID is required");
  }

  try {
    const household = await Household.findOne({
      _id: householdId,
    })
      .populate({
        path: "devices",
        model: Device,
        select: "name type active alarm_triggered createdAt",
      })
      .populate({
        path: "members",
        model: User,
        select: "firstName lastName email role",
      })
      .populate({
        path: "ownerId",
        model: User,
        select: "_id firstName lastName email",
      })
      .lean();

    if (!household) {
      throw new Error("Household not found or access denied");
    }

    return household;
  } catch (error) {
    console.error("Error in getWholeHouseholdById service:", error);
    throw error;
  }
};

exports.getAllUsers = async () => {
  try {
    const users = await User.find().select("-password -refreshToken");
    return users;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
