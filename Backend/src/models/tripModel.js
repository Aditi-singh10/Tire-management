const mongoose = require("mongoose");

const TripEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["puncture", "replacement","expired"],
      required: true,
    },

    slotPosition: {
      type: String,
      required: true,
    },

    removedTireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
    },

    installedTireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
    },

    distanceAtEvent: {
      type: Number,
      required: true,
    },

    eventTime: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const TripSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    endTime: {
      type: Date,
    },

    totalDistance: {
      type: Number,
      required: true,
    },

    events: [TripEventSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Trip", TripSchema);
