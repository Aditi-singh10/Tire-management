const mongoose = require("mongoose");

const BusTireSlotSchema = new mongoose.Schema(
  {
    busId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true,
    },

    slotPosition: {
      type: String,
      required: true,
      // example: front-left, rear-right OR slot-1
    },

    tireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tire",
      required: true,
    },

    mountedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

BusTireSlotSchema.index({ busId: 1, slotPosition: 1 }, { unique: true });

module.exports = mongoose.model("BusTireSlot", BusTireSlotSchema);
