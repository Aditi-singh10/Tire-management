const express = require("express");
const cors = require("cors");
const busTireSlotRoute = require("./routes/busTireSlotRoute");
const busEmergencyTireRoute = require("./routes/busEmergencyTireRoutes");

const app = express();

/**
 * CORS CONFIG (must be before routes)
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

app.use("/api/buses", require("./routes/busRoute"));
app.use("/api/tires", require("./routes/tireRoute"));
app.use("/api/trips", require("./routes/tripRoute"));
app.use("/api/history", require("./routes/historyRoute"));
app.use("/api/bus-tire-slots", busTireSlotRoute);
app.use("/api/bus-emergency-tires", busEmergencyTireRoute);

module.exports = app;
