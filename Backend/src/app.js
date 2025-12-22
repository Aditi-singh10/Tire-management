const express = require("express");
const busTireSlotRoute = require("./routes/busTireSlotRoute");
const app = express();

app.use(express.json());

app.use("/api/buses", require("./routes/busRoute"));
app.use("/api/tires", require("./routes/tireRoute"));
app.use("/api/trips", require("./routes/tripRoute"));
app.use("/api/history", require("./routes/historyRoute"));
app.use("/api/bus-tire-slots", busTireSlotRoute);


module.exports = app;
