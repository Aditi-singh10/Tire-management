const busService = require("../services/busService");

exports.createBus = async (req, res) => {
  try {
    const bus = await busService.createBus(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllBuses = async (req, res) => {
  const buses = await busService.getAllBuses();
  res.json(buses);
};

exports.getBusById = async (req, res) => {
  const bus = await busService.getBusById(req.params.id);
  res.json(bus);
};
