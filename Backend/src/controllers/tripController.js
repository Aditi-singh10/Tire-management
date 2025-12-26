const tripService = require("../services/tripService");

exports.startTrip = async (req, res) => {
  try {
    res.status(201).json(await tripService.startTrip(req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const result = await tripService.endTrip(
      req.params.tripId,
      req.body
    );
    res.json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getTrip = async (req, res) => {
  res.json(await tripService.getTrip(req.params.tripId));
};

exports.getAllTrips = async (req, res) => {
  res.json(await tripService.getAllTrips());
};

exports.addTripEvent = async (req, res) => {
  try {
    const result = await tripService.addTripEvent(
      req.params.tripId,
      req.body
    );
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
