const mongoose = require("mongoose");

const TireHistorySchema = new mongoose.Schema(
  {
    tireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
      required: true,
    },

    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    slotPosition: {
      type: String,
      required: true,
    },

    kmServed: {
      type: Number,
      default: 0, //not required at start
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null, //filled later
    },

    removalReason: {
      type: String,
      enum: ["trip_end", "puncture", "expired", "repair"],
      default: null, // filled later
    },
  },
  { timestamps: true }
);

TireHistorySchema.index({ tireId: 1 });
TireHistorySchema.index({ busId: 1 });

module.exports = mongoose.model("TireHistory", TireHistorySchema);
