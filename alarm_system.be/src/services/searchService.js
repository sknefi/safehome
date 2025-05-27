const mongoose = require("mongoose");
const Household = require("../models/HouseHold");

exports.searchHouseholdsByHouseholdId = async (input) => {
  try {
    const conditions = [];

    if (mongoose.Types.ObjectId.isValid(input)) {
      conditions.push({ _id: input } /*, { ownerId: input }*/);
    }

    conditions.push(
      { id: { $regex: input, $options: "i" } }
      // { name: { $regex: input, $options: "i" } }
    );

    const households = await Household.find({ $or: conditions });
    return households;
  } catch (error) {
    throw error;
  }
};

exports.searchHouseholdsByOwnerId = async (input) => {
  try {
    const conditions = [];

    if (mongoose.Types.ObjectId.isValid(input)) {
      conditions.push(/*{ _id: input },*/ { ownerId: input });
    }

    conditions.push(
      { id: { $regex: input, $options: "i" } }
      // { name: { $regex: input, $options: "i" } }
    );

    const households = await Household.find({ $or: conditions });
    return households;
  } catch (error) {
    throw error;
  }
};

exports.searchHouseholdsByHouseholdName = async (input) => {
  try {
    const conditions = [];

    if (mongoose.Types.ObjectId.isValid(input)) {
      conditions.push({ _id: input }, { ownerId: input });
    }

    conditions.push(
      // { id: { $regex: input, $options: "i" } },
      { name: { $regex: input, $options: "i" } }
    );

    const households = await Household.find({ $or: conditions });
    return households;
  } catch (error) {
    throw error;
  }
};
