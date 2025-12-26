const Trip = require("../models/tripModel");
const Tire = require("../models/tireModel");
const BusTireSlot = require("../models/busTireSlotModel");
const TireHistory = require("../models/tireHistoryModel");

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
  await trip.save();

  //  CLOSE TIRE HISTORY (THIS IS THE MISSING PART)
  await TireHistory.updateMany(
    {
      busId: trip.busId,
      tripId: trip._id,
      endTime: null,
    },
    {
      endTime: new Date(),
      removalReason:
        endStatus === "completed" ? "trip_end" : "aborted",
      kmServed: distance,
    }
  );

  //  UPDATE TIRE LIFE (KEEP YOUR EXISTING LOGIC)
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
