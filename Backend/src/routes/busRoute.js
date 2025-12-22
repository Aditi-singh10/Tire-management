const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");

router.post("/", busController.createBus);
router.get("/", busController.getAllBuses);
router.get("/:id", busController.getBusById);

module.exports = router;
