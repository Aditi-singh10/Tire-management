const Tire = require("../models/tireModel");

/**
 * Updates tire status WITHOUT saving
 */
function deriveTireStatus(tire) {
  if (tire.currentLifeKm >= tire.maxLifeKm) {
    return "expired";
  }
  return tire.status;
}

/**
 * CREATE
 */
exports.createTire = async ({ tireCode, maxLifeKm }) => {
  return Tire.create({ tireCode, maxLifeKm });
};

/**
 * GET ALL (NO DB WRITES)
 */
exports.getAllTires = async () => {
  const tires = await Tire.find();

  return tires.map((t) => {
    const status = deriveTireStatus(t);

    return {
      _id: t._id,
      tireCode: t.tireCode,
      kmUsed: t.currentLifeKm,
      maxKm: t.maxLifeKm,
      status,
      isExpired: status === "expired",
      remainingKm: Math.max(t.maxLifeKm - t.currentLifeKm, 0),
    };
  });
};

/**
 * GET BY ID
 */
exports.getTireById = async (id) => {
  const t = await Tire.findById(id);
  if (!t) throw new Error("Tire not found");

  const status = deriveTireStatus(t);

  return {
    _id: t._id,
    tireCode: t.tireCode,
    kmUsed: t.currentLifeKm,
    maxKm: t.maxLifeKm,
    status,
    isExpired: status === "expired",
    remainingKm: Math.max(t.maxLifeKm - t.currentLifeKm, 0),
  };
};

/**
 * REPAIR TIRE
 */
exports.repairTire = async (id) => {
  const tire = await Tire.findById(id);
  if (!tire) throw new Error("Tire not found");

  if (tire.currentLifeKm >= tire.maxLifeKm) {
    throw new Error("Expired tire cannot be repaired");
  }

  if (tire.status !== "punctured") {
    throw new Error("Only punctured tires can be repaired");
  }

  tire.status = "repaired";
  await tire.save();

  return tire;
};

/**
 * CHECK IF TIRE CAN RUN REQUIRED KM
 */
exports.canTireRunDistance = async (tireId, requiredKm) => {
  const tire = await Tire.findById(tireId);
  if (!tire) throw new Error("Tire not found");

  if (tire.currentLifeKm >= tire.maxLifeKm) {
    throw new Error("Tire is expired");
  }

  const remainingKm = tire.maxLifeKm - tire.currentLifeKm;

  if (remainingKm < requiredKm) {
    throw new Error(
      `Tire has only ${remainingKm} km remaining, cannot run ${requiredKm} km`
    );
  }

  return true;
};
