const express = require("express");
const router = express.Router();
const emergencyService = require("../services/emergencyTireService");

router.post("/mount", async (req, res) => {
  try {
    await emergencyService.mountEmergencyTire(req.body);
    res.json({ message: "Emergency tire mounted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/unmount", async (req, res) => {
  try {
    await emergencyService.unmountEmergencyTire(req.body);
    res.json({ message: "Emergency tire unmounted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
