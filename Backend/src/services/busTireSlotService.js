const BusTireSlot = require("../models/busTireSlotModel");
const Tire = require("../models/tireModel");
const TireHistory = require("../models/tireHistoryModel");
const Trip = require("../models/tripModel");

/**
 * MOUNT TIRE
 */
exports.mountTireToBus = async ({ busId, tireId, slotPosition }) => {
  const existingSlot = await BusTireSlot.findOne({ busId, slotPosition });
  if (existingSlot) {
    throw new Error("Slot already occupied");
  }

  //  Update tire status (KEEP)
  await Tire.findByIdAndUpdate(tireId, { status: "mounted" });

  //  Create TireHistory (NEW — THIS WAS MISSING)
  await TireHistory.create({
    tireId,
    busId,
    tripId: null,             
    slotPosition,
    startTime: new Date(),
  });

  //  Create BusTireSlot (KEEP)
  return await BusTireSlot.create({
    busId,
    tireId,
    slotPosition,
  });
};


/**
 * UNMOUNT TIRE (FIXED)
 */
exports.unmountTireFromBus = async ({ busId, slotPosition, reason, kmServed = 0 }) => {
  const slot = await BusTireSlot.findOne({ busId, slotPosition });
  if (!slot) {
    throw new Error("Slot already empty");
  }

  // Update tire status 
  let newStatus = "available";
  if (reason === "Puncture") newStatus = "repair";
  if (reason === "Wear") newStatus = "scrap";
  if (reason === "Maintenance") newStatus = "maintenance";

  await Tire.findByIdAndUpdate(slot.tireId, { status: newStatus });

  //  OPTIONAL history update
  const activeTrip = await Trip.findOne({ busId, endTime: null });

  if (activeTrip) {
    await TireHistory.findOneAndUpdate(
      {
        tireId: slot.tireId,
        busId,
        tripId: activeTrip._id,
        slotPosition,
        endTime: null,
      },
      {
        endTime: new Date(),
        kmServed,
        removalReason: reason?.toLowerCase() || null,
      }
    );
  }

  //  Always unmount
  await BusTireSlot.deleteOne({ _id: slot._id });

  return { message: "Tire unmounted successfully" };
};


/**
 * GET ALL SLOTS OF BUS
 */
exports.getBusTireSlots = async (busId) => {
  return await BusTireSlot.find({ busId }).populate("tireId");
};
