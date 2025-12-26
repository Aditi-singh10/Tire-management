const Trip = require("../models/tripModel");
const Tire = require("../models/tireModel");
exports.startTrip = async (data) => {
  return Trip.create(data);
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

  const { endStatus, endReason, actualDistance } = body;

  if (!endStatus) {
    throw new Error("endStatus is required");
  }

  let distance = 0;

  if (endStatus === "completed") {
    distance = Number(trip.totalDistance);
    trip.actualDistance = distance; 
  }

  if (endStatus === "aborted") {
    if (actualDistance === undefined || actualDistance === null) {
      throw new Error("Actual distance required for aborted trip");
    }

    distance = Number(actualDistance);
    trip.actualDistance = distance; 
  }

  if (Number.isNaN(distance)) {
    throw new Error("Distance calculation failed");
  }

  trip.endStatus = endStatus;
  trip.endReason = endReason || null;
  trip.endTime = new Date();

  await trip.save();

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

  /*  PUSH EVENT INTO TRIP */
  trip.events.push({
    type,
    slotPosition,
    removedTire: removedTireId,
    installedTire: installedTireId,
    distanceAtEvent,
    time: new Date(),
  });

  await trip.save();

  /*  UPDATE TIRE STATUS */
  await Tire.findByIdAndUpdate(removedTireId, {
    status: type === "puncture" ? "damaged" : "expired",
  });

  await Tire.findByIdAndUpdate(installedTireId, {
    status: "mounted",
  });

  return trip;
};
