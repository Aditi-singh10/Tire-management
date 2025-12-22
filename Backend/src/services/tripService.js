const mongoose = require("mongoose");
const Trip = require("../models/tripModel");
const BusTireSlot = require("../models/busTireSlotModel");
const TireHistory = require("../models/tireHistoryModel");
const Tire = require("../models/tireModel");

exports.startTrip = async ({ busId, totalDistance }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch mounted tires
    const slots = await BusTireSlot.find({ busId }).session(session);
    if (!slots.length) throw new Error("No tires mounted on this bus");

    // 2. Create trip
    const trip = await Trip.create(
      [
        {
          busId,
          totalDistance,
          startTime: new Date(),
          events: [],
        },
      ],
      { session }
    );

    // 3. Create TireHistory entries (start only)
    const histories = slots.map((slot) => ({
      tireId: slot.tireId,
      busId,
      slotPosition: slot.slotPosition,
      kmServed: 0,
      startTime: new Date(),
      endTime: null,
      removalReason: null,
    }));

    await TireHistory.insertMany(histories, { session });

    // 4. Mark tires as mounted
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

exports.addEvent = async (tripId, eventData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");

    // 1. Close old TireHistory
    const activeHistory = await TireHistory.findOne({
      tireId: eventData.removedTireId,
      endTime: null,
    }).session(session);

    if (!activeHistory) throw new Error("Active tire history not found");

    activeHistory.kmServed = eventData.distanceAtEvent;
    activeHistory.endTime = new Date();
    activeHistory.removalReason = "puncture";
    await activeHistory.save({ session });

    // 2. Update old tire
    await Tire.findByIdAndUpdate(
      eventData.removedTireId,
      { status: "punctured" },
      { session }
    );

    // 3. Update BusTireSlot
    await BusTireSlot.findOneAndUpdate(
      {
        busId: trip.busId,
        slotPosition: eventData.slotPosition,
      },
      { tireId: eventData.installedTireId },
      { session }
    );

    // 4. Create new TireHistory for installed tire
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

    // 5. Update new tire status
    await Tire.findByIdAndUpdate(
      eventData.installedTireId,
      { status: "mounted" },
      { session }
    );

    // 6. Push event to trip
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


exports.endTrip = async (tripId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const trip = await Trip.findById(tripId).session(session);
    if (!trip) throw new Error("Trip not found");

    // 1. Close all active TireHistory entries
    const activeHistories = await TireHistory.find({
      busId: trip.busId,
      endTime: null,
    }).session(session);

    for (const history of activeHistories) {
      history.kmServed =
        trip.totalDistance -
        trip.events.reduce((sum, e) => sum + e.distanceAtEvent, 0);
      history.endTime = new Date();
      history.removalReason = "trip_end";
      await history.save({ session });

      // update tire life
      await Tire.findByIdAndUpdate(
        history.tireId,
        { $inc: { currentLifeKm: history.kmServed } },
        { session }
      );
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
