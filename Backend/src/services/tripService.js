const Trip = require("../models/tripModel");
const Tire = require("../models/tireModel");
const BusTireSlot = require("../models/busTireSlotModel");
const TireHistory = require("../models/tireHistoryModel");
const Bus = require("../models/busModel");

exports.startTrip = async (data) => {
  const trip = await Trip.create(data);

  //  Find all currently mounted tires on this bus
  const mountedSlots = await BusTireSlot.find({ busId: trip.busId });

  //  Attach tripId to active TireHistory records
  for (const slot of mountedSlots) {
    await TireHistory.findOneAndUpdate(
      {
        tireId: slot.tireId,
        busId: trip.busId,
        slotPosition: slot.slotPosition,
        endTime: null,
      },
      {
        tripId: trip._id,
      }
    );
  }

  return trip;
};

exports.getTrip = async (id) => {
  return Trip.findById(id).populate("busId");
};

exports.getAllTrips = async () => {
  return Trip.find().populate("busId");
};

exports.endTrip = async (tripId, body) => {
  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");
  if (trip.endTime) throw new Error("Trip already ended");
  const { endStatus, endReason, actualDistance } = body;

  if (!endStatus) {
    throw new Error("endStatus is required");
  }

  let distance = 0;

  if (endStatus === "completed") {
    distance = Number(trip.totalDistance || 0);
  } else if (endStatus === "aborted") {
    if (actualDistance === undefined || actualDistance === null) {
      throw new Error("Actual distance required for aborted trip");
    }
    distance = Number(actualDistance);
  }

  // HARD SAFETY CHECK
  if (Number.isNaN(distance)) {
    throw new Error("Distance calculation failed (NaN)");
  }

  //  END TRIP
  trip.endStatus = endStatus;
  trip.endReason = endReason || null;
  trip.endTime = new Date();
  trip.actualDistance = distance;
  await trip.save();

   const tripEndTime = new Date();

  //  CLOSE ACTIVE TIRE HISTORIES
   const histories = await TireHistory.find({
    busId: trip.busId,
    $or: [{ tripId: trip._id }, { endTime: null }],
  });
  const tireUsage = new Map();

  for (const history of histories) {
    const startDistance = Number(history.startDistance || 0);
    let endDistance = history.endDistance;

    if (!history.endTime) {
       history.tripId = history.tripId || trip._id;
      endDistance = distance;
      history.endTime = tripEndTime;
      history.endDistance = distance;
      history.removalReason =
        endStatus === "completed" ? "trip_end" : "aborted";
    }
  
    if (endDistance === null || endDistance === undefined) {
      endDistance = distance;
      history.endDistance = distance;
    }

    if (!history.kmServed) {
      history.kmServed = Math.max(0, Number(endDistance) - startDistance);
    }

    const kmServed = Number(history.kmServed || 0);
    tireUsage.set(
      history.tireId.toString(),
      (tireUsage.get(history.tireId.toString()) || 0) + kmServed
    );

    await history.save();
  }

  //  UPDATE TIRE LIFE PER TIRE
  const tireIds = Array.from(tireUsage.keys());
  const tires = await Tire.find({ _id: { $in: tireIds } });

  for (const tire of tires) {
    const additionalKm = tireUsage.get(tire._id.toString()) || 0;
    tire.currentLifeKm = Number(tire.currentLifeKm || 0) + additionalKm;
    if (tire.currentLifeKm >= tire.maxLifeKm) {
      tire.status = "expired";
    }

    await tire.save();
  }

  return trip;
};

exports.addTripEvent = async (tripId, data) => {
  const {
    type,
    slotPosition,
    removedTireId,
    installedTireId,
    distanceAtEvent,
  } = data;

  if (
    !type ||
    !slotPosition ||
    !removedTireId ||
    !installedTireId ||
    distanceAtEvent === undefined
  ) {
    throw new Error("Missing required event data");
  }

  const trip = await Trip.findById(tripId);
  if (!trip) throw new Error("Trip not found");

   if (trip.endTime) throw new Error("Trip already ended");

  const distanceValue = Number(distanceAtEvent);
  if (Number.isNaN(distanceValue) || distanceValue <= 0) {
    throw new Error("Invalid distanceAtEvent value");
  }
  if (trip.totalDistance && distanceValue > Number(trip.totalDistance)) {
    throw new Error("Event distance exceeds trip distance");
  }

  const slot = await BusTireSlot.findOne({
    busId: trip.busId,
    slotPosition,
  });

  if (!slot) {
    throw new Error("Slot not found for this bus");
  }

  if (slot.tireId.toString() !== removedTireId.toString()) {
    throw new Error("Removed tire does not match current slot tire");
  }

  /*  PUSH EVENT INTO TRIP */
  trip.events.push({
    type,
    slotPosition,
    removedTire: removedTireId,
    installedTire: installedTireId,
    distanceAtEvent: distanceValue,
    time: new Date(),
  });

  await trip.save();

  /*  UPDATE TIRE STATUS */
   const removedStatus = type === "puncture" ? "punctured" : "expired";

  await Tire.findByIdAndUpdate(removedTireId, {
    status: removedStatus,
  });

  await Tire.findByIdAndUpdate(installedTireId, {
    status: "mounted",
  });

   await BusTireSlot.findOneAndUpdate(
    { busId: trip.busId, slotPosition },
    { tireId: installedTireId }
  );

  const bus = await Bus.findById(trip.busId);
  const wasEmergencyTire = bus?.emergencyTires?.some(
    (tireId) => tireId.toString() === installedTireId.toString()
  );

  if (wasEmergencyTire) {
    bus.emergencyTires = bus.emergencyTires.filter(
      (tireId) => tireId.toString() !== installedTireId.toString()
    );
    await bus.save();

    await TireHistory.findOneAndUpdate(
      { tireId: installedTireId, busId: trip.busId, isEmergency: true, endTime: null },
      { endTime: new Date(), removalReason: "replacement" }
    );
  }

  const activeHistory = await TireHistory.findOne({
    tireId: removedTireId,
    busId: trip.busId,
    slotPosition,
    endTime: null,
  });

  if (activeHistory) {
    const startDistance = Number(activeHistory.startDistance || 0);
    activeHistory.tripId = trip._id;
    activeHistory.endTime = new Date();
    activeHistory.endDistance = distanceValue;
    activeHistory.kmServed = Math.max(0, distanceValue - startDistance);
    activeHistory.removalReason = type;
    await activeHistory.save();
  } else {
    await TireHistory.create({
      tireId: removedTireId,
      busId: trip.busId,
      tripId: trip._id,
      slotPosition,
      startTime: trip.startTime || new Date(),
      startDistance: 0,
      endTime: new Date(),
      endDistance: distanceValue,
      kmServed: Math.max(0, distanceValue),
      removalReason: type,
    });
  }

  await TireHistory.create({
    tireId: installedTireId,
    busId: trip.busId,
    tripId: trip._id,
    slotPosition,
    isEmergency: Boolean(wasEmergencyTire),
    startTime: new Date(),
    startDistance: distanceValue,
  });

  return trip;
};