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
  try {
    res.json(await tireService.repairTire(req.params.id, req.body));
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

exports.checkTireUsability = async (req, res) => {
  try {
    const { requiredKm } = req.body;

    await tireService.canTireRunDistance(
      req.params.id,
      Number(requiredKm)
    );

    res.json({ usable: true });
  } catch (e) {
    res.status(400).json({ usable: false, message: e.message });
  }
};
