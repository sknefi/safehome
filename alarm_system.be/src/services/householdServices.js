const mongoose = require("mongoose");
const Household = require("../models/HouseHold");
const Device = require("../models/Device");

exports.createHousehold = async (householdData) => {
  try {
    const newHousehold = new Household({
      name: householdData.name,
      ownerId: householdData.ownerId,
      members: householdData.members,
      devices: householdData.devices || [],
      logs: householdData.logs || [],
    });

    await newHousehold.save();
    return newHousehold;
  } catch (error) {
    throw error;
  }
};

exports.deleteHousehold = async (householdId, userId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      ownerId: userId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }

    await household.deleteOne({ _id: householdId });

    return household;
  } catch (error) {
    throw error;
  }
};

exports.addUserToHousehold = async (householdId, userId, newUserId) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      ownerId: userId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }
    if (household.ownerId.toString() === newUserId) {
      throw new Error("You cannot add yourself as a member.");
    }

    if (household.members.includes(newUserId)) {
      throw new Error("User already exists in the household.");
    }

    household.members.push(newUserId);
    await household.save();

    return household;
  } catch (error) {
    throw error;
  }
};

exports.removeUserFromHousehold = async (
  householdId,
  ownerId,
  deleteUserId
) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }

    const userIndex = household.members.findIndex(
      (memberId) => memberId.toString() === deleteUserId
    );

    if (userIndex === -1) {
      throw new Error("User is not a member of this household.");
    }

    household.members.splice(userIndex, 1);
    await household.save();

    return household;
  } catch (error) {
    throw error;
  }
};

exports.updateHouseholdName = async (householdId, ownerId, newName) => {
  try {
    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error(
        "Household not found or you don't have rights for this action."
      );
    }

    household.name = newName;
    await household.save();

    return household;
  } catch (error) {
    throw error;
  }
};

// each HW is only assigned to one household
exports.getHouseholdStateBasedOnHwId = async (hwId) => {
  try {
    const device = await Device.findOne({ hw_id: hwId });
	if (!device) {
		throw new Error("Device not found.");
	}
	const household = await Household.findOne({ _id: device.householdId });

    if (!household) {
      throw new Error("Household not found.");
    }

    const devices = await Device.find({ householdId: household._id });

	if (devices.length === 0) {
		return false; // no devices => household is not active
	}

	let isHouseholdActive = false;
    devices.forEach((device) => {
      if (device.active) {
        isHouseholdActive = true;
      }
    });

    return isHouseholdActive; // one device is active => every device has to be active => household is active
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
