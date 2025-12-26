const BusTireSlot = require("../models/busTireSlotModel");
const Tire = require("../models/tireModel");

/**
 * MOUNT TIRE
 */
exports.mountTireToBus = async ({ busId, tireId, slotPosition }) => {
  // Check if slot already occupied
  const existingSlot = await BusTireSlot.findOne({ busId, slotPosition });
  if (existingSlot) {
    throw new Error("Slot already occupied");
  }

  // Update tire status
  await Tire.findByIdAndUpdate(tireId, { status: "mounted" });

  // Create slot entry
  return await BusTireSlot.create({
    busId,
    tireId,
    slotPosition,
  });
};

/**
 * UNMOUNT TIRE (FIXED)
 */
exports.unmountTireFromBus = async ({ busId, slotPosition, reason }) => {
  const slot = await BusTireSlot.findOne({ busId, slotPosition });

  if (!slot) {
    throw new Error("Slot already empty");
  }

  // Decide tire status based on reason
  let newStatus = "available";

  switch (reason) {
    case "Puncture":
      newStatus = "repair";
      break;
    case "Wear":
      newStatus = "scrap";
      break;
    case "Maintenance":
      newStatus = "maintenance";
      break;
    case "Replacement":
      newStatus = "available";
      break;
    default:
      newStatus = "available";
  }

  // Update tire status
  await Tire.findByIdAndUpdate(slot.tireId, { status: newStatus });

  // REMOVE SLOT ENTRY 
  await BusTireSlot.deleteOne({ _id: slot._id });

  return { message: "Tire unmounted successfully" };
};

/**
 * GET ALL SLOTS OF BUS
 */
exports.getBusTireSlots = async (busId) => {
  return await BusTireSlot.find({ busId }).populate("tireId");
};
