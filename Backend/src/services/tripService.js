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
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");

    const activeHistory = await TireHistory.findOne({
      tireId: eventData.removedTireId,
      endTime: null,
    }).session(session);

    activeHistory.kmServed = eventData.distanceAtEvent;
    activeHistory.endTime = new Date();
    activeHistory.removalReason = "puncture";
    await activeHistory.save({ session });

    await updateTireLifecycle(
      eventData.removedTireId,
      eventData.distanceAtEvent
    );

    await Tire.findByIdAndUpdate(
      eventData.removedTireId,
      { status: "punctured" },
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

    trip.events.push(eventData);
    await trip.save({ session });

    await session.commitTransaction();
    session.endSession();
    return trip;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
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

      await updateTireLifecycle(history.tireId, history.kmServed);
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
