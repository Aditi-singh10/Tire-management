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
    const result = await tripService.endTrip(
      req.params.tripId,
      req.body // { status, reason }
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await tripService.getTrip(req.params.tripId);
    res.json(trip);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllTrips = async (req, res) => {
  try {
    const trips = await tripService.getAllTrips();
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
