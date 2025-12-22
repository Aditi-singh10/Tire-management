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
      required: true,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    removalReason: {
      type: String,
      enum: ["trip_end", "puncture", "expired", "repair"],
      required: true,
    },
  },
  { timestamps: true }
);

TireHistorySchema.index({ tireId: 1 });
TireHistorySchema.index({ busId: 1 });

module.exports = mongoose.model("TireHistory", TireHistorySchema);
