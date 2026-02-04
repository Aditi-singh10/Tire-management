const TireHistory = require("../models/tireHistoryModel");
const Trip = require("../models/tripModel");
const BusTireSlot = require("../models/busTireSlotModel");
const Bus = require("../models/busModel");
const Tire = require("../models/tireModel")

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
     const [historyRows, tire] = await Promise.all([
    TireHistory.find({ tireId })
      .populate("busId", "busNumber")
      .populate("tireId", "tireCode maxLifeKm")
      .sort({ startTime: -1 }),
    Tire.findById(tireId).lean(),
  ]);

  const history = historyRows.map((item) => {
    const data = item.toObject();
    const startDistance = Number(data.startDistance || 0);
    const endDistance =
      data.endDistance === null || data.endDistance === undefined
        ? startDistance
        : Number(data.endDistance || 0);
    const derivedKm =
      Number(data.kmServed || 0) > 0
        ? Number(data.kmServed || 0)
        : Math.max(0, endDistance - startDistance);

    return {
      ...data,
      kmServed: derivedKm,
    };
  });
  

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

   const currentCode = tire?.tireCode || null;
  const currentDistance = Number(tire?.currentLifeKm || 0);
  const pastDistance = history.reduce((sum, item) => {
    const code =
      item.tireCodeSnapshot ||
      item.tireId?.tireCode ||
      currentCode;
    if (currentCode && code && code !== currentCode) {
      return sum + Number(item.kmServed || 0);
    }
    return sum;
  }, 0);
  const totalDistance = pastDistance + currentDistance;
  const hasRepairHistory = pastDistance > 0 && currentCode;

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
     metrics: {
      currentCode,
      currentDistance,
      pastDistance,
      totalDistance,
      hasRepairHistory,
    },
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

    //  Build slot = tire mapping
    const slotMap = tireHistories.map((th) => {
      const mountedTill = th.endTime || new Date();
      const startDistance = Number(th.startDistance || 0);
      const endDistance =
        th.endDistance === null || th.endDistance === undefined
          ? distanceTravelled
          : Number(th.endDistance || 0);
      const derivedKm =
        Number(th.kmServed || 0) > 0
          ? Number(th.kmServed || 0)
          : Math.max(0, endDistance - startDistance);

      const durationHours = Math.round(
        (mountedTill - new Date(th.startTime)) / (1000 * 60 * 60)
      );

      return {
        slotPosition: th.slotPosition,
        tireCode: th.tireCodeSnapshot || th.tireId?.tireCode || "—",
        kmServed: derivedKm,
        mountedFrom: th.startTime,
        mountedTill: th.endTime,
        durationHours,
        startDistance,
        endDistance,
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
