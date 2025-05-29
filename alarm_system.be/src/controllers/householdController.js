const householdService = require("../services/householdServices");
const User = require("../models/User");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");

exports.createHousehold = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("User from token:", req.user);

    const { name, members = [], devices = [] } = req.body;
    const ownerId = req.user?.id;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid user token",
      });
    }

    // OwnerId validation
    if (!isValidObjectId(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid owner ID",
      });
    }

    // Is Existing owner ownerId validation
    const ownerExists = await User.findById(ownerId);
    if (!ownerExists) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    const newHousehold = await householdService.createHousehold({
      name: name.trim(),
      ownerId,
      members: [],
      devices: [],
      logs: [],
    });

    res.status(201).json({
      success: true,
      data: newHousehold,
      message: "Household created successfully",
    });
  } catch (error) {
    console.error("Error creating household:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;

    const deleteHousehold = await householdService.deleteHousehold(
      householdId,
      userId
    );
    res.status(200).json({
      success: true,
      message: "Household was deleted successfully",
      data: deleteHousehold,
    });
  } catch (error) {
    console.log("Error deleting household.", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteHouseholdAdmin = async (req, res) => {
  try {
    const householdId = req.params.id;

    const deleteHousehold = await householdService.deleteHouseholdAdmin(
      householdId
    );
    res.status(200).json({
      success: true,
      message: "Household was deleted successfully",
      data: deleteHousehold,
    });
  } catch (error) {
    console.log("Error deleting household.", error);

    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addUserToHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;
    const newUserId = req.body.newUserId;

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: "New user ID is required",
      });
    }

    const addUser = await householdService.addUserToHousehold(
      householdId,
      userId,
      newUserId
    );

    res.status(200).json({
      success: true,
      message: "User was added to the household successfully",
      data: addUser,
    });
  } catch (error) {
    console.log("Error adding user to household.", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addUserToHouseholdAdmin = async (req, res) => {
  try {
    const householdId = req.params.id;
    const newUserId = req.body.newUserId;

    if (!newUserId) {
      return res.status(400).json({
        success: false,
        message: "New user ID is required",
      });
    }

    const addUser = await householdService.addUserToHouseholdAdmin(
      householdId,
      newUserId
    );

    res.status(200).json({
      success: true,
      message: "User was added to the household successfully",
      data: addUser,
    });
  } catch (error) {
    console.log("Error adding user to household.", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeUserFromHousehold = async (req, res) => {
  try {
    const userId = req.user.id;
    const householdId = req.params.id;
    const deleteUserId = req.body.deleteUserId;

    if (!deleteUserId || !mongoose.Types.ObjectId.isValid(deleteUserId)) {
      return res.status(400).json({
        success: false,
        message: "Valid delete user ID is required",
      });
    }

    const updatedHousehold = await householdService.removeUserFromHousehold(
      householdId,
      userId,
      deleteUserId
    );

    res.status(200).json({
      success: true,
      message: "User was removed from the household successfully",
      data: updatedHousehold,
    });
  } catch (error) {
    console.error("Error removing user from household:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("rights")
      ? 403
      : error.message.includes("member")
      ? 400
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeUserFromHouseholdAdmin = async (req, res) => {
  try {
    const householdId = req.params.id;
    const deleteUserId = req.body.deleteUserId;

    if (!deleteUserId || !mongoose.Types.ObjectId.isValid(deleteUserId)) {
      return res.status(400).json({
        success: false,
        message: "Valid delete user ID is required",
      });
    }

    const updatedHousehold =
      await householdService.removeUserFromHouseholdAdmin(
        householdId,
        deleteUserId
      );

    res.status(200).json({
      success: true,
      message: "User was removed from the household successfully",
      data: updatedHousehold,
    });
  } catch (error) {
    console.error("Error removing user from household:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("rights")
      ? 403
      : error.message.includes("member")
      ? 400
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateHouseholdName = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const householdId = req.params.id;
    const newName = req.body.name;

    if (!newName || typeof newName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid household name is required",
      });
    }

    const updatedHousehold = await householdService.updateHouseholdName(
      householdId,
      ownerId,
      newName
    );

    res.status(200).json({
      success: true,
      message: "Household name updated successfully",
      data: updatedHousehold,
    });
  } catch (error) {
    console.error("Error updating household name:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("rights")
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateHouseholdNameAdmin = async (req, res) => {
  try {
    const householdId = req.params.id;
    const newName = req.body.name;

    if (!newName || typeof newName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid household name is required",
      });
    }

    const updatedHousehold = await householdService.updateHouseholdNameAdmin(
      householdId,
      newName
    );

    res.status(200).json({
      success: true,
      message: "Household name updated successfully",
      data: updatedHousehold,
    });
  } catch (error) {
    console.error("Error updating household name:", error);

    const statusCode = error.message.includes("not found")
      ? 404
      : error.message.includes("rights")
      ? 403
      : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
