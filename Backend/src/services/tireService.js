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
exports.updateTireLifecycle = async (tireId, kmAdded) => {
  const tire = await Tire.findById(tireId);
  if (!tire) throw new Error("Tire not found");

  // Update life km
  tire.currentLifeKm += kmAdded;

  // Calculate lifecycle
  const lifecycle = calculateTireLifecycle({
    trips: [{ distance: tire.currentLifeKm }],
    maxLifecycleDistance: tire.maxLifeKm,
  });

  // MAP lifecycle health → VALID tire.status
  if (lifecycle.status === "EXPIRED") {
    tire.status = "expired";
  } else if (tire.status !== "mounted") {
    // keep mounted if currently in use
    tire.status = "available";
  }

  await tire.save();
  return tire;
};
