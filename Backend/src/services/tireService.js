const Tire = require("../models/tireModel");

exports.createTire = async ({ tireCode, maxLifeKm }) => {
  return Tire.create({ tireCode, maxLifeKm });
};

exports.getAllTires = async () => {
  const tires = await Tire.find();

  // 🔥 NORMALIZE DATA FOR FRONTEND
  return tires.map((t) => ({
    _id: t._id,
    tireCode: t.tireCode,
    kmUsed: t.currentLifeKm,
    maxKm: t.maxLifeKm,
    status: t.status,
  }));
};

exports.getTireById = async (id) => {
  const t = await Tire.findById(id);
  if (!t) throw new Error("Tire not found");

  return {
    _id: t._id,
    tireCode: t.tireCode,
    kmUsed: t.currentLifeKm,
    maxKm: t.maxLifeKm,
    status: t.status,
  };
};

exports.repairTire = async (id) => {
  return Tire.findByIdAndUpdate(
    id,
    { status: "available" },
    { new: true }
  );
};
