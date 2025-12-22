const busTireSlotService = require("../services/busTireSlotService");

exports.mountTire = async (req, res) => {
  try {
    const result = await busTireSlotService.mountTireToBus(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBusSlots = async (req, res) => {
  try {
    const slots = await busTireSlotService.getBusTireSlots(
      req.params.busId
    );
    res.json(slots);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
