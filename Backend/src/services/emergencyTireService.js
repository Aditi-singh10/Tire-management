const Bus = require("../models/busModel");
const Tire = require("../models/tireModel");
const TireHistory = require("../models/tireHistoryModel");

exports.mountEmergencyTire = async ({ busId, tireId }) => {
  const bus = await Bus.findById(busId);

  if (bus.emergencyTires.length >= bus.emergencyTireCount) {
    throw new Error("Emergency tire capacity full");
  }

  await Tire.findByIdAndUpdate(tireId, { status: "mounted-emergency" });

  bus.emergencyTires.push(tireId);
  await bus.save();

  await TireHistory.create({
    tireId,
    busId,
    slotPosition: "emergency",
    isEmergency: true,
    startTime: new Date(),
  });
};

exports.unmountEmergencyTire = async ({ busId, tireId, reason }) => {
  await Bus.findByIdAndUpdate(busId, {
    $pull: { emergencyTires: tireId },
  });

  let status = "available";
  if (reason === "Puncture") status = "repair";

  await Tire.findByIdAndUpdate(tireId, { status });

  await TireHistory.findOneAndUpdate(
    { tireId, busId, isEmergency: true, endTime: null },
    {
      endTime: new Date(),
      removalReason: reason?.toLowerCase(),
    }
  );
};
