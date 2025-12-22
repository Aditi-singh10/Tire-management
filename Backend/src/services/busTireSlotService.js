const BusTireSlot = require("../models/busTireSlotModel");
const Tire = require("../models/tireModel");

exports.mountTireToBus = async ({ busId, tireId, slotPosition }) => {
  const existingSlot = await BusTireSlot.findOne({
    busId,
    slotPosition,
  });

  if (existingSlot) {
    throw new Error("Slot already occupied");
  }

  await Tire.findByIdAndUpdate(tireId, { status: "mounted" });

  return await BusTireSlot.create({
    busId,
    tireId,
    slotPosition,
  });
};

exports.getBusTireSlots = async (busId) => {
  return await BusTireSlot.find({ busId }).populate("tireId");
};
