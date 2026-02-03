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

    tireCodeSnapshot: {
      type: String,
      default: null,
      trim: true,
    },
    
    //TRIP LINK
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      default: null,
    },

    slotPosition: {
      type: String,
      required: true,
    },

    isEmergency: {
      type: Boolean,
      default: false,
    },

    kmServed: {
      type: Number,
      default: 0,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    startDistance: {
      type: Number,
      default: null,
    },
    endDistance: {
      type: Number,
      default: null,
    },

    removalReason: {
      type: String,
      enum: [
        "trip_end",
        "puncture",
        "expired",
        "repair",
        "aborted",
        "wear",
        "replacement",
        "maintenance",
        "emergency",
      ],
      default: null,
    },
  },
  { timestamps: true }
);

TireHistorySchema.index({ tireId: 1 });
TireHistorySchema.index({ busId: 1 });

module.exports = mongoose.model("TireHistory", TireHistorySchema);
