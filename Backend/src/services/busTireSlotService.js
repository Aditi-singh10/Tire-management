const BusTireSlot = require("../models/busTireSlotModel");
const Tire = require("../models/tireModel");
const TireHistory = require("../models/tireHistoryModel");
const Trip = require("../models/tripModel");

/**
 * MOUNT / REPLACE TIRE
 */
exports.mountTireToBus = async ({
  busId,
  tireId,
  slotPosition,
  isEmergency = false,
  reason = null,
}) => {
  const existingSlot = await BusTireSlot.findOne({ busId, slotPosition });

  //  Normal case = slot already occupied
  if (existingSlot && !isEmergency) {
    throw new Error("Slot already occupied");
  }

  //  Emergency case = replace tire in same slot
  if (existingSlot && isEmergency) {
    const oldTireId = existingSlot.tireId;

    //  Update OLD tire status
    let oldTireStatus = "available";
   if (reason === "Puncture") oldTireStatus = "punctured";
    if (reason === "Wear") oldTireStatus = "expired";


    await Tire.findByIdAndUpdate(oldTireId, { status: oldTireStatus });

    //  Close OLD tire history
    await TireHistory.findOneAndUpdate(
      {
        tireId: oldTireId,
        busId,
        slotPosition,
        endTime: null,
      },
      {
        endTime: new Date(),
        removalReason: reason?.toLowerCase() || "emergency",
      }
    );

    //  Remove old slot entry
    await BusTireSlot.deleteOne({ _id: existingSlot._id });
  }

  //  Mount NEW tire
  const mountedTire = await Tire.findByIdAndUpdate(
    tireId,
    { status: "mounted" },
    { new: true }
  );

  //  Create NEW history
  await TireHistory.create({
    tireId,
    busId,
    tripId: null,
    slotPosition,
    startTime: new Date(),
    tireCodeSnapshot: mountedTire?.tireCode || null,
  });

  //  Create slot entry
  return await BusTireSlot.create({
    busId,
    tireId,
    slotPosition,
  });
};


/**
 * UNMOUNT TIRE 
 */
exports.unmountTireFromBus = async ({
  busId,
  slotPosition,
  reason,
  kmServed = 0,
}) => {
  
  const slot = await BusTireSlot.findOne({ busId, slotPosition });
  if (!slot) {
    throw new Error("Slot already empty");
  }

  // Update tire status
  let newStatus = "available";
 if (reason === "Puncture") newStatus = "punctured";
  if (reason === "Wear") newStatus = "expired";
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
        startTime: new Date(),
        startDistance: activeTrip?.currentDistance || 0,
      },
      {
        endTime: new Date(),
        kmServed,
        removalReason: reason?.toLowerCase() || null,
      }
    );
  }

   //  Close active tire history (regardless of trip state)
  await TireHistory.findOneAndUpdate(
    {
      tireId: slot.tireId,
      busId,
      slotPosition,
      endTime: null,
    },
    {
      endTime: new Date(),
      kmServed,
      removalReason: reason?.toLowerCase() || null,
    }
  );
  
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

