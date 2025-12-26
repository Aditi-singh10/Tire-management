const express = require("express");
const router = express.Router();
const controller = require("../controllers/tripController");

router.post("/start", controller.startTrip);
// router.post("/:tripId/event", controller.addTripEvent);
router.post("/:tripId/end", controller.endTrip);
router.get("/:tripId", controller.getTrip);
router.get("/", controller.getAllTrips);

module.exports = router;
