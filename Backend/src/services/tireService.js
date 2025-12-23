const Tire = require("../models/tireModel");
const {
  calculateTireLifecycle,
} = require("../utils/lifecycleCalculator");

/**
 * Create a new tire
 */
exports.createTire = async (data) => {
  return await Tire.create({
    ...data,
    totalDistanceUsed: 0,
    remainingLifeKm: data.maxLifeKm,
    wearPercentage: 0,
    status: "available",
  });
};

/**
 * Get all tires
 */
exports.getAllTires = async () => {
  return await Tire.find();
};

/**
 * Get tire by ID
 */
exports.getTireById = async (id) => {
  return await Tire.findById(id);
};

/**
 * Repair tire (retreading)
 */
exports.repairTire = async (tireId, data) => {
  const oldTire = await Tire.findById(tireId);
  if (!oldTire) throw new Error("Tire not found");

  oldTire.status = "repaired";
  await oldTire.save();

  return await Tire.create({
    tireCode: data.newTireCode,
    originalTireCode: oldTire.tireCode,
    maxLifeKm: data.maxLifeKm,
    totalDistanceUsed: 0,
    remainingLifeKm: data.maxLifeKm,
    wearPercentage: 0,
    status: "available",
  });
};

/**
 * Update tire lifecycle using utility
 */
exports.updateTireLifecycle = async (tireId, kmAdded, session = null) => {
  const query = Tire.findById(tireId);
  if (session) query.session(session);

  const tire = await query;
  if (!tire) throw new Error("Tire not found");

 tire.totalDistanceUsed += kmAdded;

  const lifecycle = calculateTireLifecycle({
    trips: [{ distance: tire.totalDistanceUsed }],
    maxLifecycleDistance: tire.maxLifeKm,
  });

  if (lifecycle.status === "EXPIRED") {
    tire.status = "expired";
  } else if (tire.status !== "mounted") {
    tire.status = "available";
  }

  await tire.save({ session }); // SAME SESSION
  return tire;
};
