const deviceServices = require("../services/deviceServices");
const Device = require("../models/Device");
const Household = require("../models/HouseHold");
const User = require("../models/User");
const mongoose = require("mongoose");
const { sendDiscordNotification } = require("../middlewares/discordNotifier");
const logService = require("../services/logService");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createDeviceLog = async (
  userId,
  deviceId,
  householdId,
  type,
  message
) => {
  try {
    await logService.createLog({
      userId,
      deviceId,
      householdId,
      type,
      message,
    });
  } catch (error) {
    console.error("Error creating device log:", error);
  }
};

exports.createDevice = async (req, res) => {
  try {
    const { name, type, active, alarm_triggered, householdId, hw_id } =
      req.body;

    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required",
      });
    }

    if (!isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Valid household ID is required",
      });
    }

    const newDevice = await deviceServices.createDevice({
      name: name.trim(),
      type: type.trim(),
      active,
      alarm_triggered,
      householdId,
      hw_id,
      createdBy: adminId,
    });

    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({
        success: false,
        message: "Household not found",
      });
    }

    household.devices.push(newDevice._id);
    await household.save();

    res.status(201).json({
      success: true,
      data: newDevice,
      householdId: household._id,
    });
  } catch (error) {
    console.error("Error creating device:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const adminId = req.admin?.id;
    const deviceId = req.params.deviceId;

    if (!adminId) {
      return res.status(403).json({
        success: false,
        message: "Pouze admin může mazat zařízení",
      });
    }

    if (!isValidObjectId(deviceId)) {
      return res.status(400).json({
        success: false,
        message: "Neplatné ID zařízení",
      });
    }

    const device = await Device.findById(deviceId);
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Zařízení nenalezeno",
      });
    }

    await Household.updateOne(
      { _id: device.householdId },
      { $pull: { devices: deviceId } }
    );

    await Device.deleteOne({ _id: deviceId });

    res.status(200).json({
      success: true,
      message: "Zařízení úspěšně smazáno",
    });
  } catch (error) {
    console.error("Chyba při mazání zařízení:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Interní chyba serveru",
    });
  }
};

exports.setAlarmTriggeredOnByHwId = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const hwId = req.params.hwId;

    if (!hwId) {
      return res.status(400).json({
        success: false,
        message: "Hardware ID is required",
      });
    }

    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (device.alarm_triggered === 1 && device.active === true) {
      return res.status(400).json({
        success: false,
        message: "Alarm is already triggered",
      });
    }

    const updatedDevice = await deviceServices.setAlarmTriggeredOnByHwId(
      hwId,
      ownerId
    );

    await createDeviceLog(
      ownerId,
      updatedDevice._id,
      updatedDevice.householdId,
      "alarm",
      `Alarm activated for device ${updatedDevice.name}.`
    );

    await sendDiscordNotification(
      `:rotating_light: Alarm triggered ON for device "${updatedDevice.name}".`
    );

    res.status(200).json({
      success: true,
      data: updatedDevice,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setAlarmTriggeredOffByHwId = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const hwId = req.params.hwId;

    if (!hwId) {
      return res.status(400).json({
        success: false,
        message: "Hardware ID is required",
      });
    }

    const device = await Device.findOne({ hw_id: hwId });
    if (!device) {
      return res.status(404).json({
        success: false,
        message: "Device not found",
      });
    }

    if (device.alarm_triggered === 0 && device.active === true) {
      return res.status(400).json({
        success: false,
        message: "Alarm is already off",
      });
    }

    const updatedDevice = await deviceServices.setAlarmTriggeredOffByHwId(
      hwId,
      ownerId
    );

    await createDeviceLog(
      ownerId,
      updatedDevice._id,
      updatedDevice.householdId,
      "alarm",
      `Alarm deactivated for device ${updatedDevice.name}`
    );

    await sendDiscordNotification(
      `:white_check_mark: Alarm triggered OFF for device "${updatedDevice.name}".`
    );

    res.status(200).json({
      success: true,
      data: updatedDevice,
    });
  } catch (error) {
    console.error("Error setting alarm:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

exports.setStateActive = async (ws, req) => {
  try {
    const ownerId = req.user?.id;
    const userType = req.userType;
    const householdId = req.body.householdId;

    if (!isValidObjectId(householdId)) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Invalid household ID",
        })
      );
      return;
    }

    let household;
    
    // If admin, can access any household. If user, only their own household
    if (userType === 'admin') {
      household = await Household.findById(householdId);
    } else {
      household = await Household.findOne({
        _id: householdId,
        ownerId: ownerId,
      });
    }

    if (!household) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household not found or you don't have permission",
        })
      );
      return;
    }

    if (household.active === true) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household is already active.",
        })
      );
      return;
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = true;
      return device.save();
    });

    await Promise.all(updatePromises);

    household.active = true;
    await household.save();

    await Promise.all(
      devices.map((device) =>
        createDeviceLog(
          ownerId,
          device._id,
          householdId,
          "activation",
          `Device ${device.name} activated`
        )
      )
    );

    await sendDiscordNotification(
      `:white_check_mark: ${userType === 'admin' ? 'Admin' : 'User'} activated ALL devices in household "${household.name}"`
    );

    ws.send(
      JSON.stringify({
        success: true,
        data: devices,
        message: "All devices activated successfully",
      })
    );
  } catch (error) {
    console.error("Error setting state active:", error);
    ws.send(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      })
    );
  }
};

exports.setStateDeactive = async (ws, req) => {
  try {
    const ownerId = req.user?.id;
    const userType = req.userType;
    const { householdId } = req.body;

    if (!isValidObjectId(householdId)) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Invalid household ID",
        })
      );
      return;
    }

    let household;
    
    // If admin, can access any household. If user, only their own household
    if (userType === 'admin') {
      household = await Household.findById(householdId);
    } else {
      household = await Household.findOne({
        _id: householdId,
        ownerId: ownerId,
      });
    }

    if (!household) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household not found or you don't have permission",
        })
      );
      return;
    }

    if (household.active === false) {
      ws.send(
        JSON.stringify({
          success: false,
          message: "Household is already deactive.",
        })
      );
      return;
    }

    const devices = await Device.find({ householdId });

    const updatePromises = devices.map((device) => {
      device.active = false;
      return device.save();
    });

    await Promise.all(updatePromises);

    household.active = false;
    await household.save();

    await Promise.all(
      devices.map((device) =>
        createDeviceLog(
          ownerId,
          device._id,
          householdId,
          "deactivation",
          `Device ${device.name} deactivated`
        )
      )
    );

    await sendDiscordNotification(
      `:octagonal_sign: ${userType === 'admin' ? 'Admin' : 'User'} deactivated ALL devices in household "${household.name}"`
    );

    ws.send(
      JSON.stringify({
        success: true,
        data: devices,
        message: "All devices deactivated successfully",
      })
    );
  } catch (error) {
    console.error("Error setting state deactive:", error);
    ws.send(
      JSON.stringify({
        success: false,
        message: error.message || "Internal server error",
      })
    );
  }
};

exports.getDevices = async (req, res) => {
  try {
    const ownerId = req.user?.id;
    const householdId = req.body.householdId;

    if (!isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid household ID",
      });
    }

    const household = await Household.findOne({
      _id: householdId,
      ownerId: ownerId,
    });

    if (!household) {
      return res.status(403).json({
        success: false,
        message: "Household not found or you don't have permission",
      });
    }

    const devices = await deviceServices.getDevices(householdId);

    res.status(200).json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error fetching devices:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
