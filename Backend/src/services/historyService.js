const TireHistory = require("../models/tireHistoryModel");

exports.getTireHistory = async (tireId) => {
  return await TireHistory.find({ tireId }).sort({ startTime: 1 });
};

exports.getBusHistory = async (busId) => {
  return await TireHistory.find({ busId }).sort({ startTime: 1 });
};
