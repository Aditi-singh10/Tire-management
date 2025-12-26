const TireHistory = require("../models/tireHistoryModel");

/**
 * Get history of a bus
 */
exports.getBusHistory = async (busId) => {
  return TireHistory.find({ busId })
    .populate("tireId", "tireCode maxLifeKm") 
    .populate("busId", "busNumber")
    .sort({ startTime: 1 });
};

/**
 * Get history of a tire
 */
exports.getTireHistory = async (tireId) => {
  return TireHistory.find({ tireId })
    .populate("tireId", "tireCode maxLifeKm") 
    .populate("busId", "busNumber")
    .sort({ startTime: 1 });
};
