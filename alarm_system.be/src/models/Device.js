const mongoose = require("mongoose");
const { smart_homeDB } = require("../db/dbConnection");

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true,
  },
  hw_id: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  alarm_triggered: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    // required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = smart_homeDB.model("Device", deviceSchema);

module.exports = Device;
