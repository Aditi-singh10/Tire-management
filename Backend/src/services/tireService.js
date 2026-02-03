const Tire = require("../models/tireModel");
const TireHistory = require("../models/tireHistoryModel");

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
exports.repairTire = async (id, { newTireCode, maxLifeKm }) => {
  const tire = await Tire.findById(id);
  if (!tire) throw new Error("Tire not found");

  const isExpired = tire.currentLifeKm >= tire.maxLifeKm;
  const isPunctured = tire.status === "punctured";
  const isExpiredStatus = tire.status === "expired";
  const isRepairable = isExpired || isPunctured || isExpiredStatus;

  if (!isRepairable) {
    throw new Error("Only punctured or expired tires can be repaired");
  }

  const trimmedCode = typeof newTireCode === "string" ? newTireCode.trim() : "";
  const parsedMaxLifeKm = Number(maxLifeKm);
  const hasNewIdentity = Boolean(trimmedCode) || maxLifeKm !== undefined;
  const requiresNewIdentity = isExpired || isExpiredStatus;

    if (requiresNewIdentity && !hasNewIdentity) {
    throw new Error("Expired tires require a new tire code and max life km");
  }

  if (!requiresNewIdentity && hasNewIdentity) {
    throw new Error("Only expired tires can be assigned a new ID");
  }

  if (requiresNewIdentity) {
    if (!trimmedCode) {
      throw new Error("New tire code is required");
    }
  
   if (!Number.isFinite(parsedMaxLifeKm) || parsedMaxLifeKm <= 0) {
      throw new Error("Max life km must be a positive number");
    }

     await TireHistory.updateMany(
      { tireId: tire._id, tireCodeSnapshot: { $in: [null, ""] } },
      { $set: { tireCodeSnapshot: tire.tireCode } }
    );
   tire.tireCode = trimmedCode;
    tire.maxLifeKm = parsedMaxLifeKm;
    tire.currentLifeKm = 0;

  }

  
  tire.status = "available";
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
