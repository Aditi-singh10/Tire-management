const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/tire/:tireId", historyController.getTireHistory);
router.get("/bus/:busId", historyController.getBusHistory);
router.get("/bus-trips/:busId", historyController.getBusTripHistory);
router.get("/bus-trip-summary/:busId", historyController.getBusTripSummary);

module.exports = router;
