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
    distance = Number(trip.totalDistance || 0);
  } else if (endStatus === "aborted") {
    if (actualDistance === undefined || actualDistance === null) {
      throw new Error("Actual distance required for aborted trip");
    }
    distance = Number(actualDistance);
  }

  // ✅ HARD SAFETY CHECK
  if (Number.isNaN(distance)) {
    throw new Error("Distance calculation failed (NaN)");
  }

  trip.endStatus = endStatus;
  trip.endReason = endReason || null;
  trip.endTime = new Date();
  await trip.save();

  // ✅ UPDATE MOUNTED TIRES SAFELY
  const tires = await Tire.find({ status: "mounted" });

  for (const tire of tires) {
    tire.currentLifeKm = Number(tire.currentLifeKm || 0) + distance;

    if (tire.currentLifeKm >= tire.maxLifeKm) {
      tire.status = "expired";
    }

    await tire.save();
  }

  return trip;
};

