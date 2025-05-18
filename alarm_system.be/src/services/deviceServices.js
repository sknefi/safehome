const Device = require("../models/Device");
const Household = require("../models/Household");

exports.createDevice = async (deviceData) => {
  try {
    const newDevice = new Device({
      name: deviceData.name,
      type: deviceData.type,
      active: deviceData.active,
      alarm_triggered: deviceData.alarm_triggered,
      householdId: deviceData.householdId,
      hw_id: deviceData.hw_id,
      createdBy: deviceData.createdBy,
      isAdminCreated: true,
    });

    await newDevice.save();
    return newDevice;
  } catch (error) {
    throw error;
  }
};

exports.deleteDevice = async (deviceId, adminId) => {
  try {
    const device = await Device.findById(deviceId);
    if (!device) {
      throw new Error("Zařízení nenalezeno");
    }

    const result = await Device.findByIdAndDelete(deviceId);
    return result;
  } catch (error) {
    throw error;
  }
};

exports.setAlarmTriggeredOnByHwId = async (hwId, ownerId) => {
  try {
    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      throw new Error("Device not found");
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error("You don't have permission to update this device");
    }

    device.alarm_triggered = 1;
    await device.save();

    return device;
  } catch (error) {
    throw error;
  }
};

exports.setAlarmTriggeredOffByHwId = async (hwId, ownerId) => {
  try {
    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      throw new Error("Device not found");
    }

    const household = await Household.findOne({
      _id: device.householdId,
      ownerId: ownerId,
    });

    if (!household) {
      throw new Error("You don't have permission to update this device");
    }

    device.alarm_triggered = 0;
    await device.save();

    return device;
  } catch (error) {
    throw error;
  }
};

exports.setStateActive = async (householdId) => {
  try {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error("Household not found.");
    }

    await household.map((device) => {
      device.active = true;
      device.save();
    });
    return household;
  } catch (error) {
    throw error;
  }
};

exports.setStateDeactive = async (householdId) => {
  try {
    const household = await Household.findById(householdId);
    if (!household) {
      throw new Error("Household not found.");
    }

    await household.map((device) => {
      device.active = false;
      device.save();
    });
    return household;
  } catch (error) {
    throw error;
  }
};

exports.getDevices = async (householdId) => {
  try {
    const devices = await Device.find({ householdId: householdId });
    return devices;
  } catch (error) {
    throw error;
  }
};

module.exports = exports;
