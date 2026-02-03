const TireHistory = require("../models/tireHistoryModel");
const Trip = require("../models/tripModel");
const BusTireSlot = require("../models/busTireSlotModel");
const Bus = require("../models/busModel");

/**
 * Get history of a bus
 */
exports.getBusHistory = async (busId) => {
  return TireHistory.find({ busId })
    .populate("tireId", "tireCode maxLifeKm")
    .populate("busId", "busNumber")
    .sort({ startTime: 1 });
};

/**
 * Get history of a tire
 */
exports.getTireHistory = async (tireId) => {
  const history = await TireHistory.find({ tireId })
    .populate("busId", "busNumber")
    .populate("tireId", "tireCode maxLifeKm")
    .sort({ startTime: -1 });

  let active = history.find((h) => !h.endTime) || null;

  if (!active) {
    const mountedSlot = await BusTireSlot.findOne({ tireId }).populate(
      "busId",
      "busNumber"
    );

    if (mountedSlot) {
      active = {
        busId: mountedSlot.busId,
        slotPosition: mountedSlot.slotPosition,
        startTime: mountedSlot.mountedAt || mountedSlot.createdAt,
        isEmergency: false,
      };
    } else {
      const emergencyBus = await Bus.findOne({
        emergencyTires: tireId,
      }).select("busNumber updatedAt");

      if (emergencyBus) {
        active = {
          busId: emergencyBus,
          slotPosition: "emergency",
          startTime: emergencyBus.updatedAt || new Date(),
          isEmergency: true,
        };
      }
    }
  }

  return {
    current: active
      ? {
          busId: active.busId?._id || active.busId,
          busNumber: active.busId?.busNumber || active.busNumber,
          slotPosition: active.slotPosition,
          startTime: active.startTime,
          isEmergency: active.isEmergency,
        }
      : null,
    history,
  };
};

exports.getBusTripHistory = async (busId) => {
  // 1. Get all trips of this bus
  const trips = await Trip.find({ busId })
    .populate("busId", "busNumber")
    .populate("events.removedTire", "tireCode")
    .populate("events.installedTire", "tireCode")
    .sort({ startTime: -1 });

  // 2. Attach tire fitments per trip
  const tripsWithTires = await Promise.all(
    trips.map(async (trip) => {
      const tires = await TireHistory.find({
        busId,
        tripId: trip._id,
      })
        .populate("tireId", "tireCode maxLifeKm")
        .sort({ slotPosition: 1 });

      return {
        ...trip.toObject(),
        tires,
      };
    })
  );

  // 3. Identify current trip
  const currentTrip = tripsWithTires.find((t) => !t.endTime) || null;
  const previousTrips = tripsWithTires.filter((t) => t.endTime);

  return {
    currentTrip,
    previousTrips,
  };
};

exports.getBusTripSummary = async (busId) => {
  const trips = await Trip.find({ busId }).sort({ startTime: -1 }).lean();

  const summaries = [];

  for (const trip of trips) {
    //  Get all tire history rows for THIS trip
    const tireHistories = await TireHistory.find({
      busId,
      tripId: trip._id,
    })
      .populate("tireId", "tireCode")
      .lean();

    //  Compute distance travelled in this trip
    const distanceTravelled =
      trip.endStatus === "aborted"
        ? trip.actualDistance ?? 0
        : trip.endTime
        ? trip.totalDistance
        : trip.actualDistance ?? 0;

    //  Build slot → tire mapping
    const slotMap = tireHistories.map((th) => {
      const mountedTill = th.endTime || new Date();

      const durationHours = Math.round(
        (mountedTill - new Date(th.startTime)) / (1000 * 60 * 60)
      );

      return {
        slotPosition: th.slotPosition,
        tireCode: th.tireCodeSnapshot || th.tireId?.tireCode || "—",
        kmServed: th.kmServed,
        mountedFrom: th.startTime,
        mountedTill: th.endTime,
        durationHours,
      };
    });

    let status = "ongoing";
    if (trip.endTime) {
      status = trip.endStatus === "aborted" ? "aborted" : "completed";
    }

    summaries.push({
      tripId: trip._id,
      startTime: trip.startTime,
      endTime: trip.endTime,
      status,
      abortReason: trip.endReason || null,
      distanceTravelled,
      slots: slotMap,
    });
  }

  return {
    currentTrip: summaries.find((t) => t.status === "ongoing") || null,
    previousTrips: summaries.filter((t) => t.status !== "ongoing"),
  };
};
