const mongoose = require("mongoose");
const Trip = require("../models/tripModel");
const BusTireSlot = require("../models/busTireSlotModel");
const TireHistory = require("../models/tireHistoryModel");
const Tire = require("../models/tireModel");
const { updateTireLifecycle } = require("./tireService");

/**
 * Start Trip
 */
exports.startTrip = async ({ busId, totalDistance }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const slots = await BusTireSlot.find({ busId }).session(session);
    if (!slots.length) throw new Error("No tires mounted on this bus");

    const trip = await Trip.create(
      [{ busId, totalDistance, startTime: new Date(), events: [] }],
      { session }
    );

    const histories = slots.map((slot) => ({
      tireId: slot.tireId,
      busId,
      slotPosition: slot.slotPosition,
      kmServed: 0,
      startTime: new Date(),
    }));

    await TireHistory.insertMany(histories, { session });

    await Tire.updateMany(
      { _id: { $in: slots.map((s) => s.tireId) } },
      { status: "mounted" },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return trip[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

/**
 * Add Trip Event (puncture / replacement)
 */
exports.addEvent = async (tripId, eventData) => {
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      console.log(`🟡 addEvent attempt ${attempt}`);

      const trip = await Trip.findById(tripId).session(session);
      if (!trip) throw new Error("Trip not found");

      /* ✅ VALIDATIONS — MUST BE HERE */
      if (eventData.distanceAtEvent <= 0) {
        throw new Error("Distance must be greater than 0");
      }

      if (eventData.distanceAtEvent > trip.totalDistance) {
        throw new Error("Event distance exceeds trip distance");
      }

      const duplicateEvent = trip.events.find(
        (e) =>
          e.slotPosition === eventData.slotPosition &&
          e.distanceAtEvent === eventData.distanceAtEvent
      );

      if (duplicateEvent) {
        throw new Error("Duplicate event at same distance");
      }

      // REQUIRED FIELDS VALIDATION
      if (!eventData.type) {
        throw new Error("Event type is required");
      }

      if (!eventData.installedTireId) {
        throw new Error("Replacement tire is required");
      }

      const activeHistory = await TireHistory.findOne({
        tireId: eventData.removedTireId,
        endTime: null,
      }).session(session);

      if (!activeHistory) {
        throw new Error("Active tire history not found");
      }

      /* close old tire history */
      activeHistory.kmServed = eventData.distanceAtEvent;
      activeHistory.endTime = new Date();
      activeHistory.removalReason = eventData.type;
      await activeHistory.save({ session });

      await updateTireLifecycle(
        eventData.removedTireId,
        eventData.distanceAtEvent,
        session
      );
      const removedTireStatus =
        eventData.type === "puncture" ? "punctured" : "expired";

      await Tire.findByIdAndUpdate(
        eventData.removedTireId,
        { status: removedTireStatus },
        { session }
      );

      await BusTireSlot.findOneAndUpdate(
        { busId: trip.busId, slotPosition: eventData.slotPosition },
        { tireId: eventData.installedTireId },
        { session }
      );

      await TireHistory.create(
        [
          {
            tireId: eventData.installedTireId,
            busId: trip.busId,
            slotPosition: eventData.slotPosition,
            kmServed: 0,
            startTime: new Date(),
          },
        ],
        { session }
      );

      await Tire.findByIdAndUpdate(
        eventData.installedTireId,
        { status: "mounted" },
        { session }
      );

      trip.events.push({
        type: eventData.type,
        slotPosition: eventData.slotPosition,
        removedTireId: eventData.removedTireId,
        installedTireId: eventData.installedTireId,
        distanceAtEvent: eventData.distanceAtEvent,
        eventTime: new Date(),
      });

      await trip.save({ session });

      await session.commitTransaction();
      session.endSession();

      console.log("✅ addEvent succeeded");
      return trip;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();

      console.error(`🔴 addEvent failed attempt ${attempt}`, err.message);

      if (err.message.includes("Write conflict") && attempt < MAX_RETRIES) {
        console.log("🔁 Retrying transaction...");
        continue;
      }

      throw err;
    }
  }
};

/**
 * End Trip (MAIN lifecycle integration)
 */
exports.endTrip = async (tripId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");

    const activeHistories = await TireHistory.find({
      busId: trip.busId,
      endTime: null,
    }).session(session);

    for (const history of activeHistories) {
      history.kmServed = trip.totalDistance;
      history.endTime = new Date();
      history.removalReason = "trip_end";
      await history.save({ session });

      await updateTireLifecycle(history.tireId, history.kmServed, session);
    }

    trip.endTime = new Date();
    await trip.save({ session });

    await session.commitTransaction();
    session.endSession();

    return { message: "Trip completed successfully" };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

exports.getTrip = async (tripId) => {
  if (!tripId || !mongoose.Types.ObjectId.isValid(tripId)) {
    throw new Error("Invalid Trip ID");
  }

  const trip = await Trip.findById(tripId)
    .populate("busId")
    .populate("events.removedTireId")
    .populate("events.installedTireId");

  if (!trip) {
    throw new Error("Trip not found");
  }

  return trip;
};

exports.getAllTrips = async () => {
  return await Trip.find().populate("busId").sort({ createdAt: -1 });
};
