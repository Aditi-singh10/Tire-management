const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");

// CREATE
router.post("/start", tripController.startTrip);

// READ
router.get("/", tripController.getAllTrips);
router.get("/:tripId", tripController.getTrip);

// UPDATE
router.post("/:tripId/event", tripController.addTripEvent);
router.post("/:tripId/end", tripController.endTrip);

module.exports = router;
