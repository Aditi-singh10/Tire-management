const express = require("express");
const router = express.Router();
const tireController = require("../controllers/tireController");

router.post("/", tireController.createTire);
router.get("/", tireController.getAllTires);
router.get("/:id", tireController.getTireById);
router.post("/:id/repair", tireController.repairTire);

module.exports = router;
