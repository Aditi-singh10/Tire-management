const tripService = require("../services/tripService");

exports.startTrip = async (req, res) => {
  try {
    const trip = await tripService.startTrip(req.body);
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addTripEvent = async (req, res) => {
  try {
    const trip = await tripService.addEvent(req.params.tripId, req.body);
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const result = await tripService.endTrip(req.params.tripId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTrip = async (req, res) => {
  res.json(await tripService.getTrip(req.params.tripId));
};
