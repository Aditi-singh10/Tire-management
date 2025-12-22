const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/tire/:tireId", historyController.getTireHistory);
router.get("/bus/:busId", historyController.getBusHistory);

module.exports = router;
