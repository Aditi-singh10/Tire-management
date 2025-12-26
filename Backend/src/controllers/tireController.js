const tireService = require("../services/tireService");

exports.createTire = async (req, res) => {
  try {
    const tire = await tireService.createTire(req.body);
    res.status(201).json(tire);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.getAllTires = async (req, res) => {
  res.json(await tireService.getAllTires());
};

exports.getTireById = async (req, res) => {
  res.json(await tireService.getTireById(req.params.id));
};

exports.repairTire = async (req, res) => {
  res.json(await tireService.repairTire(req.params.id));
};
