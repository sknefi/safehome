const mongoose = require("mongoose");
const { smart_homeDB } = require("../db/dbConnection");

const householdSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  devices: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Device",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  logs: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      deviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Device",
        required: true,
      },
      type: {
        type: String,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

if (smart_homeDB.models.Household) {
  delete smart_homeDB.models.Household;
}

const Household = smart_homeDB.model("Household", householdSchema);

module.exports = Household;
