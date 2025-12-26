const mongoose = require("mongoose");

const TripSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, default: null },

    endStatus: {
      type: String,
      enum: ["completed", "aborted"],
      default: null,
    },

    endReason: { type: String, default: null },

    totalDistance: {
      type: Number,
      required: true,
    },

    actualDistance: {
      type: Number,
      default: null,
    },

    events: [
      {
        type: { type: String, required: true },
        slotPosition: String,
        removedTire: { type: mongoose.Schema.Types.ObjectId, ref: "Tire" },
        installedTire: { type: mongoose.Schema.Types.ObjectId, ref: "Tire" },
        distanceAtEvent: Number,
        time: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
