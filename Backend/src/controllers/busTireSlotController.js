const busTireSlotService = require("../services/busTireSlotService");

/**
 * Mount tire
 */
exports.mountTire = async (req, res) => {
  try {
    const result = await busTireSlotService.mountTireToBus(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Unmount tire
 */
exports.unmountTire = async (req, res) => {
  try {
    const result = await busTireSlotService.unmountTireFromBus(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get slots
 */
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
