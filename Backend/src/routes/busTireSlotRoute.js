const express = require("express");
const router = express.Router();
const controller = require("../controllers/busTireSlotController");

router.post("/", controller.mountTire);
router.post("/unmount", controller.unmountTire);
router.get("/:busId", controller.getBusSlots);

module.exports = router;
