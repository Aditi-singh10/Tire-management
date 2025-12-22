const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

router.post("/start", tripController.startTrip);
router.post("/:tripId/event", tripController.addTripEvent);
router.post("/:tripId/end", tripController.endTrip);
router.get("/:tripId", tripController.getTrip);

module.exports = router;
