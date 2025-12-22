const TireHistory = require("../models/tireHistoryModel");
const Tire = require("../models/tireModel");
const {
  calculateTireLifecycle,
} = require("../utils/lifecycleCalculator");

exports.getTireHistory = async (tireId) => {
  return await TireHistory.find({ tireId }).sort({ startTime: 1 });
};

exports.getBusHistory = async (busId) => {
  return await TireHistory.find({ busId }).sort({ startTime: 1 });
};

/**
 * Get computed lifecycle snapshot
 */
exports.getTireLifecycleSnapshot = async (tireId) => {
  const tire = await Tire.findById(tireId);
  if (!tire) throw new Error("Tire not found");

  return calculateTireLifecycle({
    trips: [{ distance: tire.totalDistanceUsed }],
    maxLifecycleDistance: tire.maxLifeKm,
  });
};
