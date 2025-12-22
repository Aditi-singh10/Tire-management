const Tire = require("../models/tireModel");

exports.createTire = async (data) => {
  return await Tire.create(data);
};

exports.getAllTires = async () => {
  return await Tire.find();
};

exports.getTireById = async (id) => {
  return await Tire.findById(id);
};

exports.repairTire = async (tireId, data) => {
  const oldTire = await Tire.findById(tireId);
  if (!oldTire) throw new Error("Tire not found");

  oldTire.status = "repaired";
  await oldTire.save();

  return await Tire.create({
    tireCode: data.newTireCode,
    originalTireCode: oldTire.tireCode,
    maxLifeKm: data.maxLifeKm,
    status: "available",
  });
};
